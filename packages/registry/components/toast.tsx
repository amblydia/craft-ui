"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import type { ComponentProps } from "react";
import { buttonVariants } from "@/components/craft/button-variants";
import { cn } from "@/lib/utils";

/** The kinds of toast, set with `type` when you add one. */
export type ToastType = "success" | "error" | "warning" | "info";

// The newest toast comes first, and sits nearest the edge of the screen.
const positions = {
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 flex-col-reverse",
  "bottom-left": "bottom-4 left-4 flex-col-reverse",
  "bottom-right": "right-4 bottom-4 flex-col-reverse",
  "top-center": "top-4 left-1/2 -translate-x-1/2 flex-col",
  "top-left": "top-4 left-4 flex-col",
  "top-right": "top-4 right-4 flex-col",
};

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-6"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 12 12"
    >
      <path d="M3 3h1v1H3zM4 4h1v1H4zM5 5h2v2H5zM7 7h1v1H7zM8 8h1v1H8zM8 3h1v1H8zM7 4h1v1H7zM4 7h1v1H4zM3 8h1v1H3z" />
    </svg>
  );
}

function ToastList() {
  const { toasts } = BaseToast.useToastManager();
  return toasts.map((toast) => (
    <BaseToast.Root
      className={cn(
        // Ore UI's message bars: a flat fill, outlined here so the toast
        // stands apart from the page under it.
        "border-craft-outline bg-craft-surface text-craft-text relative w-full border-(length:--craft-unit) shadow-[inset_0_var(--craft-unit)_0_var(--craft-surface-hi),inset_0_calc(-1*var(--craft-unit))_0_var(--craft-surface-lo)] select-none",
        "data-[type=success]:bg-craft-primary data-[type=success]:text-craft-primary-fg data-[type=success]:shadow-none",
        "data-[type=error]:bg-craft-destructive data-[type=error]:text-craft-destructive-fg data-[type=error]:shadow-none",
        "data-[type=warning]:bg-craft-warning data-[type=warning]:text-craft-warning-fg data-[type=warning]:shadow-none",
        "data-[type=info]:bg-craft-info data-[type=info]:text-craft-info-fg data-[type=info]:shadow-none",
        "translate-x-(--toast-swipe-movement-x) translate-y-(--toast-swipe-movement-y) data-limited:hidden",
        "data-ending-style:opacity-0 data-starting-style:translate-y-2 data-starting-style:opacity-0 motion-safe:transition-[opacity,translate] motion-safe:duration-150"
      )}
      data-slot="toast"
      data-type={toast.type}
      key={toast.id}
      toast={toast}
    >
      <BaseToast.Content className="flex items-start gap-3 py-3 pr-2 pl-(--craft-space)">
        <div className="flex min-w-0 flex-1 flex-col gap-1 py-1">
          <BaseToast.Title
            className="font-craft-display leading-tight text-(length:--craft-label-size)"
            data-slot="toast-title"
          />
          <BaseToast.Description
            className="font-craft-body text-sm"
            data-slot="toast-description"
          />
        </div>
        <BaseToast.Action
          className={cn(
            buttonVariants({ size: "sm", variant: "secondary" }),
            "self-center"
          )}
          data-slot="toast-action"
        />
        <BaseToast.Close
          aria-label="Dismiss"
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center hover:bg-black/15 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-current"
          data-slot="toast-close"
        >
          <CloseIcon />
        </BaseToast.Close>
      </BaseToast.Content>
    </BaseToast.Root>
  ));
}

export interface ToastProviderProps
  extends ComponentProps<typeof BaseToast.Provider> {
  /** Where toasts appear on the screen. */
  position?: keyof typeof positions;
}

/**
 * Wrap your app in this once. It shows the toasts, and lets `useToast` add
 * them from anywhere inside. F6 moves focus to the toasts.
 */
export function ToastProvider({
  children,
  position = "bottom-right",
  ...props
}: ToastProviderProps) {
  return (
    <BaseToast.Provider {...props}>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport
          className={cn(
            "fixed z-[100] flex w-[calc(100vw-2rem)] max-w-sm gap-2 outline-none",
            positions[position]
          )}
          data-slot="toast-viewport"
        >
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

/**
 * Adds, updates and closes toasts. Call `add({ title, description, type })`,
 * where `type` is a `ToastType`, or leave it out for a plain toast.
 */
export const useToast = BaseToast.useToastManager;

/**
 * A manager for adding toasts from outside React, such as in a data-fetching
 * helper. Pass it to `ToastProvider` as `toastManager`.
 */
export const { createToastManager } = BaseToast;
