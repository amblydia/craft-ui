import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { appName, description, siteUrl } from "@/lib/shared";
import "./global.css";

const body = Noto_Sans({ subsets: ["latin"], variable: "--font-noto-sans" });

export const metadata: Metadata = {
  description,
  metadataBase: new URL(siteUrl),
  openGraph: { siteName: appName, type: "website" },
  title: { default: `${appName} by Runqora`, template: `%s | ${appName}` },
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html className={body.variable} lang="en" suppressHydrationWarning>
      <head>
        <link href="/fonts/departure-mono.css" rel="stylesheet" />
      </head>
      <body className="bg-craft-background flex min-h-screen flex-col">
        <RootProvider theme={{ defaultTheme: "dark" }}>{children}</RootProvider>
      </body>
    </html>
  );
}
