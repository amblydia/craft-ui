// Installs CraftUI into a brand new project the way a developer would, then
// proves it works there.
//
//   bun run test:install --template <next|vite> --style <base-nova|radix-nova>
//     [--build] [--browser] [--keep]
//
// The registry is served from localhost in the same shape runqora.dev will
// expose it: /r/{style}/{name}.json. The project talks to it only through the
// @runqora namespace, so the commands under test are the documented ones.

import { spawn, spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { buildRegistry } from "./build-registry";
import { repoRoot } from "./paths";

const { values } = parseArgs({
  options: {
    browser: { default: false, type: "boolean" },
    build: { default: false, type: "boolean" },
    export: { type: "string" },
    keep: { default: false, type: "boolean" },
    style: { default: "base-nova", type: "string" },
    template: { default: "next", type: "string" },
  },
});

const STYLE_PATTERN = /^(?<base>radix|base)-(?<preset>[a-z]+)$/u;
const style = values.style ?? "";
const template = values.template === "vite" ? "vite" : "next";
const styleMatch = STYLE_PATTERN.exec(style);
if (!styleMatch?.groups) {
  throw new Error(`Unknown style: ${style}`);
}
const { base, preset } = styleMatch.groups as { base: string; preset: string };

const workDir = mkdtempSync(join(tmpdir(), "craft-install-"));
const projectDir = join(workDir, "app");
const sourceDir = template === "vite" ? join(projectDir, "src") : projectDir;
const problems: string[] = [];

// Async on purpose: this process also serves the registry, and a blocking call
// here would stop it answering the CLI that is waiting on it.
function bun(args: string[], cwd: string) {
  console.log(`\n$ bun ${args.join(" ")}`);
  return new Promise<void>((resolve, reject) => {
    spawn(process.execPath, args, { cwd, stdio: "inherit" })
      .on("error", reject)
      .on("exit", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`bun ${args.join(" ")} exited with ${code}`));
        }
      });
  });
}

function check(condition: unknown, message: string) {
  console.log(`${condition ? "ok  " : "FAIL"} ${message}`);
  if (!condition) {
    problems.push(message);
  }
}

function findCssFile() {
  const candidates = [
    "app/globals.css",
    "src/app/globals.css",
    "src/index.css",
    "src/styles/globals.css",
  ];
  const found = candidates
    .map((file) => join(projectDir, file))
    .find((file) => existsSync(file));
  if (!found) {
    throw new Error("The project has no global CSS file");
  }
  return found;
}

// ---- Serve the registry -----------------------------------------------------
const server = Bun.serve({
  fetch(request) {
    const { pathname } = new URL(request.url);
    // /r/{style}/{name}.json and /r/{name}.json both serve the one build: the
    // items depend on Base UI directly, so they are the same for every style.
    const name = pathname.split("/").at(-1) ?? "";
    const file = join(registryDir, name);
    return existsSync(file) && name.endsWith(".json")
      ? new Response(Bun.file(file))
      : new Response("Not found", { status: 404 });
  },
  port: 0,
});
const registryUrl = `http://localhost:${server.port}`;
const registryDir = buildRegistry({
  outDir: join(workDir, "registry"),
  registryUrl,
});
const itemNames = readdirSync(registryDir)
  .filter((file) => file !== "registry.json")
  .map((file) => file.replace(".json", ""));

let appProcess: ReturnType<typeof spawn> | undefined;

// `bun x` starts the real server as a child, which kill() would leave running.
function stopApp() {
  if (!appProcess?.pid) {
    return;
  }
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(appProcess.pid), "/t", "/f"]);
  } else {
    appProcess.kill();
  }
}

try {
  // ---- Create the project ---------------------------------------------------
  await bun(
    [
      "x",
      "--bun",
      "shadcn@latest",
      "init",
      "--template",
      template,
      "--base",
      base,
      "--preset",
      preset,
      "--name",
      "app",
      "--no-monorepo",
      "--yes",
    ],
    workDir
  );

  const cssFile = findCssFile();
  const cssBefore = readFileSync(cssFile, "utf8");

  // ---- Install, with the documented commands --------------------------------
  await bun(
    [
      "x",
      "--bun",
      "shadcn@latest",
      "registry",
      "add",
      `@runqora=${registryUrl}/r/{style}/{name}.json`,
    ],
    projectDir
  );
  await bun(
    [
      "x",
      "--bun",
      "shadcn@latest",
      "add",
      ...itemNames
        .filter((name) => name !== "craft-theme")
        .map((name) => `@runqora/${name}`),
      "--yes",
    ],
    projectDir
  );

  // ---- Check what landed ----------------------------------------------------
  console.log("\nChecking the installed project");
  const css = readFileSync(cssFile, "utf8");
  const manifest = readFileSync(join(projectDir, "package.json"), "utf8");
  const primaryBefore = /--primary:[^;]+;/u.exec(cssBefore)?.[0];

  for (const name of itemNames.filter((item) => item !== "craft-theme")) {
    const file = name.replace("craft-", "");
    check(
      existsSync(join(sourceDir, "components", "craft", `${file}.tsx`)),
      `${name} is installed under components/craft`
    );
  }
  check(css.includes("--craft-primary: #3c8527"), "theme variables were added");
  check(css.includes("@utility craft-bevel"), "bevel utility was added");
  check(
    css.includes("@keyframes craft-progress-slide"),
    "keyframes were added"
  );
  check(
    css.includes("--color-craft-primary: var(--craft-primary)"),
    "Tailwind colors were added"
  );
  check(
    primaryBefore && css.includes(primaryBefore),
    "shadcn/ui's own --primary is untouched"
  );
  check(manifest.includes('"@base-ui/react"'), "Base UI was installed");
  const button = readFileSync(
    join(sourceDir, "components", "craft", "button.tsx"),
    "utf8"
  );
  check(
    button.includes("@/lib/utils") || button.includes("lib/utils"),
    "imports were resolved for this project"
  );

  // ---- Compile --------------------------------------------------------------
  cpSync(
    join(repoRoot, "examples", "shared", "playground.tsx"),
    join(sourceDir, "components", "playground.tsx")
  );
  if (template === "vite") {
    writeFileSync(
      join(sourceDir, "App.tsx"),
      'import { Playground } from "@/components/playground";\n\nexport default function App() {\n  return <Playground />;\n}\n'
    );
    // The font setup from docs/themes, for projects without next/font.
    await bun(
      ["add", "@fontsource/jersey-20", "@fontsource-variable/noto-sans"],
      projectDir
    );
    const entry = join(sourceDir, "main.tsx");
    writeFileSync(
      entry,
      `import "@fontsource/jersey-20";\nimport "@fontsource-variable/noto-sans";\n${readFileSync(entry, "utf8")}`
    );
    writeFileSync(
      cssFile,
      `${readFileSync(cssFile, "utf8")}\n:root {\n  --font-noto-sans: "Noto Sans Variable";\n}\n`
    );
  } else {
    // The font setup from docs/themes, for Next.js.
    writeFileSync(
      join(sourceDir, "app", "layout.tsx"),
      `import { Jersey_20, Noto_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const display = Jersey_20({
  subsets: ["latin"],
  variable: "--font-jersey-20",
  weight: "400",
});
const body = Noto_Sans({ subsets: ["latin"], variable: "--font-noto-sans" });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={\`\${display.variable} \${body.variable}\`} lang="en">
      <body>{children}</body>
    </html>
  );
}
`
    );
    writeFileSync(
      join(sourceDir, "app", "page.tsx"),
      // A Server Component: buttonVariants must stay callable from here.
      'import { buttonVariants } from "@/components/craft/button-variants";\nimport { Playground } from "@/components/playground";\n\nexport default function Page() {\n  return (\n    <>\n      <Playground />\n      <a className={buttonVariants({ variant: "secondary" })} href="#top">\n        Back to top\n      </a>\n    </>\n  );\n}\n'
    );
  }

  await bun(
    [
      "x",
      "tsc",
      "--noEmit",
      ...(template === "vite" ? ["-p", "tsconfig.app.json"] : []),
    ],
    projectDir
  );
  check(true, "TypeScript compiles");

  if (values.build || values.browser) {
    await bun(["run", "build"], projectDir);
    check(true, "production build succeeds");
  }

  // ---- Use it in a browser --------------------------------------------------
  if (values.browser) {
    // Ask the system for a free port. A guess could find another app running
    // there, and the checks below would pass or fail against the wrong thing.
    const probe = Bun.serve({ fetch: () => new Response(), port: 0 });
    const port = probe.port;
    probe.stop(true);
    const entry =
      template === "vite"
        ? ["x", "vite", "preview", "--port", String(port), "--strictPort"]
        : ["x", "next", "start", "-p", String(port)];
    appProcess = spawn(process.execPath, entry, {
      cwd: projectDir,
      stdio: "inherit",
    });
    let exited = false;
    appProcess.on("exit", () => {
      exited = true;
    });
    const url = `http://localhost:${port}`;
    let ready = false;
    for (let attempt = 0; attempt < 60 && !(ready || exited); attempt += 1) {
      ready = await fetch(url).then(
        (response) => response.ok,
        () => false
      );
      if (!ready) {
        await Bun.sleep(1000);
      }
    }
    if (!ready) {
      throw new Error(`The app didn't start on port ${port}`);
    }
    await new Promise<void>((resolve, reject) => {
      spawn(
        "node",
        [
          join(import.meta.dirname, "browser-check.ts"),
          url,
          join(repoRoot, ".install-test", `${template}-${style}.png`),
        ],
        { stdio: "inherit" }
      ).on("exit", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error("The browser check failed"));
        }
      });
    });
  }

  // ---- Save it as an example, for `bun run examples:sync` ---------------------
  if (values.export) {
    rmSync(values.export, { force: true, recursive: true });
    cpSync(projectDir, values.export, {
      filter: (source) =>
        !/[\\/](node_modules|\.next|dist|AGENTS\.md|CLAUDE\.md|\.git)$/u.test(
          source
        ),
      recursive: true,
    });
    const configPath = join(values.export, "components.json");
    writeFileSync(
      configPath,
      readFileSync(configPath, "utf8").replaceAll(
        registryUrl,
        "https://runqora.dev"
      )
    );
  }
} finally {
  stopApp();
  server.stop(true);
  if (values.keep) {
    console.log(`\nKept the project at ${projectDir}`);
  } else {
    try {
      rmSync(workDir, {
        force: true,
        maxRetries: 10,
        recursive: true,
        retryDelay: 500,
      });
    } catch {
      console.warn(`Couldn't remove ${workDir}. It's safe to delete.`);
    }
  }
}

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s):\n${problems.join("\n")}`);
  process.exit(1);
}
console.log(`\nInstalled and verified ${template} with ${style}.`);
