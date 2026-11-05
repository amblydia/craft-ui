"use client";

import { Switch as BaseSwitch } from "@base-ui/react/switch";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends ComponentProps<typeof BaseSwitch.Root> {
  /**
   * Text beside the switch, joined to it so that clicking the text toggles it.
   * Without a label, pass `aria-label`.
   */
  label?: ReactNode;
}

export function Switch({ className, disabled, label, ...props }: SwitchProps) {
  const control = (
    <BaseSwitch.Root
      className={cn(
        "group/switch relative inline-block h-[calc(var(--craft-unit)*16)] w-[calc(var(--craft-unit)*30)] shrink-0 cursor-pointer",
        "focus-visible:craft-focus",
        "data-disabled:cursor-not-allowed",
        !label && className
      )}
      data-slot="switch"
      disabled={disabled}
      {...props}
    >
      {/* The track sits one bevel lower than the thumb, as in the reference. */}
      <span
        className={cn(
          "craft-bevel absolute inset-x-0 top-[calc(var(--craft-unit)*2)] bottom-0 block",
          "[--bevel-depth:0px] [--bevel-edge:transparent] [--bevel-face:var(--craft-track)] [--bevel-hi:var(--craft-track-hi)] [--bevel-lo:var(--craft-track-lo)]",
          "group-data-checked/switch:[--bevel-face:var(--craft-primary)] group-data-checked/switch:[--bevel-hi:var(--craft-primary-hi)] group-data-checked/switch:[--bevel-lo:var(--craft-primary-lo)]",
          "group-data-disabled/switch:[--bevel-face:var(--craft-disabled)] group-data-disabled/switch:[--bevel-hi:var(--craft-disabled)] group-data-disabled/switch:[--bevel-lo:var(--craft-disabled)] group-data-disabled/switch:[--bevel-outline:var(--craft-disabled-outline)]"
        )}
      >
        {/* "I" when on, "O" when off, so the state never relies on color. */}
        <span
          aria-hidden="true"
          className="bg-craft-primary-fg group-data-disabled/switch:bg-craft-disabled-fg absolute top-1/2 left-[calc(var(--craft-unit)*6)] hidden h-[calc(var(--craft-unit)*6)] w-(--craft-unit) -translate-y-1/2 group-data-checked/switch:block"
        />
        <span
          aria-hidden="true"
          className="border-craft-outline group-data-disabled/switch:border-craft-disabled-fg absolute top-1/2 right-[calc(var(--craft-unit)*4)] block size-[calc(var(--craft-unit)*6)] -translate-y-1/2 border-(length:--craft-unit) group-data-checked/switch:hidden"
        />
      </span>
      <BaseSwitch.Thumb
        className={cn(
          "craft-bevel absolute top-0 left-0 block size-[calc(var(--craft-unit)*16)] motion-safe:transition-transform motion-safe:duration-100",
          "[--bevel-depth:var(--craft-edge)] [--bevel-edge:var(--craft-secondary-edge)] [--bevel-face:var(--craft-secondary)] [--bevel-hi:var(--craft-secondary-hi)] [--bevel-lo:var(--craft-secondary-lo)]",
          "group-hover/switch:[--bevel-face:var(--craft-secondary-hover)] group-hover/switch:[--bevel-hi:var(--craft-secondary-hover-hi)] group-hover/switch:[--bevel-lo:var(--craft-secondary-hover-lo)]",
          "data-checked:translate-x-[calc(var(--craft-unit)*14)]",
          "data-disabled:[--bevel-edge:var(--craft-disabled-edge)] data-disabled:[--bevel-face:var(--craft-disabled)] data-disabled:[--bevel-hi:var(--craft-disabled)] data-disabled:[--bevel-lo:var(--craft-disabled)] data-disabled:[--bevel-outline:var(--craft-disabled-outline)]"
        )}
        data-slot="switch-thumb"
      />
    </BaseSwitch.Root>
  );

  if (!label) {
    return control;
  }

  return (
    <label
      className={cn(
        "font-craft-display text-craft-text inline-flex cursor-pointer items-center gap-3 text-xl",
        disabled && "text-craft-text-muted cursor-not-allowed",
        className
      )}
      data-slot="switch-label"
    >
      {control}
      {label}
    </label>
  );
}
