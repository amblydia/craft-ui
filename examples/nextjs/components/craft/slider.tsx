"use client";

import { Slider as BaseSlider } from "@base-ui/react/slider";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SliderProps
  extends Omit<
    ComponentProps<typeof BaseSlider.Root<number>>,
    "children" | "aria-label"
  > {
  /** The accessible name when there is no visible `label`. */
  "aria-label"?: string;
  /** Text above the track. */
  label?: ReactNode;
  /** Shows the current value above the track, on the right. */
  showValue?: boolean;
}

export function Slider({
  "aria-label": ariaLabel,
  className,
  label,
  showValue,
  ...props
}: SliderProps) {
  return (
    <BaseSlider.Root
      className={cn(
        "group/slider font-craft-display text-craft-text data-disabled:text-craft-text-muted flex w-full flex-col gap-2 text-xl",
        className
      )}
      data-slot="slider"
      {...props}
    >
      {label || showValue ? (
        <div className="flex items-baseline justify-between gap-4">
          {label ? <BaseSlider.Label>{label}</BaseSlider.Label> : null}
          {showValue ? (
            <BaseSlider.Value className="ml-auto tabular-nums" />
          ) : null}
        </div>
      ) : null}
      <BaseSlider.Control className="flex h-[calc(var(--craft-unit)*16)] w-full touch-none items-center">
        <BaseSlider.Track
          className={cn(
            "craft-bevel relative h-[calc(var(--craft-unit)*6)] w-full",
            "[--bevel-depth:0px] [--bevel-edge:transparent] [--bevel-face:var(--craft-track)] [--bevel-hi:var(--craft-track-hi)] [--bevel-lo:var(--craft-track-lo)]",
            "group-data-disabled/slider:[--bevel-face:var(--craft-disabled)] group-data-disabled/slider:[--bevel-hi:var(--craft-disabled)] group-data-disabled/slider:[--bevel-lo:var(--craft-disabled)] group-data-disabled/slider:[--bevel-outline:var(--craft-disabled-outline)]"
          )}
        >
          <BaseSlider.Indicator className="bg-craft-primary group-data-disabled/slider:bg-craft-disabled-outline shadow-[inset_0_var(--craft-unit)_0_var(--craft-primary-hi),inset_0_calc(-1*var(--craft-unit))_0_var(--craft-primary-lo)] group-data-disabled/slider:shadow-none" />
          <BaseSlider.Thumb
            aria-label={ariaLabel}
            className={cn(
              "craft-bevel size-[calc(var(--craft-unit)*16)] cursor-grab outline-none data-dragging:cursor-grabbing",
              "[--bevel-depth:var(--craft-edge)] [--bevel-edge:var(--craft-secondary-edge)] [--bevel-face:var(--craft-secondary)] [--bevel-hi:var(--craft-secondary-hi)] [--bevel-lo:var(--craft-secondary-lo)]",
              "hover:[--bevel-face:var(--craft-secondary-hover)] hover:[--bevel-hi:var(--craft-secondary-hover-hi)] hover:[--bevel-lo:var(--craft-secondary-hover-lo)]",
              "has-focus-visible:craft-focus",
              "data-disabled:cursor-not-allowed data-disabled:[--bevel-edge:var(--craft-disabled-edge)] data-disabled:[--bevel-face:var(--craft-disabled)] data-disabled:[--bevel-hi:var(--craft-disabled)] data-disabled:[--bevel-lo:var(--craft-disabled)] data-disabled:[--bevel-outline:var(--craft-disabled-outline)]"
            )}
            data-slot="slider-thumb"
          />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
