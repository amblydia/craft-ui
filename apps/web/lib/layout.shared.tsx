import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Logo } from "@/components/logo";
import { appName, links } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    githubUrl: links.github,
    links: [
      { active: "nested-url", text: "Docs", url: "/docs" },
      { text: "Components", url: "/docs/components/button" },
      { text: "Sponsors", url: "/docs/sponsors" },
    ],
    nav: {
      title: (
        <span className="font-craft-display inline-flex items-center gap-2 text-(length:--craft-label-size)">
          <Logo className="size-6" />
          {appName}
        </span>
      ),
    },
  };
}
