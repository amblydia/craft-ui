import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const panelVariants = cva("text-craft-text flex flex-col", {
  defaultVariants: { framed: false, variant: "surface" },
  variants: {
    /**
     * Without a frame, a panel is a flat row: a light line along the top and a
     * dark line along the bottom, as in Ore UI's settings. A frame adds the
     * dark outline and full bevel of its cards and dialogs.
     */
    framed: {
      false:
        "bg-(--bevel-face) shadow-[inset_0_var(--craft-unit)_0_var(--bevel-hi),inset_0_calc(-1*var(--craft-unit))_0_var(--bevel-lo)]",
      true: "craft-bevel [--bevel-depth:0px] [--bevel-edge:transparent]",
    },
    variant: {
      /** The light panels of Ore UI, in both color modes. */
      light:
        "text-craft-secondary-fg [--bevel-face:var(--craft-secondary)] [--bevel-hi:var(--craft-secondary-hi)] [--bevel-lo:var(--craft-secondary-lo)] [--craft-text-muted:var(--craft-disabled-fg)]",
      /** Lifted from the page, like a tab or dialog header. */
      raised:
        "[--bevel-face:var(--craft-raised)] [--bevel-hi:var(--craft-raised-hi)] [--bevel-lo:var(--craft-raised-lo)]",
      /** Recessed into the page, like a dialog body. */
      sunken:
        "[--bevel-face:var(--craft-sunken)] [--bevel-hi:var(--craft-sunken-hi)] [--bevel-lo:var(--craft-sunken-lo)]",
      /** The everyday panel. */
      surface:
        "[--bevel-face:var(--craft-surface)] [--bevel-hi:var(--craft-surface-hi)] [--bevel-lo:var(--craft-surface-lo)]",
    },
  },
});

export interface PanelProps
  extends ComponentProps<"div">,
    VariantProps<typeof panelVariants> {}

export function Panel({ className, framed, variant, ...props }: PanelProps) {
  return (
    <div
      className={cn(panelVariants({ framed, variant }), className)}
      data-slot="panel"
      {...props}
    />
  );
}

export function PanelHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1 p-(--craft-space)",
        className
      )}
      data-slot="panel-header"
      {...props}
    />
  );
}

export function PanelTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "font-craft-display leading-tight text-(length:--craft-label-size)",
        className
      )}
      data-slot="panel-title"
      {...props}
    />
  );
}

export function PanelDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-craft-body text-craft-text-muted w-full text-sm",
        className
      )}
      data-slot="panel-description"
      {...props}
    />
  );
}

/** Controls at the end of a header. They follow the title on the same row. */
export function PanelActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("ml-auto flex items-center gap-2", className)}
      data-slot="panel-actions"
      {...props}
    />
  );
}

export function PanelContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "font-craft-body px-(--craft-space) pb-(--craft-space) first:pt-(--craft-space)",
        className
      )}
      data-slot="panel-content"
      {...props}
    />
  );
}

export function PanelFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-auto flex flex-wrap items-center gap-2 p-(--craft-space) pt-0",
        className
      )}
      data-slot="panel-footer"
      {...props}
    />
  );
}

export { panelVariants };
