import { join } from "node:path";

export const repoRoot = join(import.meta.dirname, "..", "..", "..");
export const registryRoot = join(repoRoot, "packages", "registry");
export const registrySource = join(registryRoot, "registry.json");
export const themeSource = join(registryRoot, "themes", "craft.css");
export const publicRegistry = join(repoRoot, "apps", "web", "public", "r");

/** Where the registry is served from in production. */
export const productionUrl = "https://craftui.runqora.dev";

/** The Departure Mono package, which installed projects get as a tarball. */
export const fontPackage = join(repoRoot, "packages", "departure-mono");
export const publicFonts = join(repoRoot, "apps", "web", "public", "fonts");
