"use client";

import { Progress as BaseProgress } from "@base-ui/react/progress";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  destructive: "var(--craft-destructive)",
  info: "var(--craft-info)",
  primary: "var(--craft-primary)",
  warning: "var(--craft-warning)",
};

const highlights = {
  destructive: "var(--craft-destructive-hi)",
  info: "var(--craft-info-hi)",
  primary: "var(--craft-primary-hi)",
  warning: "var(--craft-warning-hi)",
};

const shades = {
  destructive: "var(--craft-destructive-edge)",
  info: "var(--craft-info-lo)",
  primary: "var(--craft-primary-edge)",
  warning: "var(--craft-warning-lo)",
};

export interface ProgressProps
  extends Omit<ComponentProps<typeof BaseProgress.Root>, "children" | "value"> {
  /** Any CSS color for the fill. Takes priority over `tone`. */
  color?: string;
  /** Text above the bar. Without one, pass `aria-label`. */
  label?: ReactNode;
  /** Shows the value above the bar, on the right. */
  showValue?: boolean;
  /** The height of the bar: `sm` is Ore UI's thin bar, `md` adds an outline. */
  size?: "sm" | "md";
  /** The color of the fill. */
  tone?: keyof typeof tones;
  /** The current value. `null` means the progress is unknown (indeterminate). */
  value: number | null;
}

export function Progress({
  className,
  color,
  label,
  showValue,
  size = "sm",
  style,
  tone = "info",
  ...props
}: ProgressProps) {
  const colors = {
    "--progress-face": color ?? tones[tone],
    "--progress-hi": color ?? highlights[tone],
    "--progress-lo": color ?? shades[tone],
  } as CSSProperties;

  return (
    <BaseProgress.Root
      className={cn(
        "font-craft-display text-craft-text flex w-full flex-col gap-2 text-(length:--craft-label-size)",
        className
      )}
      data-slot="progress"
      style={{ ...colors, ...style }}
      {...props}
    >
      {label || showValue ? (
        <div className="flex items-baseline justify-between gap-4">
          {label ? <BaseProgress.Label>{label}</BaseProgress.Label> : null}
          {showValue ? (
            <BaseProgress.Value className="ml-auto tabular-nums" />
          ) : null}
        </div>
      ) : null}
      <BaseProgress.Track
        className={cn(
          "bg-craft-sunken relative block w-full overflow-hidden",
          size === "sm"
            ? "h-[calc(var(--craft-unit)*2)] shadow-[inset_0_calc(var(--craft-unit)/2)_0_var(--craft-sunken-lo),inset_0_calc(-1*var(--craft-unit)/2)_0_var(--craft-sunken-hi)]"
            : "border-craft-outline h-[calc(var(--craft-unit)*6)] border-(length:--craft-unit)"
        )}
        data-slot="progress-track"
      >
        <BaseProgress.Indicator
          className={cn(
            "block h-full bg-(--progress-face)",
            size === "sm"
              ? "shadow-[inset_0_calc(var(--craft-unit)/2)_0_var(--progress-hi),inset_0_calc(-1*var(--craft-unit)/2)_0_var(--progress-lo)]"
              : "shadow-[inset_0_var(--craft-unit)_0_var(--progress-hi),inset_0_calc(-1*var(--craft-unit))_0_var(--progress-lo)]",
            "motion-safe:transition-[width] motion-safe:duration-200",
            "data-indeterminate:w-1/4 motion-safe:data-indeterminate:animate-[craft-progress-slide_1.6s_steps(40)_infinite] motion-reduce:data-indeterminate:w-full motion-reduce:data-indeterminate:opacity-50"
          )}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
