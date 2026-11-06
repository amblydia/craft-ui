// Checks the built registry beyond what `shadcn build` does. A registry can be
// schema-valid and still fail in a developer's project, for example when an item
// imports a package it doesn't declare, which only breaks for someone installing
// that one component. These checks catch that from the JSON alone.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { registryItemSchema, registrySchema } from "shadcn/schema";
import { publicRegistry } from "./paths";

const NAME_PATTERN = /^craft-[a-z0-9]+(-[a-z0-9]+)*$/u;
const IMPORT_PATTERN = /(?:from|import)\s+"(?<specifier>[^"]+)"/gu;
const CLIENT_ONLY_PATTERN = /\buse(State|Effect|Ref|Context|Id)\b/u;

function packageName(specifier: string) {
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

function dependencyName(dependency: string) {
  const at = dependency.lastIndexOf("@");
  return at > 0 ? dependency.slice(0, at) : dependency;
}

function checkFile(
  item: {
    dependencies?: string[];
    name: string;
    registryDependencies?: string[];
  },
  file: { content?: string; path: string; target?: string },
  siblings: string[],
  owners: Map<string, string[]>
) {
  const problems: string[] = [];
  const where = `${item.name} (${file.path})`;
  const content = file.content ?? "";

  if (!content) {
    problems.push(`${where}: has no content`);
  }
  if (!file.target?.startsWith("@components/craft/")) {
    problems.push(
      `${where}: must install under @components/craft/ so it can't overwrite a shadcn/ui component`
    );
  }
  if (content.includes("minecraft.net") || content.includes("mojang")) {
    problems.push(`${where}: mentions a proprietary source`);
  }

  const registryDependencies = item.registryDependencies ?? [];
  const dependencies = (item.dependencies ?? []).map(dependencyName);

  for (const { groups } of content.matchAll(IMPORT_PATTERN)) {
    const specifier = groups?.specifier ?? "";
    if (specifier === "@/lib/utils") {
      if (!registryDependencies.includes("utils")) {
        problems.push(
          `${where}: imports @/lib/utils without depending on utils`
        );
      }
    } else if (specifier.startsWith("@/components/craft/")) {
      // The item that ships the imported file, such as craft-button for
      // button-variants, must be installed alongside.
      const target = specifier.replace("@/components/", "@components/");
      const sameItem = siblings.some((sibling) => sibling.startsWith(target));
      const names = owners.get(target) ?? [];
      if (
        !(
          sameItem ||
          names.some((name) =>
            registryDependencies.some((d) => d.endsWith(`/${name}.json`))
          )
        )
      ) {
        problems.push(
          `${where}: imports ${specifier} without depending on ${names.join(" or ") || "the item that ships it"}`
        );
      }
    } else if (specifier.startsWith("@/") || specifier.startsWith(".")) {
      problems.push(`${where}: unsupported import ${specifier}`);
    } else if (specifier !== "react") {
      const name = packageName(specifier);
      if (name && !dependencies.includes(name)) {
        problems.push(`${where}: imports ${name} without declaring it`);
      }
    }
  }

  if (
    CLIENT_ONLY_PATTERN.test(content) &&
    !content.startsWith('"use client"')
  ) {
    problems.push(`${where}: uses client-only code without "use client"`);
  }

  return problems;
}

export function validateRegistry(dir = publicRegistry) {
  const problems: string[] = [];
  const indexPath = join(dir, "registry.json");

  if (!existsSync(indexPath)) {
    throw new Error(`No registry at ${dir}. Run \`bun run registry:build\`.`);
  }

  const index = registrySchema.parse(
    JSON.parse(readFileSync(indexPath, "utf8"))
  );
  const seen = new Set<string>();

  for (const entry of index.items) {
    if (!NAME_PATTERN.test(entry.name)) {
      problems.push(`${entry.name}: names must look like craft-<name>`);
    }
    if (seen.has(entry.name)) {
      problems.push(`${entry.name}: duplicate name`);
    }
    seen.add(entry.name);
  }

  const files = readdirSync(dir).filter(
    (file) => file.endsWith(".json") && file !== "registry.json"
  );
  const items = files.map((file) => ({
    file,
    item: registryItemSchema.parse(
      JSON.parse(readFileSync(join(dir, file), "utf8"))
    ),
  }));
  // Which items ship each file, keyed by its target without the extension.
  const owners = new Map<string, string[]>();
  for (const { item } of items) {
    for (const entry of item.files ?? []) {
      const target = (entry.target ?? "").replace(/.tsx?$/u, "");
      owners.set(target, [...(owners.get(target) ?? []), item.name]);
    }
  }

  for (const { file, item } of items) {
    if (`${item.name}.json` !== file) {
      problems.push(`${file}: holds an item named ${item.name}`);
    }
    if (!seen.has(item.name)) {
      problems.push(`${file}: is not listed in registry.json`);
    }
    seen.delete(item.name);

    const targets = (item.files ?? []).map((entry) => entry.target ?? "");
    for (const registryFile of item.files ?? []) {
      problems.push(...checkFile(item, registryFile, targets, owners));
    }
    if (item.type === "registry:theme" && !item.cssVars?.light) {
      problems.push(`${item.name}: has no theme variables`);
    }
  }
  for (const missing of seen) {
    problems.push(`${missing}: is listed in registry.json but has no file`);
  }

  if (problems.length > 0) {
    throw new Error(`The registry is invalid:\n${problems.join("\n")}`);
  }
  console.log(`Registry OK: ${files.length} items in ${dir}`);
}

if (import.meta.main) {
  validateRegistry();
}
