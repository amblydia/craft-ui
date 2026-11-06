// Packs packages/departure-mono into apps/web/public/fonts. See font-package.ts.
//
//   bun run font:pack

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fontTarball } from "./font-package";
import { fontPackage, publicFonts } from "./paths";

if (existsSync(join(publicFonts, fontTarball))) {
  throw new Error(
    `${fontTarball} already exists. Bump the version in packages/departure-mono/package.json first, as installed projects pin the old tarball's hash.`
  );
}
mkdirSync(publicFonts, { recursive: true });
execFileSync(
  process.execPath,
  ["pm", "pack", "--filename", join(publicFonts, fontTarball)],
  { cwd: fontPackage, stdio: "inherit" }
);
