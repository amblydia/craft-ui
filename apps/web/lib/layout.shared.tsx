import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Logo } from "@/components/logo";
import { appName, links } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    githubUrl: links.github,
    nav: {
      title: (
        <span className="font-craft-display inline-flex items-center gap-2 text-(length:--craft-label-size)">
          <Logo className="size-6" />
          {appName}
        </span>
      ),
    },
    // Ore UI is one design, with no light or dark variant to switch between.
    themeSwitch: { enabled: false },
  };
}

/**
 * The links in the home page's top bar. The docs leave them out: their sidebar
 * already lists every page, and would show these twice.
 */
export const homeLinks: BaseLayoutProps["links"] = [
  { active: "nested-url", text: "Docs", url: "/docs" },
  { text: "Components", url: "/docs/components/button" },
  { text: "Blocks", url: "/docs/blocks" },
  { text: "Sponsors", url: "/docs/sponsors" },
];
