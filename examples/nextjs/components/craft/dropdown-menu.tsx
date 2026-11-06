"use client";

import { Menu } from "@base-ui/react/menu";
import type { ComponentProps } from "react";
import {
  menuGroupLabelClassName,
  menuItemClassName,
  menuItemDestructiveClassName,
  menuListClassName,
  menuPopupClassName,
  menuSeparatorClassName,
} from "@/components/craft/menu-styles";
import { cn } from "@/lib/utils";

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

function DotIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-6"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 12 12"
    >
      <path d="M5 4h2v1H5zM4 5h4v2H4zM5 7h2v1H5z" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-6"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 12 12"
    >
      <path d="M4 2h1v1H4zM4 9h1v1H4zM5 3h1v1H5zM5 8h1v1H5zM6 4h1v1H6zM6 7h1v1H6zM7 5h1v2H7z" />
    </svg>
  );
}

export function DropdownMenu(props: ComponentProps<typeof Menu.Root>) {
  return <Menu.Root {...props} />;
}

/** Opens the menu. Pass `render={<Button />}` to use a CraftUI button. */
export function DropdownMenuTrigger(
  props: ComponentProps<typeof Menu.Trigger>
) {
  return <Menu.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

export interface DropdownMenuContentProps
  extends ComponentProps<typeof Menu.Popup> {
  /** How to align against the trigger. */
  align?: ComponentProps<typeof Menu.Positioner>["align"];
  /** Moves the menu along its side, in pixels. */
  alignOffset?: ComponentProps<typeof Menu.Positioner>["alignOffset"];
  /** Which side of the trigger to open on, when there is room. */
  side?: ComponentProps<typeof Menu.Positioner>["side"];
  /** The distance from the trigger, in pixels. */
  sideOffset?: ComponentProps<typeof Menu.Positioner>["sideOffset"];
}

export function DropdownMenuContent({
  align = "start",
  alignOffset,
  className,
  side = "bottom",
  sideOffset = 4,
  ...props
}: DropdownMenuContentProps) {
  return (
    <Menu.Portal>
      <Menu.Positioner
        align={align}
        alignOffset={alignOffset}
        className="z-50 outline-none"
        side={side}
        sideOffset={sideOffset}
      >
        <Menu.Popup
          className={cn(menuPopupClassName, className)}
          data-slot="dropdown-menu-content"
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  );
}

export interface DropdownMenuItemProps
  extends ComponentProps<typeof Menu.Item> {
  /** `destructive` is for actions that delete or can't be undone. */
  variant?: "default" | "destructive";
}

export function DropdownMenuItem({
  className,
  variant = "default",
  ...props
}: DropdownMenuItemProps) {
  return (
    <Menu.Item
      className={cn(
        menuItemClassName,
        variant === "destructive" && menuItemDestructiveClassName,
        className
      )}
      data-slot="dropdown-menu-item"
      data-variant={variant}
      {...props}
    />
  );
}

/** An item that goes to another page. */
export function DropdownMenuLinkItem({
  className,
  ...props
}: ComponentProps<typeof Menu.LinkItem>) {
  return (
    <Menu.LinkItem
      className={cn(menuItemClassName, "no-underline", className)}
      data-slot="dropdown-menu-link-item"
      {...props}
    />
  );
}

export function DropdownMenuCheckboxItem({
  children,
  className,
  ...props
}: ComponentProps<typeof Menu.CheckboxItem>) {
  return (
    <Menu.CheckboxItem
      className={cn(menuItemClassName, className)}
      data-slot="dropdown-menu-checkbox-item"
      {...props}
    >
      <span className="min-w-0 flex-1">{children}</span>
      <Menu.CheckboxItemIndicator className="flex">
        <CheckIcon />
      </Menu.CheckboxItemIndicator>
    </Menu.CheckboxItem>
  );
}

export function DropdownMenuRadioGroup({
  className,
  ...props
}: ComponentProps<typeof Menu.RadioGroup>) {
  return (
    <Menu.RadioGroup
      className={cn(menuListClassName, className)}
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

export function DropdownMenuRadioItem({
  children,
  className,
  ...props
}: ComponentProps<typeof Menu.RadioItem>) {
  return (
    <Menu.RadioItem
      className={cn(menuItemClassName, className)}
      data-slot="dropdown-menu-radio-item"
      {...props}
    >
      <span className="min-w-0 flex-1">{children}</span>
      <Menu.RadioItemIndicator className="flex">
        <DotIcon />
      </Menu.RadioItemIndicator>
    </Menu.RadioItem>
  );
}

export function DropdownMenuGroup({
  className,
  ...props
}: ComponentProps<typeof Menu.Group>) {
  return (
    <Menu.Group
      className={cn(menuListClassName, className)}
      data-slot="dropdown-menu-group"
      {...props}
    />
  );
}

/** A heading for a group. It must be inside a `DropdownMenuGroup`. */
export function DropdownMenuLabel({
  className,
  ...props
}: ComponentProps<typeof Menu.GroupLabel>) {
  return (
    <Menu.GroupLabel
      className={cn(menuGroupLabelClassName, className)}
      data-slot="dropdown-menu-label"
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof Menu.Separator>) {
  return (
    <Menu.Separator
      className={cn(menuSeparatorClassName, className)}
      data-slot="dropdown-menu-separator"
      {...props}
    />
  );
}

/** Text at the end of an item, such as a keyboard shortcut. */
export function DropdownMenuShortcut({
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "font-craft-body text-craft-text-muted ml-auto pl-4 text-sm",
        className
      )}
      data-slot="dropdown-menu-shortcut"
      {...props}
    />
  );
}

/** A submenu: a `DropdownMenuSubTrigger` and a `DropdownMenuSubContent`. */
export function DropdownMenuSub(
  props: ComponentProps<typeof Menu.SubmenuRoot>
) {
  return <Menu.SubmenuRoot {...props} />;
}

export function DropdownMenuSubTrigger({
  children,
  className,
  ...props
}: ComponentProps<typeof Menu.SubmenuTrigger>) {
  return (
    <Menu.SubmenuTrigger
      className={cn(
        menuItemClassName,
        "data-popup-open:bg-craft-menu-highlight",
        className
      )}
      data-slot="dropdown-menu-sub-trigger"
      {...props}
    >
      <span className="min-w-0 flex-1">{children}</span>
      <ChevronRightIcon />
    </Menu.SubmenuTrigger>
  );
}

/** The items of a submenu. It opens beside its trigger. */
export function DropdownMenuSubContent({
  alignOffset = -4,
  side = "inline-end",
  sideOffset = 0,
  ...props
}: DropdownMenuContentProps) {
  return (
    <DropdownMenuContent
      align="start"
      alignOffset={alignOffset}
      data-slot="dropdown-menu-sub-content"
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}
