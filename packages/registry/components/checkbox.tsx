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
      viewBox="0 0 11 11"
    >
      <path d="M8 3h1v1H8zM7 4h1v1H7zM6 5h1v1H6zM5 6h1v1H5zM4 7h1v1H4zM3 6h1v1H3zM2 5h1v1H2z" />
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
      viewBox="0 0 11 11"
    >
      <path d="M2 5h7v1H2z" />
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
        "craft-bevel text-craft-primary-fg inline-flex size-[calc(var(--craft-unit)*13)] shrink-0 cursor-pointer items-center justify-center",
        "[--bevel-depth:0px] [--bevel-edge:transparent] [--bevel-face:var(--craft-track)] [--bevel-hi:var(--craft-track-hi)] [--bevel-lo:var(--craft-track-lo)]",
        "not-data-disabled:hover:[--bevel-face:var(--craft-track-hover)] not-data-disabled:hover:[--bevel-hi:var(--craft-track-hover-hi)] not-data-disabled:hover:[--bevel-lo:var(--craft-track-hover-lo)]",
        "not-data-disabled:active:[--bevel-face:var(--craft-track-active)] not-data-disabled:active:[--bevel-hi:var(--craft-track-active-hi)] not-data-disabled:active:[--bevel-lo:var(--craft-track-active-lo)]",
        "data-checked:[--bevel-face:var(--craft-primary)] data-checked:[--bevel-hi:var(--craft-primary-hi)] data-checked:[--bevel-lo:var(--craft-primary-lo)] not-data-disabled:data-checked:hover:[--bevel-face:var(--craft-primary-hover)] not-data-disabled:data-checked:hover:[--bevel-hi:var(--craft-primary-hover-hi)] not-data-disabled:data-checked:hover:[--bevel-lo:var(--craft-primary-hover-lo)] not-data-disabled:data-checked:active:[--bevel-face:var(--craft-primary-active)] not-data-disabled:data-checked:active:[--bevel-hi:var(--craft-primary-active-hi)] not-data-disabled:data-checked:active:[--bevel-lo:var(--craft-primary-active-lo)]",
        "data-indeterminate:[--bevel-face:var(--craft-primary)] data-indeterminate:[--bevel-hi:var(--craft-primary-hi)] data-indeterminate:[--bevel-lo:var(--craft-primary-lo)] not-data-disabled:data-indeterminate:hover:[--bevel-face:var(--craft-primary-hover)] not-data-disabled:data-indeterminate:hover:[--bevel-hi:var(--craft-primary-hover-hi)] not-data-disabled:data-indeterminate:hover:[--bevel-lo:var(--craft-primary-hover-lo)] not-data-disabled:data-indeterminate:active:[--bevel-face:var(--craft-primary-active)] not-data-disabled:data-indeterminate:active:[--bevel-hi:var(--craft-primary-active-hi)] not-data-disabled:data-indeterminate:active:[--bevel-lo:var(--craft-primary-active-lo)]",
        "focus-visible:craft-focus",
        "data-disabled:text-craft-disabled-outline data-disabled:cursor-not-allowed data-disabled:[--bevel-face:var(--craft-disabled)] data-disabled:[--bevel-hi:var(--craft-disabled)] data-disabled:[--bevel-lo:var(--craft-disabled)] data-disabled:[--bevel-outline:var(--craft-disabled-outline)]",
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
        "font-craft-display text-craft-text inline-flex cursor-pointer items-center gap-3 text-(length:--craft-label-size)",
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
