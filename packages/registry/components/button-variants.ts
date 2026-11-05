import { cva } from "class-variance-authority";

// Separate from button.tsx, with no "use client", so that Server Components can
// call it to style links.
export const buttonVariants = cva(
  [
    // The button itself only holds the layout. `before` paints the block, so a
    // press can sink the block without moving the layout or shrinking the
    // click target.
    "font-craft-display relative isolate inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 pb-(--craft-edge) whitespace-nowrap select-none",
    "before:craft-bevel [--bevel-depth:var(--craft-edge)] before:absolute before:inset-0 before:-z-10 motion-safe:before:transition-[top] motion-safe:before:duration-75",
    "active:pb-0 active:[--bevel-depth:0px] active:before:top-(--craft-edge)",
    "focus-visible:craft-focus [&_svg]:size-4 [&_svg]:shrink-0",
    "data-disabled:pointer-events-none",
  ],
  {
    defaultVariants: { size: "md", variant: "primary" },
    variants: {
      size: {
        icon: "size-(--craft-control-md) text-xl",
        lg: "h-(--craft-control-lg) px-[calc(var(--craft-space)*1.5)] text-2xl",
        md: "h-(--craft-control-md) px-(--craft-space) text-xl",
        sm: "h-(--craft-control-sm) px-[calc(var(--craft-space)*0.75)] text-lg",
      },
      variant: {
        destructive: [
          "text-craft-destructive-fg [--bevel-edge:var(--craft-destructive-edge)] [--bevel-face:var(--craft-destructive)] [--bevel-hi:var(--craft-destructive-hi)] [--bevel-lo:var(--craft-destructive-lo)]",
          "hover:text-craft-destructive-hover-fg hover:[--bevel-face:var(--craft-destructive-hover)] hover:[--bevel-hi:var(--craft-destructive-hover-hi)] hover:[--bevel-lo:var(--craft-destructive-hover-lo)]",
          "active:text-craft-destructive-fg active:[--bevel-face:var(--craft-destructive-active)] active:[--bevel-hi:var(--craft-destructive-active-hi)] active:[--bevel-lo:var(--craft-destructive-active-lo)]",
        ],
        ghost: [
          "text-craft-text [--bevel-edge:transparent] [--bevel-face:transparent] [--bevel-hi:transparent] [--bevel-lo:transparent] [--bevel-outline:transparent]",
          "hover:[--bevel-face:var(--craft-hover)] active:[--bevel-face:var(--craft-active)]",
        ],
        outline: [
          "text-craft-text [--bevel-edge:transparent] [--bevel-face:transparent] [--bevel-hi:transparent] [--bevel-lo:transparent] [--bevel-outline:var(--craft-text)]",
          "hover:[--bevel-face:var(--craft-hover)] active:[--bevel-face:var(--craft-active)]",
        ],
        primary: [
          "text-craft-primary-fg [--bevel-edge:var(--craft-primary-edge)] [--bevel-face:var(--craft-primary)] [--bevel-hi:var(--craft-primary-hi)] [--bevel-lo:var(--craft-primary-lo)]",
          "hover:text-craft-primary-hover-fg hover:[--bevel-face:var(--craft-primary-hover)] hover:[--bevel-hi:var(--craft-primary-hover-hi)] hover:[--bevel-lo:var(--craft-primary-hover-lo)]",
          "active:text-craft-primary-fg active:[--bevel-face:var(--craft-primary-active)] active:[--bevel-hi:var(--craft-primary-active-hi)] active:[--bevel-lo:var(--craft-primary-active-lo)]",
        ],
        secondary: [
          "text-craft-secondary-fg [--bevel-edge:var(--craft-secondary-edge)] [--bevel-face:var(--craft-secondary)] [--bevel-hi:var(--craft-secondary-hi)] [--bevel-lo:var(--craft-secondary-lo)]",
          "hover:[--bevel-face:var(--craft-secondary-hover)] hover:[--bevel-hi:var(--craft-secondary-hover-hi)] hover:[--bevel-lo:var(--craft-secondary-hover-lo)]",
          "active:[--bevel-face:var(--craft-secondary-active)] active:[--bevel-hi:var(--craft-secondary-active-hi)] active:[--bevel-lo:var(--craft-secondary-active-lo)]",
        ],
      },
    },
  }
);
