import { join } from "node:path";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

// Component source and Next's standalone output both live above this app.
const workspaceRoot = join(import.meta.dirname, "..", "..");

/** @type {import('next').NextConfig} */
const config = {
  headers() {
    return [
      {
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
        source: "/(.*)",
      },
      {
        // Registry items are public source code, read by the CLI and tools.
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=300" },
        ],
        source: "/r/:path*",
      },
    ];
  },
  output: "standalone",
  outputFileTracingRoot: workspaceRoot,
  reactStrictMode: true,

  // The shadcn CLI asks for /r/{style}/{name}.json. CraftUI items depend on
  // Base UI directly, so one build serves every style, Radix or Base.
  rewrites() {
    return {
      beforeFiles: [
        { destination: "/r/:name", source: "/r/:style/:name(.+\\.json)" },
      ],
    };
  },
  turbopack: { root: workspaceRoot },
};

export default withMDX(config);
