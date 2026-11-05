// Regenerates examples/nextjs and examples/vite. Each one comes from a brand new
// project with components installed by the real shadcn CLI, so an example never
// holds anything a developer wouldn't receive.
//
//   bun run examples:sync

import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { repoRoot } from "./paths";

const examples = { nextjs: "next", vite: "vite" };

for (const [directory, template] of Object.entries(examples)) {
  const { status } = spawnSync(
    process.execPath,
    [
      join(import.meta.dirname, "test-install.ts"),
      "--template",
      template,
      "--export",
      join(repoRoot, "examples", directory),
    ],
    { cwd: repoRoot, stdio: "inherit" }
  );
  if (status !== 0) {
    process.exit(status ?? 1);
  }
}
