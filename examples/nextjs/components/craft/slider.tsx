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
  /** Marks every step with a notch in the track. For sliders with few steps. */
  showSteps?: boolean;
  /** Shows the current value above the track, on the right. */
  showValue?: boolean;
}

const MAX_NOTCHES = 100;

/** The positions of the notches, as percentages along the track. */
function notchPositions(min: number, max: number, step: number) {
  const steps = Math.round((max - min) / step);
  if (steps < 2 || steps > MAX_NOTCHES) {
    return [];
  }
  return Array.from(
    { length: steps - 1 },
    (_, index) => ((index + 1) / steps) * 100
  );
}

export function Slider({
  "aria-label": ariaLabel,
  className,
  label,
  showSteps,
  showValue,
  ...props
}: SliderProps) {
  const { max = 100, min = 0, step = 1 } = props;
  const notches = showSteps ? notchPositions(min, max, step) : [];

  return (
    <BaseSlider.Root
      className={cn(
        "group/slider font-craft-display text-craft-text data-disabled:text-craft-text-muted flex w-full flex-col gap-2 text-(length:--craft-label-size)",
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
            "group-data-disabled/slider:[--bevel-face:var(--craft-disabled)] group-data-disabled/slider:[--bevel-hi:var(--craft-disabled-hi)] group-data-disabled/slider:[--bevel-lo:var(--craft-disabled-lo)] group-data-disabled/slider:[--bevel-outline:var(--craft-disabled-outline)]"
          )}
        >
          <BaseSlider.Indicator className="bg-craft-primary h-full! shadow-[inset_0_var(--craft-unit)_0_var(--craft-primary-hi),inset_0_calc(-1*var(--craft-unit))_0_var(--craft-primary-lo)] group-data-disabled/slider:bg-transparent group-data-disabled/slider:shadow-none" />
          {notches.map((position) => (
            <span
              aria-hidden="true"
              className="bg-craft-outline group-data-disabled/slider:bg-craft-disabled-outline absolute inset-y-0 w-(--craft-unit) -translate-x-1/2"
              data-slot="slider-notch"
              key={position}
              style={{ left: `${position}%` }}
            />
          ))}
          <BaseSlider.Thumb
            aria-label={ariaLabel}
            className={cn(
              "craft-bevel size-[calc(var(--craft-unit)*16)] cursor-grab outline-none data-dragging:cursor-grabbing",
              "[--bevel-depth:var(--craft-edge)] [--bevel-edge:var(--craft-secondary-edge)] [--bevel-face:var(--craft-secondary)] [--bevel-hi:var(--craft-secondary-hi)] [--bevel-lo:var(--craft-secondary-lo)]",
              "has-focus-visible:craft-focus",
              "data-disabled:cursor-not-allowed data-disabled:[--bevel-edge:var(--craft-disabled-edge)] data-disabled:[--bevel-outline:var(--craft-disabled-outline)]"
            )}
            data-slot="slider-thumb"
          />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
