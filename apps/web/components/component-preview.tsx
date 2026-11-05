import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The frame around a live example. It sits outside the docs typography, so the
 * example renders as it would in an app.
 */
export function ComponentPreview({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "not-prose border-craft-outline bg-craft-sunken text-craft-text flex min-h-48 flex-wrap items-center justify-center gap-4 border-2 p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
