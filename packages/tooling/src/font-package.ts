// The craft-theme item installs Departure Mono as a package, so a project's
// bundler serves the font itself. There's no official package on npm, so the
// CraftUI site serves a tarball of packages/departure-mono at /fonts.
//
// The tarball is committed rather than built: lockfiles pin its hash, so its
// bytes must never change for a given version. After changing the package, bump
// its version and run `bun run font:pack`.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fontPackage } from "./paths";

const { name, version } = JSON.parse(
  readFileSync(join(fontPackage, "package.json"), "utf8")
) as { name: string; version: string };

export const fontPackageName = name;
export const fontTarball = `runqora-departure-mono-${version}.tgz`;

/** The dependency the theme item declares, for the given site URL. */
export function fontDependency(siteUrl: string) {
  return `${name}@${siteUrl}/fonts/${fontTarball}`;
}
