"use client";

import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Scrollbar({
  orientation,
}: {
  orientation: "horizontal" | "vertical";
}) {
  return (
    <BaseScrollArea.Scrollbar
      className={cn(
        "bg-craft-sunken flex",
        orientation === "vertical"
          ? "border-craft-outline w-[calc(var(--craft-unit)*5)] border-l-(length:--craft-unit)"
          : "border-craft-outline h-[calc(var(--craft-unit)*5)] border-t-(length:--craft-unit)"
      )}
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
    >
      <BaseScrollArea.Thumb
        className={cn(
          "craft-bevel [--bevel-depth:0px] [--bevel-edge:transparent] [--bevel-face:var(--craft-secondary)] [--bevel-hi:var(--craft-secondary-hi)] [--bevel-lo:var(--craft-secondary-lo)] hover:[--bevel-face:var(--craft-secondary-hover)]",
          orientation === "vertical" ? "w-full" : "h-full"
        )}
        data-slot="scroll-area-thumb"
      />
    </BaseScrollArea.Scrollbar>
  );
}

export interface ScrollAreaProps
  extends ComponentProps<typeof BaseScrollArea.Root> {
  /**
   * Names the scrolling region for screen readers. It can be reached with Tab
   * and scrolled with the arrow keys, so it should say what it holds.
   */
  label?: string;
  /** Which directions show a scrollbar. */
  orientation?: "vertical" | "horizontal" | "both";
}

export function ScrollArea({
  children,
  className,
  label,
  orientation = "vertical",
  ...props
}: ScrollAreaProps) {
  return (
    <BaseScrollArea.Root
      className={cn(
        "border-craft-outline relative flex min-h-0 overflow-hidden border-(length:--craft-unit)",
        className
      )}
      data-slot="scroll-area"
      {...props}
    >
      <BaseScrollArea.Viewport
        aria-label={label}
        className="focus-visible:craft-focus size-full outline-none focus-visible:-outline-offset-2"
        role={label ? "group" : undefined}
        tabIndex={0}
      >
        <BaseScrollArea.Content>{children}</BaseScrollArea.Content>
      </BaseScrollArea.Viewport>
      {orientation !== "horizontal" && <Scrollbar orientation="vertical" />}
      {orientation !== "vertical" && <Scrollbar orientation="horizontal" />}
      {orientation === "both" && (
        <BaseScrollArea.Corner className="bg-craft-sunken" />
      )}
    </BaseScrollArea.Root>
  );
}
