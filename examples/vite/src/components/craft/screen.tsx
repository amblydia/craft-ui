"use client";

import { type ComponentProps, type ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

export interface ScreenProps extends ComponentProps<"div"> {
  /**
   * Fills the screen behind the content, such as an `<img>` of the world. It's
   * decorative, so give an image an empty `alt`.
   */
  background?: ReactNode;
}

/**
 * A whole Ore UI screen: a picture behind everything, a bar along the top, and
 * the content. It's a container, so the layouts inside it follow its width,
 * not the window's.
 */
export function Screen({
  background,
  children,
  className,
  ...props
}: ScreenProps) {
  return (
    <div
      className={cn(
        "bg-craft-background text-craft-text @container/screen relative isolate flex min-h-full flex-col",
        className
      )}
      data-slot="screen"
      {...props}
    >
      {background ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 overflow-hidden [&>img]:size-full [&>img]:object-cover [&>svg]:size-full"
          data-slot="screen-background"
        >
          {background}
        </div>
      ) : null}
      {children}
    </div>
  );
}

function BackIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[calc(var(--craft-unit)*8)] w-[calc(var(--craft-unit)*4)]"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 4 8"
    >
      <path d="M3 0h1v1h-1zM2 1h1v1h-1zM1 2h1v1h-1zM0 3h1v1h-1zM0 4h1v1h-1zM1 5h1v1h-1zM2 6h1v1h-1zM3 7h1v1h-1z" />
    </svg>
  );
}

export interface ScreenHeaderProps
  extends Omit<ComponentProps<"header">, "title"> {
  /** Buttons at the end of the bar, such as Social. */
  actions?: ReactNode;
  /** The back button's accessible name. */
  backLabel?: string;
  /** Called by the back arrow. Without it, there is no back arrow. */
  onBack?: () => void;
  /** The screen's name, in the middle of the bar. It's the page's heading. */
  title: ReactNode;
}

/**
 * The light bar along the top of a screen: a back arrow, the screen's name in
 * capitals, and actions at the end, split off by a groove.
 */
export function ScreenHeader({
  actions,
  backLabel = "Back",
  className,
  onBack,
  title,
  ...props
}: ScreenHeaderProps) {
  return (
    <header
      className={cn(
        // The title is centered on the bar when there's room. On a narrow
        // screen, the sides take what they need and the title takes the rest.
        "bg-craft-header text-craft-header-fg relative grid min-h-(--craft-control-lg) shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-stretch pb-[calc(var(--craft-unit)*3)] @xl/screen:grid-cols-[1fr_auto_1fr]",
        "shadow-[inset_0_calc(-1*var(--craft-unit)*2)_0_var(--craft-header-lo),inset_0_calc(-1*var(--craft-unit)*3)_0_var(--craft-header-hi)]",
        className
      )}
      data-slot="screen-header"
      {...props}
    >
      <div className="flex items-center">
        {onBack ? (
          <button
            aria-label={backLabel}
            className="hover:bg-craft-hover focus-visible:craft-focus flex h-full w-(--craft-control-lg) cursor-pointer items-center justify-center outline-none [--craft-focus:var(--craft-header-fg)] [--craft-hover:rgb(30_30_31/0.1)] focus-visible:-outline-offset-2"
            data-slot="screen-back"
            onClick={onBack}
            type="button"
          >
            <BackIcon />
          </button>
        ) : null}
      </div>
      <h1
        className="font-craft-display flex min-w-0 items-center justify-center px-(--craft-space) text-center leading-tight tracking-widest break-words text-(length:--craft-label-size) uppercase"
        data-slot="screen-title"
      >
        {title}
      </h1>
      <div className="flex items-stretch justify-end">
        {actions ? (
          <div
            className="flex items-center gap-2 px-(--craft-space) shadow-[inset_var(--craft-unit)_0_0_var(--craft-header-lo),inset_calc(var(--craft-unit)*2)_0_0_var(--craft-header-hi)]"
            data-slot="screen-actions"
          >
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}

/** The content under the bar. It scrolls when the screen is taller than its frame. */
export function ScreenBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-(--craft-space) @3xl/screen:px-[calc(var(--craft-space)*2)]",
        className
      )}
      data-slot="screen-body"
      {...props}
    />
  );
}

const tones = {
  accent: "bg-craft-tag-accent",
  destructive: "bg-craft-tag-destructive",
  info: "bg-craft-tag-info",
  neutral: "bg-craft-tag-neutral",
  primary: "bg-craft-tag-primary",
  warning: "bg-craft-tag-warning",
};

export interface ScreenSectionProps
  extends Omit<ComponentProps<"section">, "title"> {
  /** Something at the end of the heading, such as a See all button. */
  action?: ReactNode;
  /** The section's name. */
  title: ReactNode;
  /**
   * Without a tone, the title sits on a dark box, followed by a thin light
   * rule, as over a world picture. With one, it's a colored tag with a rule of
   * the same color, as in Ore UI's profile and party screens.
   */
  tone?: keyof typeof tones;
}

/** A titled part of a screen, such as "Top games" or "Received invites". */
export function ScreenSection({
  action,
  children,
  className,
  title,
  tone,
  ...props
}: ScreenSectionProps) {
  const id = useId();
  const heading = (
    <h2
      className={cn(
        "font-craft-display shrink-0 px-2 py-1 leading-tight text-(length:--craft-label-size)",
        tone
          ? cn(
              tones[tone],
              tone === "neutral"
                ? "text-craft-tag-neutral-fg"
                : "text-craft-tag-fg"
            )
          : "bg-craft-overlay text-craft-text"
      )}
      id={id}
    >
      {title}
    </h2>
  );

  return (
    <section
      aria-labelledby={id}
      className={cn("flex flex-col gap-3", className)}
      data-slot="screen-section"
      data-tone={tone}
      {...props}
    >
      <div
        className={cn("flex gap-3", tone ? "items-end gap-0" : "items-center")}
      >
        {heading}
        <span
          aria-hidden="true"
          className={cn(
            "min-w-4 flex-1",
            tone
              ? cn("h-[calc(var(--craft-unit)*2)]", tones[tone])
              : "bg-craft-text/40 h-(--craft-unit)"
          )}
        />
        {action ? <div className="ml-3 shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
