import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const sizes = { lg: "size-12", md: "size-8", sm: "size-6" };

export interface SpinnerProps extends ComponentProps<"span"> {
  /** Announced to screen readers. Shown beside the spinner with `showLabel`. */
  label?: string;
  /** Shows the label beside the spinner. */
  showLabel?: boolean;
  size?: keyof typeof sizes;
}

/**
 * A pixel spinner that turns in eight steps, like a clock hand. With reduced
 * motion it stays still.
 */
export function Spinner({
  className,
  label = "Loading",
  showLabel = false,
  size = "md",
  ...props
}: SpinnerProps) {
  return (
    <span
      className={cn(
        "font-craft-display inline-flex items-center gap-3 text-(length:--craft-label-size)",
        className
      )}
      data-slot="spinner"
      role="status"
      {...props}
    >
      <svg
        aria-hidden="true"
        className={cn(
          "shrink-0 motion-safe:animate-[spin_1s_steps(8)_infinite]",
          sizes[size]
        )}
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
      <span className={showLabel ? undefined : "sr-only"}>{label}</span>
    </span>
  );
}

export interface LoadingOverlayProps extends ComponentProps<"div"> {
  /** Announced, and shown under the spinner. */
  label?: ReactNode;
  /** Covers the content with a spinner and blocks it while true. */
  loading: boolean;
}

/**
 * Covers its content while it loads. The content stays in place, so the layout
 * doesn't jump, but it can't be clicked or focused until loading ends.
 */
export function LoadingOverlay({
  children,
  className,
  label = "Loading",
  loading,
  ...props
}: LoadingOverlayProps) {
  return (
    <div
      aria-busy={loading || undefined}
      className={cn("relative", className)}
      data-slot="loading-overlay"
      {...props}
    >
      <div className="contents" inert={loading || undefined}>
        {children}
      </div>
      {loading ? (
        <div
          className="bg-craft-overlay absolute inset-0 z-10 flex items-center justify-center text-white"
          data-slot="loading-overlay-cover"
        >
          <span
            className="font-craft-display flex flex-col items-center gap-3 text-(length:--craft-label-size)"
            role="status"
          >
            <svg
              aria-hidden="true"
              className="size-12 motion-safe:animate-[spin_1s_steps(8)_infinite]"
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
            {label}
          </span>
        </div>
      ) : null}
    </div>
  );
}
