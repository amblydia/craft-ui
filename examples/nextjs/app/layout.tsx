import { Noto_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const body = Noto_Sans({ subsets: ["latin"], variable: "--font-noto-sans" });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={body.variable} lang="en">
      <body>{children}</body>
    </html>
  );
}
