import { readFileSync } from "node:fs";
import { join } from "node:path";
import { highlight } from "fumadocs-core/highlight";
import type { Metadata } from "next";
import { BlockShowcase } from "@/components/block-showcase";

export const metadata: Metadata = {
  description:
    "Whole Ore UI screens built from CraftUI's components. Copy the code, or install them with the shadcn CLI.",
  title: "Blocks",
};

// The order they're shown in: the screens a game opens on come first.
const order = [
  "main-menu",
  "server-browser",
  "world-browser",
  "settings-screen",
  "inventory-screen",
  "profile-screen",
  "multiplayer-lobby",
  "marketplace",
  "game-dashboard",
  "confirmation-dialog",
];

interface RegistryItem {
  description: string;
  name: string;
  title: string;
  type: string;
}

// The build runs from apps/web.
const registryRoot = join(process.cwd(), "..", "..", "packages", "registry");

const { items } = JSON.parse(
  readFileSync(join(registryRoot, "registry.json"), "utf8")
) as { items: RegistryItem[] };

export default async function Blocks() {
  const blocks = await Promise.all(
    order.map(async (name) => {
      const item = items.find((entry) => entry.name === `craft-${name}`);
      const source = readFileSync(
        join(registryRoot, "components", "blocks", `${name}.tsx`),
        "utf8"
      );
      const code = await highlight(source, {
        lang: "tsx",
        themes: {
          dark: "github-dark-high-contrast",
          light: "github-dark-high-contrast",
        },
      });
      return {
        code,
        description: item?.description ?? "",
        name,
        source,
        title: item?.title ?? name,
      };
    })
  );

  return (
    <main className="mx-auto flex w-full max-w-(--fd-layout-width) flex-col gap-16 px-4 py-12 md:px-8">
      <header className="flex max-w-3xl flex-col gap-4">
        <h1 className="font-craft-display text-[2.75rem] leading-tight">
          Blocks
        </h1>
        <p className="text-craft-text-muted text-lg">
          Whole Ore UI screens, built from CraftUI's components. Copy the code,
          or install a block with the shadcn CLI. Then pass it your data and
          handlers: blocks never call a game or a server themselves.
        </p>
        <p className="text-craft-text-muted text-sm">
          Every block is built on{" "}
          <a className="underline" href="/docs/components/screen">
            Screen
          </a>
          . Give it a height, such as <code>h-dvh</code>, to fill a page.
        </p>
      </header>
      {blocks.map((block) => (
        <BlockShowcase
          code={block.code}
          description={block.description}
          key={block.name}
          name={block.name}
          path={`components/craft/blocks/${block.name}.tsx`}
          source={block.source}
          title={block.title}
        />
      ))}
    </main>
  );
}
