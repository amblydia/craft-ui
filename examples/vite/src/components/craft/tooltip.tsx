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
  align = "center",
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
            "rounded-craft border-craft-outline bg-craft-tooltip font-craft-display text-craft-tooltip-fg relative max-w-xs border-(length:--craft-unit) px-2 py-1 text-lg",
            "data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:transition-opacity motion-safe:duration-100",
            className
          )}
          data-slot="tooltip-content"
          {...props}
        >
          {children}
          {/* The stepped speech-bubble pointer. */}
          <BaseTooltip.Arrow className="flex data-[side=bottom]:-top-2 data-[side=bottom]:rotate-180 data-[side=left]:-right-3 data-[side=left]:-rotate-90 data-[side=right]:-left-3 data-[side=right]:rotate-90 data-[side=top]:-bottom-2">
            <svg
              aria-hidden="true"
              height="8"
              shapeRendering="crispEdges"
              viewBox="0 0 12 8"
              width="12"
            >
              <path
                className="fill-craft-outline"
                d="M0 0h12v2h-2v2H8v2H4V4H2V2H0z"
              />
              <path className="fill-craft-tooltip" d="M2 0h8v2H8v2H4V2H2z" />
            </svg>
          </BaseTooltip.Arrow>
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
}
