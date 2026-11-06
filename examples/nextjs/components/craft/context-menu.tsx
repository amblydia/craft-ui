"use client";

import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import type { ComponentProps } from "react";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/craft/dropdown-menu";
import { menuPopupClassName } from "@/components/craft/menu-styles";
import { cn } from "@/lib/utils";

export function ContextMenu(
  props: ComponentProps<typeof BaseContextMenu.Root>
) {
  return <BaseContextMenu.Root {...props} />;
}

/**
 * The area that opens the menu on right-click, or on a long press on touch
 * screens. Keyboard users open it with the context menu key or Shift+F10 while
 * focus is inside it, so give it `tabIndex={0}` if nothing in it can take focus.
 */
export function ContextMenuTrigger({
  className,
  ...props
}: ComponentProps<typeof BaseContextMenu.Trigger>) {
  return (
    <BaseContextMenu.Trigger
      className={cn("select-none", className)}
      data-slot="context-menu-trigger"
      {...props}
    />
  );
}

export function ContextMenuContent({
  className,
  ...props
}: ComponentProps<typeof BaseContextMenu.Popup>) {
  return (
    <BaseContextMenu.Portal>
      <BaseContextMenu.Positioner className="z-50 outline-none">
        <BaseContextMenu.Popup
          className={cn(menuPopupClassName, className)}
          data-slot="context-menu-content"
          {...props}
        />
      </BaseContextMenu.Positioner>
    </BaseContextMenu.Portal>
  );
}

// A context menu's items are the same as a dropdown menu's, so they're shared.
export const ContextMenuCheckboxItem = DropdownMenuCheckboxItem;
export const ContextMenuGroup = DropdownMenuGroup;
export const ContextMenuItem = DropdownMenuItem;
export const ContextMenuLabel = DropdownMenuLabel;
export const ContextMenuLinkItem = DropdownMenuLinkItem;
export const ContextMenuRadioGroup = DropdownMenuRadioGroup;
export const ContextMenuRadioItem = DropdownMenuRadioItem;
export const ContextMenuSeparator = DropdownMenuSeparator;
export const ContextMenuShortcut = DropdownMenuShortcut;
export const ContextMenuSub = DropdownMenuSub;
export const ContextMenuSubContent = DropdownMenuSubContent;
export const ContextMenuSubTrigger = DropdownMenuSubTrigger;
