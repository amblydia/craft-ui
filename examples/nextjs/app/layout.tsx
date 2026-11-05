import { Jersey_20, Noto_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const display = Jersey_20({
  subsets: ["latin"],
  variable: "--font-jersey-20",
  weight: "400",
});
const body = Noto_Sans({ subsets: ["latin"], variable: "--font-noto-sans" });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={`${display.variable} ${body.variable}`} lang="en">
      <body>{children}</body>
    </html>
  );
}
