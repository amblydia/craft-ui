import { readdirSync } from "node:fs";
import { join } from "node:path";

// Playwright runs from apps/web.
function pagesIn(folder: string) {
  return readdirSync(join("content", "docs", folder))
    .filter((file) => file.endsWith(".mdx") && file !== "index.mdx")
    .map((file) => `/docs/${folder}/${file.replace(".mdx", "")}`);
}

const components = pagesIn("components");
const blocks = pagesIn("blocks");

/** Pages for one component or block, which share the same sections. */
export const componentPages = [...components, ...blocks];

/** Each block on a page of its own. */
export const viewPages = blocks.map((page) =>
  page.replace("/docs/blocks/", "/view/")
);

export const allPages = [
  "/",
  "/docs",
  "/docs/installation",
  "/docs/themes",
  "/docs/playground",
  "/docs/changelog",
  "/docs/contributing",
  "/docs/sponsors",
  "/docs/blocks",
  ...componentPages,
  ...viewPages,
];
