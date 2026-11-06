"use client";

import { Popover as BasePopover } from "@base-ui/react/popover";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Popover(props: ComponentProps<typeof BasePopover.Root>) {
  return <BasePopover.Root {...props} />;
}

/** Opens the popover. Pass `render={<Button />}` to use a CraftUI button. */
export function PopoverTrigger(
  props: ComponentProps<typeof BasePopover.Trigger>
) {
  return <BasePopover.Trigger data-slot="popover-trigger" {...props} />;
}

export function PopoverClose(props: ComponentProps<typeof BasePopover.Close>) {
  return <BasePopover.Close data-slot="popover-close" {...props} />;
}

export interface PopoverContentProps
  extends ComponentProps<typeof BasePopover.Popup> {
  /** How to align against the trigger. */
  align?: ComponentProps<typeof BasePopover.Positioner>["align"];
  /** Which side of the trigger to open on, when there is room. */
  side?: ComponentProps<typeof BasePopover.Positioner>["side"];
  /** The distance from the trigger, in pixels. */
  sideOffset?: ComponentProps<typeof BasePopover.Positioner>["sideOffset"];
}

/** A framed panel anchored to its trigger. Focus moves into it when it opens. */
export function PopoverContent({
  align = "center",
  className,
  side = "bottom",
  sideOffset = 8,
  ...props
}: PopoverContentProps) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner
        align={align}
        className="z-50"
        side={side}
        sideOffset={sideOffset}
      >
        <BasePopover.Popup
          className={cn(
            "craft-bevel text-craft-text flex w-72 max-w-(--available-width) flex-col gap-3 p-(--craft-space) outline-none",
            "[--bevel-depth:0px] [--bevel-edge:transparent] [--bevel-face:var(--craft-surface)] [--bevel-hi:var(--craft-surface-hi)] [--bevel-lo:var(--craft-surface-lo)]",
            "data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:transition-opacity motion-safe:duration-100",
            className
          )}
          data-slot="popover-content"
          {...props}
        />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

export function PopoverTitle({
  className,
  ...props
}: ComponentProps<typeof BasePopover.Title>) {
  return (
    <BasePopover.Title
      className={cn(
        "font-craft-display leading-tight text-(length:--craft-label-size)",
        className
      )}
      data-slot="popover-title"
      {...props}
    />
  );
}

export function PopoverDescription({
  className,
  ...props
}: ComponentProps<typeof BasePopover.Description>) {
  return (
    <BasePopover.Description
      className={cn("font-craft-body text-craft-text-muted text-sm", className)}
      data-slot="popover-description"
      {...props}
    />
  );
}
