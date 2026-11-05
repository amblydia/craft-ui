"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Shares one delay across a group, so moving between tooltips opens the next at once. */
export function TooltipProvider(
  props: ComponentProps<typeof BaseTooltip.Provider>
) {
  return <BaseTooltip.Provider {...props} />;
}

export function Tooltip(props: ComponentProps<typeof BaseTooltip.Root>) {
  return <BaseTooltip.Root data-slot="tooltip" {...props} />;
}

export function TooltipTrigger(
  props: ComponentProps<typeof BaseTooltip.Trigger>
) {
  return <BaseTooltip.Trigger data-slot="tooltip-trigger" {...props} />;
}

export interface TooltipContentProps
  extends ComponentProps<typeof BaseTooltip.Popup> {
  /** How to align against the trigger. */
  align?: ComponentProps<typeof BaseTooltip.Positioner>["align"];
  /** Which side of the trigger to open on, when there is room. */
  side?: ComponentProps<typeof BaseTooltip.Positioner>["side"];
  /** The distance from the trigger, in pixels. */
  sideOffset?: ComponentProps<typeof BaseTooltip.Positioner>["sideOffset"];
}

export function TooltipContent({
  align = "end",
  children,
  className,
  side = "top",
  sideOffset = 10,
  ...props
}: TooltipContentProps) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner
        align={align}
        className="z-50"
        side={side}
        sideOffset={sideOffset}
      >
        <BaseTooltip.Popup
          className={cn(
            // Two stepped layers, so that the outline follows the corners.
            "font-craft-display text-craft-tooltip-fg relative isolate max-w-md px-3 py-1.5 leading-tight text-(length:--craft-label-size)",
            "before:bg-craft-outline before:craft-notch before:absolute before:inset-0 before:-z-20",
            "after:bg-craft-tooltip after:craft-notch after:absolute after:inset-(--craft-unit) after:-z-10",
            "data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:transition-opacity motion-safe:duration-100",
            className
          )}
          data-slot="tooltip-content"
          {...props}
        >
          {children}
          {/* The stepped speech-bubble tail: straight on one side, as in the reference. */}
          <BaseTooltip.Arrow className="flex data-[side=bottom]:-top-1.5 data-[side=bottom]:rotate-180 data-[side=left]:-right-[7px] data-[side=left]:-rotate-90 data-[side=right]:-left-[7px] data-[side=right]:rotate-90 data-[side=top]:-bottom-1.5">
            <svg
              aria-hidden="true"
              height="8"
              shapeRendering="crispEdges"
              viewBox="0 0 10 8"
              width="10"
            >
              <path
                className="fill-craft-outline"
                d="M0 0h2v2H0zM2 2h2v2H2zM4 4h2v2H4zM6 6h2v2H6zM8 0h2v6H8z"
              />
              <path
                className="fill-craft-tooltip"
                d="M2 0h6v2H2zM4 2h4v2H4zM6 4h2v2H6z"
              />
            </svg>
          </BaseTooltip.Arrow>
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
}
