import { readdirSync } from "node:fs";
import { join } from "node:path";

// Playwright runs from apps/web.
const components = readdirSync(join("content", "docs", "components"))
  .filter((file) => file.endsWith(".mdx"))
  .map((file) => `/docs/components/${file.replace(".mdx", "")}`);

export const componentPages = components;

export const allPages = [
  "/",
  "/docs",
  "/docs/installation",
  "/docs/themes",
  "/docs/playground",
  "/docs/changelog",
  "/docs/contributing",
  "/docs/sponsors",
  ...components,
];
