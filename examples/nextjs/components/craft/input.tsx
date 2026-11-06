"use client";

import { Input as BaseInput } from "@base-ui/react/input";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends Omit<ComponentProps<typeof BaseInput>, "size"> {
  /** Marks the value as invalid: a red outline and `aria-invalid`. */
  error?: boolean;
  /** Rendered inside the field, before the text. */
  leadingIcon?: ReactNode;
  /** The height of the field. */
  size?: "sm" | "md" | "lg";
  /** Rendered inside the field, after the text. */
  trailingIcon?: ReactNode;
}

const sizes = {
  lg: "h-(--craft-control-lg)",
  md: "h-(--craft-control-md)",
  sm: "h-(--craft-control-sm)",
};

export function Input({
  className,
  error,
  leadingIcon,
  size = "md",
  trailingIcon,
  ...props
}: InputProps) {
  return (
    <span
      className={cn(
        "craft-inset font-craft-display text-craft-text flex w-full items-center gap-2 px-3 text-(length:--craft-label-size)",
        // The ring stands one unit off the outline, as in the reference.
        "focus-within:craft-focus focus-within:outline-offset-(--craft-unit) [&_svg]:size-4 [&_svg]:shrink-0",
        "has-aria-invalid:[--craft-outline:var(--craft-destructive)]",
        "has-disabled:text-craft-disabled-fg has-disabled:pointer-events-none has-disabled:[--craft-field-shade:var(--craft-disabled-edge)] has-disabled:[--craft-field:var(--craft-disabled)] has-disabled:[--craft-outline:var(--craft-disabled-outline)] has-disabled:[--craft-placeholder:var(--craft-disabled-fg)]",
        sizes[size],
        className
      )}
      data-slot="input"
    >
      {leadingIcon}
      <BaseInput
        aria-invalid={error || undefined}
        className="placeholder:text-craft-placeholder h-full w-full min-w-0 flex-1 [appearance:textfield] bg-transparent outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        {...props}
      />
      {trailingIcon}
    </span>
  );
}
