"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Dialog(props: ComponentProps<typeof BaseDialog.Root>) {
  return <BaseDialog.Root data-slot="dialog" {...props} />;
}

export function DialogTrigger(
  props: ComponentProps<typeof BaseDialog.Trigger>
) {
  return <BaseDialog.Trigger data-slot="dialog-trigger" {...props} />;
}

export function DialogClose(props: ComponentProps<typeof BaseDialog.Close>) {
  return <BaseDialog.Close data-slot="dialog-close" {...props} />;
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-6"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 12 12"
    >
      <path d="M1 1h2v2H1zM3 3h2v2H3zM5 5h2v2H5zM7 7h2v2H7zM9 9h2v2H9zM9 1h2v2H9zM7 3h2v2H7zM3 7h2v2H3zM1 9h2v2H1z" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-6"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 12 12"
    >
      <path d="M7 1h2v2H7zM5 3h2v2H5zM3 5h2v2H3zM5 7h2v2H5zM7 9h2v2H7z" />
    </svg>
  );
}

/** The arrow at the start of the title bar, for dialogs with several steps. */
export function DialogBack({
  "aria-label": ariaLabel = "Back",
  className,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      aria-label={ariaLabel}
      className={cn(
        "text-craft-text hover:bg-craft-hover focus-visible:craft-focus active:bg-craft-active absolute top-(--craft-unit) left-(--craft-unit) inline-flex size-[calc(var(--craft-control-md)-var(--craft-unit))] cursor-pointer items-center justify-center focus-visible:-outline-offset-2",
        className
      )}
      data-slot="dialog-back"
      type="button"
      {...props}
    >
      <BackIcon />
    </button>
  );
}

export interface DialogContentProps
  extends ComponentProps<typeof BaseDialog.Popup> {
  /** Shows the X button in the header. Escape and the backdrop still close it. */
  showCloseButton?: boolean;
}

export function DialogContent({
  children,
  className,
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop
        className="bg-craft-overlay fixed inset-0 z-50 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:transition-opacity motion-safe:duration-150"
        data-slot="dialog-backdrop"
      />
      <BaseDialog.Popup
        className={cn(
          "rounded-craft border-craft-outline bg-craft-sunken text-craft-text fixed top-1/2 left-1/2 z-50 flex max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col border-(length:--craft-unit) outline-none",
          "data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0 motion-safe:transition-[opacity,scale] motion-safe:duration-150",
          className
        )}
        data-slot="dialog-content"
        {...props}
      >
        {children}
        {showCloseButton ? (
          <BaseDialog.Close
            aria-label="Close"
            className="text-craft-text hover:bg-craft-hover focus-visible:craft-focus active:bg-craft-active absolute top-(--craft-unit) right-(--craft-unit) inline-flex size-[calc(var(--craft-control-md)-var(--craft-unit))] cursor-pointer items-center justify-center focus-visible:-outline-offset-2"
            data-slot="dialog-close-button"
          >
            <CloseIcon />
          </BaseDialog.Close>
        ) : null}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

/** The title bar. Its title sits in the center, between the header's corners. */
export function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "craft-bevel flex min-h-(--craft-control-md) shrink-0 items-center justify-center border-0 px-[calc(var(--craft-control-md)+var(--craft-unit))] py-2 text-center",
        "[--bevel-depth:0px] [--bevel-edge:transparent] [--bevel-face:var(--craft-raised)] [--bevel-hi:var(--craft-raised-hi)] [--bevel-lo:var(--craft-raised-lo)]",
        className
      )}
      data-slot="dialog-header"
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof BaseDialog.Title>) {
  return (
    <BaseDialog.Title
      className={cn(
        "font-craft-display text-(length:--craft-label-size)",
        className
      )}
      data-slot="dialog-title"
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof BaseDialog.Description>) {
  return (
    <BaseDialog.Description
      className={cn("font-craft-body text-craft-text", className)}
      data-slot="dialog-description"
      {...props}
    />
  );
}

/** The scrolling middle of the dialog. */
export function DialogBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-(--craft-space)",
        className
      )}
      data-slot="dialog-body"
      {...props}
    />
  );
}

/**
 * The action row. Actions share its width evenly, and stack on narrow screens,
 * as they do in the game.
 */
export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-craft-surface flex shrink-0 flex-col-reverse gap-2 p-(--craft-space) shadow-[inset_0_var(--craft-unit)_0_var(--craft-surface-hi),inset_0_calc(-1*var(--craft-unit))_0_var(--craft-surface-lo)] sm:flex-row sm:*:flex-1",
        className
      )}
      data-slot="dialog-footer"
      {...props}
    />
  );
}
