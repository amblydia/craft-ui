"use client";

import { Separator as BaseSeparator } from "@base-ui/react/separator";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Separator({
  className,
  orientation = "horizontal",
  ...props
}: ComponentProps<typeof BaseSeparator>) {
  return (
    <BaseSeparator
      className={cn(
        // A groove: one dark line and one light line, like the rows of a menu.
        "shrink-0 bg-(--craft-surface-lo)",
        orientation === "horizontal"
          ? "h-(--craft-unit) w-full shadow-[0_var(--craft-unit)_0_var(--craft-surface-hi)]"
          : "h-full w-(--craft-unit) shadow-[var(--craft-unit)_0_0_var(--craft-surface-hi)]",
        className
      )}
      data-slot="separator"
      orientation={orientation}
      {...props}
    />
  );
}
