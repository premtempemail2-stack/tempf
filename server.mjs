import { createServer as createHttpServer } from "node:http";
import { createServer as createHttpsServer } from "node:https";
import { readFileSync } from "node:fs";
import { parse } from "node:url";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const httpPort = parseInt(process.env.PORT || "3000", 10);
const httpsPort = parseInt(process.env.HTTPS_PORT || "3443", 10);

const sslCert = process.env.SSL_CERT || "./certs/cert.pem";
const sslKey = process.env.SSL_KEY || "./certs/key.pem";

// Use dynamic import for next since it's a CJS package
const next = (await import("next")).default;

const app = next({ dev, hostname, port: httpPort });
const handle = app.getRequestHandler();

await app.prepare();

// HTTP server
createHttpServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  handle(req, res, parsedUrl);
}).listen(httpPort, () => {
  console.log(`> HTTP  ready on http://${hostname}:${httpPort}`);
});

// HTTPS server
try {
  const httpsOptions = {
    cert: readFileSync(sslCert),
    key: readFileSync(sslKey),
  };

  createHttpsServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(httpsPort, () => {
    console.log(`> HTTPS ready on https://${hostname}:${httpsPort}`);
  });
} catch (err) {
  console.warn(`\n⚠  HTTPS server skipped — could not read SSL certificates.`);
  console.warn(`   Expected cert: ${sslCert}`);
  console.warn(`   Expected key:  ${sslKey}`);
  console.warn(`   Run "npm run generate-certs" to create them.\n`);
}
