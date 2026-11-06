"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import type { ComponentProps } from "react";
import {
  menuFrameClassName,
  menuGroupLabelClassName,
  menuItemClassName,
  menuListClassName,
  menuSeparatorClassName,
} from "@/components/craft/menu-styles";
import { cn } from "@/lib/utils";

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-6"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 12 12"
    >
      <path d="M2 4h1v1H2zM9 4h1v1H9zM3 5h1v1H3zM8 5h1v1H8zM4 6h1v1H4zM7 6h1v1H7zM5 7h2v1H5z" />
    </svg>
  );
}

function ClearIcon() {
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

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-6"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 12 12"
    >
      <path d="M9 3h1v1H9zM8 4h1v1H8zM7 5h1v1H7zM6 6h1v1H6zM5 7h1v1H5zM4 8h1v1H4zM3 7h1v1H3zM2 6h1v1H2z" />
    </svg>
  );
}

/**
 * A select you can type into to filter. Pass `items`, and it filters them as
 * the input changes.
 */
export const Combobox = BaseCombobox.Root;

export function ComboboxLabel({
  className,
  ...props
}: ComponentProps<typeof BaseCombobox.Label>) {
  return (
    <BaseCombobox.Label
      className={cn(
        "font-craft-display text-craft-text text-(length:--craft-label-size)",
        className
      )}
      data-slot="combobox-label"
      {...props}
    />
  );
}

export interface ComboboxInputProps
  extends ComponentProps<typeof BaseCombobox.Input> {
  /** Shows a button that clears the input and the selection. */
  showClear?: boolean;
}

/** The text field, with a button that opens the full list. */
export function ComboboxInput({
  className,
  disabled,
  showClear = false,
  ...props
}: ComboboxInputProps) {
  return (
    <BaseCombobox.InputGroup
      className={cn(
        "craft-inset font-craft-display text-craft-text flex h-(--craft-control-md) w-full items-center pl-3 text-(length:--craft-label-size)",
        "focus-within:craft-focus focus-within:outline-offset-(--craft-unit)",
        "has-disabled:text-craft-disabled-fg has-disabled:pointer-events-none has-disabled:[--craft-field-shade:var(--craft-disabled-edge)] has-disabled:[--craft-field:var(--craft-disabled)] has-disabled:[--craft-outline:var(--craft-disabled-outline)] has-disabled:[--craft-placeholder:var(--craft-disabled-fg)]",
        className
      )}
      data-slot="combobox-input"
    >
      <BaseCombobox.Input
        className="placeholder:text-craft-placeholder h-full w-full min-w-0 flex-1 bg-transparent outline-none"
        disabled={disabled}
        {...props}
      />
      {showClear ? (
        <BaseCombobox.Clear
          aria-label="Clear"
          className="hover:bg-craft-hover focus-visible:craft-focus flex size-9 shrink-0 cursor-pointer items-center justify-center focus-visible:-outline-offset-2"
          data-slot="combobox-clear"
        >
          <ClearIcon />
        </BaseCombobox.Clear>
      ) : null}
      <BaseCombobox.Trigger
        aria-label="Show all"
        className="hover:bg-craft-hover focus-visible:craft-focus flex size-9 shrink-0 cursor-pointer items-center justify-center focus-visible:-outline-offset-2"
        data-slot="combobox-trigger"
      >
        <ChevronIcon />
      </BaseCombobox.Trigger>
    </BaseCombobox.InputGroup>
  );
}

export interface ComboboxContentProps
  extends ComponentProps<typeof BaseCombobox.Popup> {
  /** How to align against the input. */
  align?: ComponentProps<typeof BaseCombobox.Positioner>["align"];
  /** Which side of the input to open on, when there is room. */
  side?: ComponentProps<typeof BaseCombobox.Positioner>["side"];
  /** The distance from the input, in pixels. */
  sideOffset?: ComponentProps<typeof BaseCombobox.Positioner>["sideOffset"];
}

/** The popup. Put a `ComboboxEmpty` and a `ComboboxList` inside. */
export function ComboboxContent({
  align,
  className,
  side = "bottom",
  sideOffset = 4,
  ...props
}: ComboboxContentProps) {
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner
        align={align}
        className="z-50 outline-none"
        side={side}
        sideOffset={sideOffset}
      >
        <BaseCombobox.Popup
          className={cn(
            menuFrameClassName,
            "w-(--anchor-width) max-w-(--available-width)",
            className
          )}
          data-slot="combobox-content"
          {...props}
        />
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );
}

/** The rows. Its child can be a function, called with each item that matches. */
export function ComboboxList({
  className,
  ...props
}: ComponentProps<typeof BaseCombobox.List>) {
  return (
    <BaseCombobox.List
      className={cn(
        menuListClassName,
        "max-h-[min(24rem,calc(var(--available-height)-var(--craft-unit)*4))] overflow-y-auto overscroll-contain data-empty:hidden",
        className
      )}
      data-slot="combobox-list"
      {...props}
    />
  );
}

export function ComboboxItem({
  children,
  className,
  ...props
}: ComponentProps<typeof BaseCombobox.Item>) {
  return (
    <BaseCombobox.Item
      className={cn(menuItemClassName, className)}
      data-slot="combobox-item"
      {...props}
    >
      <span className="min-w-0 flex-1 truncate">{children}</span>
      <BaseCombobox.ItemIndicator className="flex">
        <CheckIcon />
      </BaseCombobox.ItemIndicator>
    </BaseCombobox.Item>
  );
}

/** Shown in place of the list when nothing matches. */
export function ComboboxEmpty({
  className,
  ...props
}: ComponentProps<typeof BaseCombobox.Empty>) {
  return (
    <BaseCombobox.Empty
      className={cn(
        "bg-craft-menu font-craft-body text-craft-text-muted px-(--craft-space) py-3 text-sm empty:hidden",
        className
      )}
      data-slot="combobox-empty"
      {...props}
    />
  );
}

export function ComboboxGroup({
  className,
  ...props
}: ComponentProps<typeof BaseCombobox.Group>) {
  return (
    <BaseCombobox.Group
      className={cn(menuListClassName, className)}
      data-slot="combobox-group"
      {...props}
    />
  );
}

export function ComboboxGroupLabel({
  className,
  ...props
}: ComponentProps<typeof BaseCombobox.GroupLabel>) {
  return (
    <BaseCombobox.GroupLabel
      className={cn(menuGroupLabelClassName, className)}
      data-slot="combobox-group-label"
      {...props}
    />
  );
}

export function ComboboxSeparator({
  className,
  ...props
}: ComponentProps<typeof BaseCombobox.Separator>) {
  return (
    <BaseCombobox.Separator
      className={cn(menuSeparatorClassName, className)}
      data-slot="combobox-separator"
      {...props}
    />
  );
}
