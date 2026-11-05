"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { buttonVariants } from "@/components/craft/button-variants";
import { cn } from "@/lib/utils";

const disabledClasses =
  "text-craft-disabled-fg [--bevel-edge:var(--craft-disabled-edge)] [--bevel-face:var(--craft-disabled)] [--bevel-hi:var(--craft-disabled)] [--bevel-lo:var(--craft-disabled)] [--bevel-outline:var(--craft-disabled-outline)]";

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      className="motion-safe:animate-[spin_1s_steps(8)_infinite]"
      data-slot="button-spinner"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 16 16"
    >
      <path d="M7 1h2v4H7zM7 11h2v4H7zM1 7h4v2H1zM11 7h4v2h-4z" />
      <path
        d="M3 3h2v2H3zM11 3h2v2h-2zM3 11h2v2H3zM11 11h2v2h-2z"
        opacity="0.5"
      />
    </svg>
  );
}

export interface ButtonProps
  extends ComponentProps<typeof BaseButton>,
    VariantProps<typeof buttonVariants> {
  /** Stretches the button to the width of its container. */
  fullWidth?: boolean;
  /** Rendered before the label. Use `loading` for a busy state. */
  leadingIcon?: ReactNode;
  /** Shows a spinner and blocks clicks, while the button keeps keyboard focus. */
  loading?: boolean;
  /** Rendered after the label. */
  trailingIcon?: ReactNode;
}

export function Button({
  children,
  className,
  disabled,
  fullWidth,
  leadingIcon,
  loading,
  size,
  trailingIcon,
  variant,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      aria-busy={loading || undefined}
      className={cn(
        buttonVariants({ size, variant }),
        fullWidth && "w-full",
        disabled && disabledClasses,
        className
      )}
      data-slot="button"
      disabled={disabled || loading}
      focusableWhenDisabled={loading}
      {...props}
    >
      {loading ? <Spinner /> : (leadingIcon ?? null)}
      {children}
      {trailingIcon}
    </BaseButton>
  );
}
