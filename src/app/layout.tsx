import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/hooks";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WebBuilder - Create stunning websites without code",
  description: "Build beautiful, high-performance websites with our drag-and-drop builder. Choose from professional templates and customize everything.",
  keywords: ["website builder", "no code", "templates", "web design"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased bg-gray-950 text-white min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
