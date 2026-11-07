import type { Metadata } from "next";
import { buttonVariants } from "@/components/craft/button-variants";
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/components/craft/panel";
import { links } from "@/lib/shared";

export const metadata: Metadata = {
  description: "CraftUI is free, and sponsorships keep it going.",
  title: "Sponsors",
};

export default function Sponsors() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-12 md:px-8">
      <header className="flex flex-col gap-4">
        <h1 className="font-craft-display text-[2.75rem] leading-tight">
          Sponsors
        </h1>
        <p className="text-craft-text-muted text-lg">
          Every component, block and example is free and MIT licensed. There's
          no paid tier, no account and no license key. CraftUI is funded only by
          sponsorships.
        </p>
        <p className="text-craft-text-muted">
          Sponsoring supports the time it takes to build new components, keep up
          with React, Tailwind and Base UI, and answer issues.
        </p>
        <div>
          <a
            className={buttonVariants({ size: "lg" })}
            href={links.sponsor}
            rel="noreferrer"
            target="_blank"
          >
            Sponsor on GitHub
          </a>
        </div>
      </header>

      <Panel framed>
        <PanelHeader>
          <PanelTitle>What sponsors get</PanelTitle>
        </PanelHeader>
        <PanelContent>
          <p className="text-craft-text-muted">
            Thanks, and a place on this page and in the README. Sponsorship
            never changes who can use what, and sponsor messages never appear
            inside installed components.
          </p>
        </PanelContent>
      </Panel>

      <section aria-labelledby="sponsor-list" className="flex flex-col gap-3">
        <h2
          className="font-craft-display text-(length:--craft-label-size)"
          id="sponsor-list"
        >
          Our sponsors
        </h2>
        <p className="text-craft-text-muted">
          No sponsors yet. You could be the first.
        </p>
      </section>
    </main>
  );
}
