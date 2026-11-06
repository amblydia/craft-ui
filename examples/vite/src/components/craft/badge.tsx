import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Ore UI's tags: flat blocks of color with pixel text. The colors are the same
 * in both modes. In Ore UI's names, `info` is Informative, `warning` is Notice,
 * `destructive` is Warning and `accent` is Realms Informative.
 */
const badgeVariants = cva(
  "font-craft-display inline-flex w-fit shrink-0 items-center gap-1.5 leading-none whitespace-nowrap [&_svg]:size-4 [&_svg]:shrink-0",
  {
    defaultVariants: { size: "md", variant: "neutral" },
    variants: {
      size: {
        md: "h-[calc(var(--craft-unit)*15)] px-[calc(var(--craft-unit)*3)] text-(length:--craft-label-size)",
        sm: "h-[calc(var(--craft-unit)*9)] px-(--craft-unit) text-[0.6875rem]",
      },
      variant: {
        accent: "bg-craft-tag-accent text-craft-tag-fg",
        destructive: "bg-craft-tag-destructive text-craft-tag-fg",
        info: "bg-craft-tag-info text-craft-tag-fg",
        neutral: "bg-craft-tag-neutral text-craft-tag-neutral-fg",
        primary: "bg-craft-tag-primary text-craft-tag-fg",
        warning: "bg-craft-tag-warning text-craft-tag-fg",
      },
    },
  }
);

export interface BadgeProps
  extends ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, size, variant, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ size, variant }), className)}
      data-slot="badge"
      data-variant={variant ?? "neutral"}
      {...props}
    />
  );
}

export { badgeVariants };
