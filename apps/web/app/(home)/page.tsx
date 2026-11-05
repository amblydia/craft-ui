import {
  ArrowRight01Icon,
  FavouriteIcon,
  GithubIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { buttonVariants } from "@/components/craft/button-variants";
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/components/craft/panel";
import { ButtonVariants } from "@/components/demos/button-variants";
import { CheckboxDemo } from "@/components/demos/checkbox-demo";
import { DialogDemo } from "@/components/demos/dialog-demo";
import { ProgressIndeterminate } from "@/components/demos/progress-indeterminate";
import { SliderDemo } from "@/components/demos/slider-demo";
import { SwitchDemo } from "@/components/demos/switch-demo";
import { TabsSegmented } from "@/components/demos/tabs-segmented";
import { TooltipSides } from "@/components/demos/tooltip-sides";
import { CopyCommand } from "@/components/home/copy-command";
import { PixelLandscape } from "@/components/home/pixel-landscape";
import { ServerListPreview } from "@/components/home/server-list-preview";
import { description, disclaimer, links, tagline } from "@/lib/shared";

const features = [
  {
    text: "Colors and proportions measured from published Ore UI references, drawn entirely from original code and art.",
    title: "Recognizable",
  },
  {
    text: "Built on Base UI, with full keyboard support, screen reader support and WCAG AA contrast in both modes.",
    title: "Accessible",
  },
  {
    text: "The CLI copies the source into your project. Change anything, and pay nothing, for good.",
    title: "Yours",
  },
  {
    text: "Every token starts with craft, so it works beside shadcn/ui on one page or across a whole app.",
    title: "Polite",
  },
];

const showcase = [
  { Demo: ButtonVariants, title: "Button", wide: true },
  { Demo: SwitchDemo, title: "Switch" },
  { Demo: CheckboxDemo, title: "Checkbox" },
  { Demo: SliderDemo, title: "Slider" },
  { Demo: ProgressIndeterminate, title: "Progress" },
  { Demo: TabsSegmented, title: "Tabs", wide: true },
  { Demo: DialogDemo, title: "Dialog" },
  { Demo: TooltipSides, title: "Tooltip" },
];

export default function HomePage() {
  return (
    <main className="text-craft-text flex flex-1 flex-col">
      <section className="relative isolate overflow-hidden">
        <PixelLandscape className="absolute inset-0 -z-10 size-full" />
        <div className="absolute inset-0 -z-10 bg-black/45" />
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-14 md:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:py-20">
          <div className="flex flex-col items-start gap-6 text-white">
            <p className="font-craft-display text-xl">
              CraftUI <span className="opacity-90">by Runqora</span>
            </p>
            <h1 className="font-craft-display max-w-xl text-5xl leading-none font-normal text-balance sm:text-7xl">
              {tagline}
            </h1>
            <p className="max-w-xl text-lg">{description}</p>
            <CopyCommand command="npx shadcn@latest add @runqora/craft-button" />
            <div className="flex flex-wrap gap-3">
              <Link
                className={buttonVariants({ size: "lg" })}
                href="/docs/installation"
              >
                Get started
                <HugeiconsIcon icon={ArrowRight01Icon} />
              </Link>
              <Link
                className={buttonVariants({ size: "lg", variant: "secondary" })}
                href="/docs/components/button"
              >
                Components
              </Link>
            </div>
          </div>
          <div className="dark">
            <ServerListPreview />
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 py-12 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        {features.map((feature) => (
          <Panel key={feature.title}>
            <PanelHeader>
              <PanelTitle>{feature.title}</PanelTitle>
            </PanelHeader>
            <PanelContent className="text-craft-text-muted text-sm">
              {feature.text}
            </PanelContent>
          </Panel>
        ))}
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-16 md:px-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-craft-display text-4xl font-normal">
            The real components, right here
          </h2>
          <p className="text-craft-text-muted">
            Everything on this page works. Click it, tab to it, drag it.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {showcase.map(({ Demo, title, wide }) => (
            <Panel className={wide ? "md:col-span-2" : undefined} key={title}>
              <PanelHeader>
                <PanelTitle>{title}</PanelTitle>
              </PanelHeader>
              <PanelContent className="flex flex-1 flex-wrap items-center justify-center gap-3 pb-6">
                <Demo />
              </PanelContent>
            </Panel>
          ))}
        </div>
      </section>

      <footer className="border-craft-outline bg-craft-sunken mt-auto border-t-2">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 md:px-6">
          <div className="flex flex-wrap gap-3">
            <a
              className={buttonVariants({ size: "sm", variant: "secondary" })}
              href={links.github}
              rel="noreferrer"
              target="_blank"
            >
              <HugeiconsIcon icon={GithubIcon} />
              GitHub
            </a>
            <a
              className={buttonVariants({ size: "sm", variant: "secondary" })}
              href={links.sponsor}
              rel="noreferrer"
              target="_blank"
            >
              <HugeiconsIcon icon={FavouriteIcon} />
              Sponsor
            </a>
            <Link
              className={buttonVariants({ size: "sm", variant: "ghost" })}
              href="/docs"
            >
              Documentation
            </Link>
          </div>
          <p className="text-craft-text-muted max-w-3xl text-sm">
            {disclaimer} CraftUI is open source under the MIT license, and part
            of{" "}
            <a className="underline" href={links.runqora}>
              Runqora
            </a>
            .
          </p>
        </div>
      </footer>
    </main>
  );
}
