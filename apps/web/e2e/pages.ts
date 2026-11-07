import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Playwright runs from apps/web.
function pagesIn(folder: string) {
  return readdirSync(join("content", "docs", folder))
    .filter((file) => file.endsWith(".mdx") && file !== "index.mdx")
    .map((file) => `/docs/${folder}/${file.replace(".mdx", "")}`);
}

/** Pages for one component, which share the same sections. */
export const componentPages = pagesIn("components");

const { items } = JSON.parse(
  readFileSync(
    join("..", "..", "packages", "registry", "registry.json"),
    "utf8"
  )
) as { items: { name: string; type: string }[] };

/** Each block, and the Screen they share, on a page of its own. */
export const viewPages = [
  "/view/screen",
  ...items
    .filter((item) => item.type === "registry:block")
    .map((item) => `/view/${item.name.replace("craft-", "")}`),
];

export const allPages = [
  "/",
  "/blocks",
  "/docs",
  "/docs/installation",
  "/docs/themes",
  "/docs/playground",
  "/docs/changelog",
  "/docs/contributing",
  "/docs/sponsors",
  ...componentPages,
  ...viewPages,
];

/**
 * What to wait for after opening a page. The blocks gallery keeps loading live
 * previews, so its network never goes quiet for long: wait for the page itself.
 */
export function loadedState(path: string) {
  return path === "/blocks" ? "load" : "networkidle";
}
