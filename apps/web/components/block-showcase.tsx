"use client";

import { type ReactNode, useState } from "react";
import { Button } from "@/components/craft/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/craft/tabs";

// Largest first, as the toggles read.
const widths = [
  { key: "desktop", label: "Desktop", width: "100%" },
  { key: "tablet", label: "Tablet", width: "768px" },
  { key: "phone", label: "Phone", width: "390px" },
] as const;

type Width = (typeof widths)[number]["key"];

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };
  return { copied, copy };
}

export interface BlockShowcaseProps {
  /** The highlighted source, rendered on the server. */
  code: ReactNode;
  description: string;
  /** The registry name, without the `craft-` prefix. */
  name: string;
  /** Where the block's file is written, such as components/craft/blocks/x.tsx. */
  path: string;
  /** The plain source, for copying. */
  source: string;
  title: string;
}

/**
 * One block on the gallery: its name, a live preview at three widths, its
 * code, and the command that installs it, each with a copy button.
 */
export function BlockShowcase({
  code,
  description,
  name,
  path,
  source,
  title,
}: BlockShowcaseProps) {
  const [view, setView] = useState<"preview" | "code">("preview");
  const [width, setWidth] = useState<Width>("desktop");
  const { copied, copy } = useCopy();
  const command = `npx shadcn@latest add @runqora/craft-${name}`;

  return (
    <section
      aria-labelledby={`${name}-title`}
      className="flex scroll-mt-20 flex-col gap-3"
      data-slot="block-showcase"
      id={name}
    >
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h2
            className="font-craft-display leading-tight text-(length:--craft-label-size)"
            id={`${name}-title`}
          >
            <a className="hover:underline" href={`#${name}`}>
              {title}
            </a>
          </h2>
          <p className="text-craft-text-muted max-w-2xl text-sm">
            {description}
          </p>
        </div>
        {/* Compact controls, through CraftUI's own size tokens. */}
        <div className="flex flex-wrap items-center gap-2 [--craft-control-md:2.25rem] [--craft-control-sm:2rem] [--craft-label-size:0.875rem]">
          <Tabs
            className="w-auto"
            onValueChange={(next) => setView(next as "preview" | "code")}
            value={view}
          >
            <TabsList aria-label={`${title} view`} className="w-auto">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </Tabs>
          {view === "preview" ? (
            <fieldset className="hidden items-center gap-1 md:flex">
              <legend className="sr-only">Preview width</legend>
              {widths.map((option) => (
                <Button
                  aria-pressed={width === option.key}
                  key={option.key}
                  onClick={() => setWidth(option.key)}
                  size="sm"
                  variant={width === option.key ? "secondary" : "ghost"}
                >
                  {option.label}
                </Button>
              ))}
            </fieldset>
          ) : null}
          <a
            className="text-craft-text-muted hover:text-craft-text px-2 text-sm underline"
            href={`/view/${name}`}
            rel="noopener"
            target="_blank"
          >
            Open in a new tab
          </a>
        </div>
      </div>

      <div className="border-craft-outline bg-craft-sunken flex items-center gap-2 border-2 py-1 pr-1 pl-3 [--craft-control-sm:2rem] [--craft-label-size:0.875rem]">
        <code className="font-craft-display min-w-0 flex-1 truncate text-sm">
          {command}
        </code>
        <Button
          aria-label={
            copied === "command" ? "Copied" : `Copy the command for ${title}`
          }
          onClick={() => copy("command", command)}
          size="sm"
          variant="secondary"
        >
          {copied === "command" ? "Copied" : "Copy"}
        </Button>
      </div>

      {view === "preview" ? (
        <div className="border-craft-outline bg-craft-background flex justify-center overflow-hidden border-2">
          <iframe
            className="bg-craft-background h-[44rem] max-h-[80dvh] max-w-full border-0 motion-safe:transition-[width] motion-safe:duration-200"
            loading="lazy"
            // The preview runs the block's own page, which needs its scripts.
            sandbox="allow-scripts allow-same-origin"
            src={`/view/${name}`}
            style={{
              width: widths.find((option) => option.key === width)?.width,
            }}
            title={`${title} preview`}
          />
        </div>
      ) : (
        <div className="border-craft-outline flex flex-col border-2">
          <div className="bg-craft-surface flex items-center gap-2 py-1 pr-1 pl-3 [--craft-control-sm:2rem] [--craft-label-size:0.875rem]">
            <span className="font-craft-display min-w-0 flex-1 truncate text-sm">
              {path}
            </span>
            <Button
              aria-label={
                copied === "source" ? "Copied" : `Copy the code for ${title}`
              }
              onClick={() => copy("source", source)}
              size="sm"
              variant="secondary"
            >
              {copied === "source" ? "Copied" : "Copy"}
            </Button>
          </div>
          <div
            className="bg-craft-sunken max-h-[44rem] overflow-auto text-sm [&_pre]:p-4"
            // biome-ignore lint/a11y/noNoninteractiveTabindex: the code scrolls, so the keyboard needs to reach it.
            tabIndex={0}
          >
            {code}
          </div>
        </div>
      )}
    </section>
  );
}
