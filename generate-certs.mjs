/**
 * Generates self-signed SSL certificates for local HTTPS development.
 * Creates certs/key.pem and certs/cert.pem using Node.js built-in crypto.
 */
import { generateKeyPairSync, createSign, randomBytes } from "crypto";
import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const certsDir = join(__dirname, "certs");

mkdirSync(certsDir, { recursive: true });

// Generate RSA key pair
const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

// Export private key as PEM
const keyPem = privateKey.export({ type: "pkcs8", format: "pem" });
writeFileSync(join(certsDir, "key.pem"), keyPem);

// --- Build a self-signed X.509 certificate manually using ASN.1 DER ---

function encodeLength(len) {
  if (len < 0x80) return Buffer.from([len]);
  const bytes = [];
  let temp = len;
  while (temp > 0) {
    bytes.unshift(temp & 0xff);
    temp >>= 8;
  }
  return Buffer.from([0x80 | bytes.length, ...bytes]);
}

function encodeTLV(tag, value) {
  return Buffer.concat([Buffer.from([tag]), encodeLength(value.length), value]);
}

function encodeSequence(...items) {
  const body = Buffer.concat(items);
  return encodeTLV(0x30, body);
}

function encodeSet(...items) {
  const body = Buffer.concat(items);
  return encodeTLV(0x31, body);
}

function encodeOID(oid) {
  const parts = oid.split(".").map(Number);
  const bytes = [40 * parts[0] + parts[1]];
  for (let i = 2; i < parts.length; i++) {
    let val = parts[i];
    if (val < 128) {
      bytes.push(val);
    } else {
      const chunks = [];
      chunks.push(val & 0x7f);
      val >>= 7;
      while (val > 0) {
        chunks.push((val & 0x7f) | 0x80);
        val >>= 7;
      }
      bytes.push(...chunks.reverse());
    }
  }
  return encodeTLV(0x06, Buffer.from(bytes));
}

function encodeUTF8String(str) {
  return encodeTLV(0x0c, Buffer.from(str, "utf8"));
}

function encodePrintableString(str) {
  return encodeTLV(0x13, Buffer.from(str, "ascii"));
}

function encodeInteger(buf) {
  // Ensure positive by prepending 0x00 if high bit set
  if (buf[0] & 0x80) buf = Buffer.concat([Buffer.from([0x00]), buf]);
  return encodeTLV(0x02, buf);
}

function encodeUTCTime(date) {
  const s =
    String(date.getUTCFullYear()).slice(-2) +
    String(date.getUTCMonth() + 1).padStart(2, "0") +
    String(date.getUTCDate()).padStart(2, "0") +
    String(date.getUTCHours()).padStart(2, "0") +
    String(date.getUTCMinutes()).padStart(2, "0") +
    String(date.getUTCSeconds()).padStart(2, "0") +
    "Z";
  return encodeTLV(0x17, Buffer.from(s, "ascii"));
}

function encodeBitString(buf) {
  // Prepend 0x00 (no unused bits)
  return encodeTLV(0x03, Buffer.concat([Buffer.from([0x00]), buf]));
}

// SHA-256 with RSA OID
const sha256WithRSA = encodeSequence(
  encodeOID("1.2.840.113549.1.1.11"),
  encodeTLV(0x05, Buffer.alloc(0)) // NULL
);

// Subject / Issuer: CN=localhost
const nameRDN = encodeSequence(
  encodeSet(
    encodeSequence(
      encodeOID("2.5.4.3"), // commonName
      encodeUTF8String("localhost")
    )
  )
);

// Validity: now → +1 year
const notBefore = new Date();
const notAfter = new Date();
notAfter.setFullYear(notAfter.getFullYear() + 1);
const validity = encodeSequence(
  encodeUTCTime(notBefore),
  encodeUTCTime(notAfter)
);

// Serial number
const serial = encodeInteger(randomBytes(8));

// Subject Public Key Info (from DER export)
const pubDer = publicKey.export({ type: "spki", format: "der" });

// Subject Alt Names extension: DNS:localhost, IP:127.0.0.1
const sanExtValue = encodeSequence(
  // DNS: localhost
  encodeTLV(0x82, Buffer.from("localhost", "ascii")),
  // IP: 127.0.0.1
  encodeTLV(0x87, Buffer.from([127, 0, 0, 1]))
);

const extensions = encodeTLV(
  0xa3, // explicit tag [3]
  encodeSequence(
    // Basic Constraints: CA=false
    encodeSequence(
      encodeOID("2.5.29.19"),
      encodeTLV(0x01, Buffer.from([0xff])), // critical
      encodeTLV(0x04, encodeSequence()) // empty = not CA
    ),
    // Subject Alternative Name
    encodeSequence(encodeOID("2.5.29.17"), encodeTLV(0x04, sanExtValue))
  )
);

// TBS Certificate
const version = encodeTLV(0xa0, encodeInteger(Buffer.from([0x02]))); // v3
const tbsCertificate = encodeSequence(
  version,
  serial,
  sha256WithRSA,
  nameRDN, // issuer
  validity,
  nameRDN, // subject
  pubDer,
  extensions
);

// Sign the TBS certificate
const sign = createSign("SHA256");
sign.update(tbsCertificate);
sign.end();
const signature = sign.sign(privateKey);

// Full certificate
const certificate = encodeSequence(
  tbsCertificate,
  sha256WithRSA,
  encodeBitString(signature)
);

// Write as PEM
const certPem =
  "-----BEGIN CERTIFICATE-----\n" +
  certificate
    .toString("base64")
    .match(/.{1,64}/g)
    .join("\n") +
  "\n-----END CERTIFICATE-----\n";

writeFileSync(join(certsDir, "cert.pem"), certPem);

console.log("✅ Self-signed SSL certificates generated in ./certs/");
console.log("   cert: certs/cert.pem");
console.log("   key:  certs/key.pem");
console.log("   Valid for: 1 year (localhost + 127.0.0.1)");
