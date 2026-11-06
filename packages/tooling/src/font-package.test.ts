import { describe, expect, it } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fontDependency, fontTarball } from "./font-package";
import { fontPackage, publicFonts } from "./paths";

const tarball = join(publicFonts, fontTarball);

describe("the font package", () => {
  it("has a committed tarball for its current version", () => {
    expect(existsSync(tarball)).toBe(true);
  });

  it("matches its source, so a change can't ship without a new version", () => {
    for (const file of [
      "package.json",
      "index.css",
      "DepartureMono-Regular.woff2",
      "OFL.txt",
    ]) {
      const packed = execFileSync(
        "tar",
        ["-xOzf", fontTarball, `package/${file}`],
        {
          cwd: publicFonts,
        }
      );
      expect(packed.equals(readFileSync(join(fontPackage, file)))).toBe(true);
    }
  });

  it("is declared as a tarball on the given site", () => {
    expect(fontDependency("https://craftui.runqora.dev")).toBe(
      `@runqora/departure-mono@https://craftui.runqora.dev/fonts/${fontTarball}`
    );
  });
});
