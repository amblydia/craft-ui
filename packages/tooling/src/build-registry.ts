// Builds the registry into apps/web/public/r:
//
//   1. Fills in the craft-theme item from themes/craft.css.
//   2. Points CraftUI's own registryDependencies at absolute URLs.
//   3. Runs `shadcn build`, which reads each component into its JSON file.
//   4. Validates what came out.
//
// Step 2 is what keeps CraftUI independent. An item that said
// `@runqora/craft-theme` could only be installed by a project that has that
// namespace configured and only once Runqora's registry serves CraftUI. An
// absolute URL resolves the same way through `@runqora`, a direct URL or a fork.
//
// REGISTRY_URL overrides the URL, which the install test uses to serve the
// registry from localhost.

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fontDependency, fontPackageName } from "./font-package";
import {
  productionUrl,
  publicRegistry,
  registryRoot,
  registrySource,
  themeSource,
} from "./paths";
import { themeToRegistry } from "./theme-to-registry";
import { validateRegistry } from "./validate-registry";

// The version pinned in this package, not whatever `bunx` would download.
const shadcnCli = join(
  import.meta.dirname,
  "..",
  "node_modules",
  "shadcn",
  "dist",
  "index.js"
);

interface SourceItem {
  name: string;
  registryDependencies?: string[];
  [key: string]: unknown;
}

export function prepareRegistry(registryUrl: string) {
  const registry = JSON.parse(readFileSync(registrySource, "utf8")) as {
    items: SourceItem[];
    [key: string]: unknown;
  };
  const theme = themeToRegistry(readFileSync(themeSource, "utf8"));
  const names = new Set(registry.items.map((item) => item.name));

  return {
    ...registry,
    items: registry.items.map((item) => ({
      ...item,
      ...(item.name === "craft-theme"
        ? {
            ...theme,
            css: { [`@import "${fontPackageName}"`]: {}, ...theme.css },
            // The CLI can't write an @font-face rule into a project's CSS, and
            // an @import of a URL lands after Tailwind's rules, where browsers
            // ignore it. A package import is inlined instead, so the project
            // bundles the font. See font-package.ts.
            dependencies: [fontDependency(registryUrl)],
          }
        : {}),
      ...(item.registryDependencies
        ? {
            registryDependencies: item.registryDependencies.map((dependency) =>
              names.has(dependency)
                ? `${registryUrl}/r/${dependency}.json`
                : dependency
            ),
          }
        : {}),
    })),
  };
}

export function buildRegistry({
  outDir = publicRegistry,
  registryUrl = process.env.REGISTRY_URL ?? productionUrl,
} = {}) {
  const url = registryUrl.replace(/\/$/u, "");
  // `shadcn build` resolves file paths from its working directory, so the
  // prepared definition sits next to the source for the length of the build.
  const prepared = join(registryRoot, ".registry-build.json");

  rmSync(outDir, { force: true, recursive: true });
  mkdirSync(outDir, { recursive: true });
  writeFileSync(prepared, JSON.stringify(prepareRegistry(url), null, 2));
  try {
    execFileSync(
      process.execPath,
      [shadcnCli, "build", prepared, "--output", outDir],
      { cwd: registryRoot, stdio: "inherit" }
    );
  } finally {
    rmSync(prepared, { force: true });
  }

  validateRegistry(outDir);
  return outDir;
}

if (import.meta.main) {
  buildRegistry();
}
