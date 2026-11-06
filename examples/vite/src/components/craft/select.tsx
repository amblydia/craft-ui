"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
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
 * Holds the value. Pass `items`, an array of `{ label, value }`, so the trigger
 * can show the label of the selected value.
 */
export const Select = BaseSelect.Root;

export function SelectLabel({
  className,
  ...props
}: ComponentProps<typeof BaseSelect.Label>) {
  return (
    <BaseSelect.Label
      className={cn(
        "font-craft-display text-craft-text data-disabled:text-craft-text-muted text-(length:--craft-label-size)",
        className
      )}
      data-slot="select-label"
      {...props}
    />
  );
}

export interface SelectTriggerProps
  extends ComponentProps<typeof BaseSelect.Trigger> {
  /**
   * `default` is Ore UI's light dropdown, for forms and settings. `sunken` is
   * its dark dropdown, for filters that sit in a row.
   */
  variant?: "default" | "sunken";
}

export function SelectTrigger({
  children,
  className,
  variant = "default",
  ...props
}: SelectTriggerProps) {
  return (
    <BaseSelect.Trigger
      className={cn(
        "group/select-trigger craft-bevel font-craft-display focus-visible:craft-focus flex h-(--craft-control-md) w-full min-w-40 cursor-pointer items-center justify-between gap-3 pr-2 pl-(--craft-space) text-left text-(length:--craft-label-size) select-none",
        // Unlike a button, the light dropdown keeps its base when pressed.
        "data-[variant=default]:text-craft-secondary-fg data-[variant=default]:[&_[data-placeholder]]:text-craft-disabled-fg data-[variant=default]:pb-(--craft-edge) data-[variant=default]:[--bevel-depth:var(--craft-edge)] data-[variant=default]:[--bevel-edge:var(--craft-secondary-edge)] data-[variant=default]:[--bevel-face:var(--craft-secondary)] data-[variant=default]:[--bevel-hi:var(--craft-secondary-hi)] data-[variant=default]:[--bevel-lo:var(--craft-secondary-lo)]",
        "data-[variant=default]:hover:[--bevel-face:var(--craft-secondary-hover)] data-[variant=default]:hover:[--bevel-hi:var(--craft-secondary-hover-hi)] data-[variant=default]:hover:[--bevel-lo:var(--craft-secondary-hover-lo)]",
        "data-[variant=default]:active:[--bevel-face:var(--craft-secondary-active)] data-[variant=default]:active:[--bevel-hi:var(--craft-secondary-active-hi)] data-[variant=default]:active:[--bevel-lo:var(--craft-secondary-active-lo)] data-[variant=default]:data-popup-open:[--bevel-face:var(--craft-secondary-active)] data-[variant=default]:data-popup-open:[--bevel-hi:var(--craft-secondary-active-hi)] data-[variant=default]:data-popup-open:[--bevel-lo:var(--craft-secondary-active-lo)]",
        "data-[variant=sunken]:text-craft-text data-[variant=sunken]:[&_[data-placeholder]]:text-craft-placeholder data-[variant=sunken]:[--bevel-depth:0px] data-[variant=sunken]:[--bevel-edge:transparent] data-[variant=sunken]:[--bevel-face:var(--craft-sunken)] data-[variant=sunken]:[--bevel-hi:var(--craft-selected-hi)] data-[variant=sunken]:[--bevel-lo:var(--craft-sunken-lo)]",
        "data-[variant=sunken]:hover:[--bevel-face:var(--craft-surface)] data-[variant=sunken]:data-popup-open:[--bevel-face:var(--craft-surface)]",
        "data-disabled:text-craft-disabled-fg data-disabled:[&_[data-placeholder]]:text-craft-disabled-fg data-disabled:cursor-not-allowed data-disabled:[--bevel-edge:var(--craft-disabled-edge)] data-disabled:[--bevel-face:var(--craft-disabled)] data-disabled:[--bevel-hi:var(--craft-disabled)] data-disabled:[--bevel-lo:var(--craft-disabled)] data-disabled:[--bevel-outline:var(--craft-disabled-outline)]",
        className
      )}
      data-slot="select-trigger"
      data-variant={variant}
      {...props}
    >
      {children}
      {/* On the light dropdown, the chevron stays dark, even when disabled. */}
      <BaseSelect.Icon className="group-data-[variant=default]/select-trigger:text-craft-secondary-fg flex">
        <ChevronIcon />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

/** The selected label, or `placeholder` when nothing is selected. */
export function SelectValue({
  className,
  ...props
}: ComponentProps<typeof BaseSelect.Value>) {
  return (
    <BaseSelect.Value
      className={cn("min-w-0 flex-1 truncate", className)}
      data-slot="select-value"
      {...props}
    />
  );
}

export interface SelectContentProps
  extends ComponentProps<typeof BaseSelect.Popup> {
  /** How to align against the trigger. */
  align?: ComponentProps<typeof BaseSelect.Positioner>["align"];
  /**
   * Opens the list over the trigger, with the selected item on top of it, as
   * native selects do on macOS. Off by default: Ore UI opens below.
   */
  alignItemWithTrigger?: boolean;
  /** Which side of the trigger to open on, when there is room. */
  side?: ComponentProps<typeof BaseSelect.Positioner>["side"];
  /** The distance from the trigger, in pixels. */
  sideOffset?: ComponentProps<typeof BaseSelect.Positioner>["sideOffset"];
}

export function SelectContent({
  align,
  alignItemWithTrigger = false,
  children,
  className,
  side = "bottom",
  sideOffset = 4,
  ...props
}: SelectContentProps) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner
        align={align}
        alignItemWithTrigger={alignItemWithTrigger}
        className="z-50 outline-none"
        side={side}
        sideOffset={sideOffset}
      >
        <BaseSelect.Popup
          className={cn(
            menuFrameClassName,
            "min-w-(--anchor-width)",
            className
          )}
          data-slot="select-content"
          {...props}
        >
          <BaseSelect.List
            className={cn(
              menuListClassName,
              "max-h-[calc(var(--available-height)-var(--craft-unit)*4)] overflow-y-auto"
            )}
          >
            {children}
          </BaseSelect.List>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

export function SelectItem({
  children,
  className,
  ...props
}: ComponentProps<typeof BaseSelect.Item>) {
  return (
    <BaseSelect.Item
      className={cn(menuItemClassName, className)}
      data-slot="select-item"
      {...props}
    >
      <BaseSelect.ItemText className="min-w-0 flex-1 truncate">
        {children}
      </BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className="flex">
        <CheckIcon />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}

export function SelectGroup({
  className,
  ...props
}: ComponentProps<typeof BaseSelect.Group>) {
  return (
    <BaseSelect.Group
      className={cn(menuListClassName, className)}
      data-slot="select-group"
      {...props}
    />
  );
}

export function SelectGroupLabel({
  className,
  ...props
}: ComponentProps<typeof BaseSelect.GroupLabel>) {
  return (
    <BaseSelect.GroupLabel
      className={cn(menuGroupLabelClassName, className)}
      data-slot="select-group-label"
      {...props}
    />
  );
}

export function SelectSeparator({
  className,
  ...props
}: ComponentProps<typeof BaseSelect.Separator>) {
  return (
    <BaseSelect.Separator
      className={cn(menuSeparatorClassName, className)}
      data-slot="select-separator"
      {...props}
    />
  );
}
