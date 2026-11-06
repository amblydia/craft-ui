"use client";

import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface RadioGroupProps extends ComponentProps<typeof BaseRadioGroup> {
  /** Stacks the options, or lines them up in a row that wraps. */
  orientation?: "horizontal" | "vertical";
}

export function RadioGroup({
  className,
  orientation = "vertical",
  ...props
}: RadioGroupProps) {
  return (
    <BaseRadioGroup
      className={cn(
        "flex gap-3",
        orientation === "horizontal"
          ? "flex-row flex-wrap gap-x-6"
          : "flex-col",
        className
      )}
      data-orientation={orientation}
      data-slot="radio-group"
      {...props}
    />
  );
}

export interface RadioProps extends ComponentProps<typeof BaseRadio.Root> {
  /**
   * Text beside the diamond, joined to it so that clicking the text selects
   * it. Without a label, pass `aria-label`.
   */
  label?: ReactNode;
}

/**
 * Ore UI's diamond: the checkbox's bevel turned on its corner, with a gem in the
 * middle when selected.
 */
export function Radio({ className, disabled, label, ...props }: RadioProps) {
  const radio = (
    <BaseRadio.Root
      className={cn(
        "group/radio relative inline-flex size-[calc(var(--craft-unit)*14)] shrink-0 cursor-pointer items-center justify-center outline-none data-disabled:cursor-not-allowed",
        !label && className
      )}
      data-slot="radio"
      disabled={disabled}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "craft-bevel absolute size-[calc(var(--craft-unit)*10)] rotate-45",
          "[--bevel-depth:0px] [--bevel-edge:transparent] [--bevel-face:var(--craft-track)] [--bevel-hi:var(--craft-track-hi)] [--bevel-lo:var(--craft-track-lo)]",
          "group-hover/radio:[--bevel-face:var(--craft-track-hover)] group-hover/radio:[--bevel-hi:var(--craft-track-hover-hi)] group-hover/radio:[--bevel-lo:var(--craft-track-hover-lo)]",
          "group-active/radio:[--bevel-face:var(--craft-track-active)] group-active/radio:[--bevel-hi:var(--craft-track-active-hi)] group-active/radio:[--bevel-lo:var(--craft-track-active-lo)]",
          "group-data-checked/radio:[--bevel-face:var(--craft-primary)] group-data-checked/radio:[--bevel-hi:var(--craft-primary-hi)] group-data-checked/radio:[--bevel-lo:var(--craft-primary-lo)]",
          "group-data-checked/radio:group-hover/radio:[--bevel-face:var(--craft-primary-hover)] group-data-checked/radio:group-hover/radio:[--bevel-hi:var(--craft-primary-hover-hi)] group-data-checked/radio:group-hover/radio:[--bevel-lo:var(--craft-primary-hover-lo)]",
          "group-data-checked/radio:group-active/radio:[--bevel-face:var(--craft-primary-active)] group-data-checked/radio:group-active/radio:[--bevel-hi:var(--craft-primary-active-hi)] group-data-checked/radio:group-active/radio:[--bevel-lo:var(--craft-primary-active-lo)]",
          // The ring is turned with the diamond, so it hugs its outline.
          "group-focus-visible/radio:craft-focus",
          "group-data-disabled/radio:[--bevel-face:var(--craft-disabled)] group-data-disabled/radio:[--bevel-hi:var(--craft-disabled-hi)] group-data-disabled/radio:[--bevel-lo:var(--craft-disabled-lo)] group-data-disabled/radio:[--bevel-outline:var(--craft-disabled-outline)]"
        )}
      />
      {/* The gem: lit from the top, darkest at the bottom. */}
      <BaseRadio.Indicator
        className="absolute size-[calc(var(--craft-unit)*4)] rotate-45 bg-[conic-gradient(var(--craft-gem)_0_90deg,var(--craft-gem-lo)_0_180deg,var(--craft-gem)_0_270deg,var(--craft-gem-hi)_0)]"
        data-slot="radio-indicator"
      />
    </BaseRadio.Root>
  );

  if (!label) {
    return radio;
  }

  return (
    <label
      className={cn(
        "font-craft-display text-craft-text inline-flex cursor-pointer items-center gap-3 text-(length:--craft-label-size)",
        disabled && "text-craft-text-muted cursor-not-allowed",
        className
      )}
      data-slot="radio-label"
    >
      {radio}
      {label}
    </label>
  );
}
