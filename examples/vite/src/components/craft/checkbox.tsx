"use client";

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends ComponentProps<typeof BaseCheckbox.Root> {
  /**
   * Text beside the box, joined to it so that clicking the text toggles it.
   * Without a label, pass `aria-label`.
   */
  label?: ReactNode;
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-full"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 10 10"
    >
      <path d="M8 1h1v2H8zM7 3h1v1H7zM6 4h1v1H6zM5 5h1v1H5zM4 6h1v1H4zM3 7h1v1H3zM2 6h1v1H2zM1 5h1v1H1z" />
    </svg>
  );
}

function DashIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-full"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 10 10"
    >
      <path d="M2 4h6v2H2z" />
    </svg>
  );
}

export function Checkbox({
  className,
  disabled,
  label,
  ...props
}: CheckboxProps) {
  const box = (
    <BaseCheckbox.Root
      className={cn(
        "craft-bevel text-craft-primary-fg inline-flex size-[calc(var(--craft-unit)*12)] shrink-0 cursor-pointer items-center justify-center",
        "[--bevel-depth:0px] [--bevel-edge:transparent] [--bevel-face:var(--craft-track)] [--bevel-hi:var(--craft-track-hi)] [--bevel-lo:var(--craft-track-lo)]",
        "not-data-disabled:hover:[--bevel-face:var(--craft-track-hi)]",
        "data-checked:[--bevel-face:var(--craft-primary)] data-checked:[--bevel-hi:var(--craft-primary-hi)] data-checked:[--bevel-lo:var(--craft-primary-lo)] not-data-disabled:data-checked:hover:[--bevel-face:var(--craft-primary-hover)]",
        "data-indeterminate:[--bevel-face:var(--craft-primary)] data-indeterminate:[--bevel-hi:var(--craft-primary-hi)] data-indeterminate:[--bevel-lo:var(--craft-primary-lo)] not-data-disabled:data-indeterminate:hover:[--bevel-face:var(--craft-primary-hover)]",
        "focus-visible:craft-focus",
        "data-disabled:text-craft-disabled-fg data-disabled:cursor-not-allowed data-disabled:[--bevel-face:var(--craft-disabled)] data-disabled:[--bevel-hi:var(--craft-disabled)] data-disabled:[--bevel-lo:var(--craft-disabled)] data-disabled:[--bevel-outline:var(--craft-disabled-outline)]",
        !label && className
      )}
      data-slot="checkbox"
      disabled={disabled}
      {...props}
    >
      <BaseCheckbox.Indicator
        render={(indicatorProps, state) => (
          <span {...indicatorProps}>
            {state.indeterminate ? <DashIcon /> : <CheckIcon />}
          </span>
        )}
      />
    </BaseCheckbox.Root>
  );

  if (!label) {
    return box;
  }

  return (
    <label
      className={cn(
        "font-craft-display text-craft-text inline-flex cursor-pointer items-center gap-3 text-xl",
        disabled && "text-craft-text-muted cursor-not-allowed",
        className
      )}
      data-slot="checkbox-label"
    >
      {box}
      {label}
    </label>
  );
}
