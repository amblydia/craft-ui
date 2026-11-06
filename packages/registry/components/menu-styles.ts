// The look shared by every list that opens over the page: Select, Combobox,
// Dropdown Menu, Context Menu and Navigation Menu. As in Ore UI, it's a dark
// outline around a line, with rows split by that same line. Class names only,
// so it has no "use client".

/** The frame. Its background shows between the rows as the dividing lines. */
export const menuFrameClassName =
  "border-craft-outline bg-craft-menu-line text-craft-text border-(length:--craft-unit) p-(--craft-unit) outline-none data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:transition-opacity motion-safe:duration-100";

/** Stacks rows with one unit between them, where the frame shows through. */
export const menuListClassName = "flex flex-col gap-(--craft-unit)";

/** The whole popup of a menu, which scrolls when it doesn't fit. */
export const menuPopupClassName = `${menuFrameClassName} ${menuListClassName} max-h-(--available-height) min-w-48 overflow-y-auto`;

export const menuItemClassName =
  "bg-craft-menu font-craft-display text-craft-text flex min-h-[calc(var(--craft-unit)*23)] cursor-pointer items-center gap-3 px-(--craft-space) text-left text-(length:--craft-label-size) leading-tight outline-none select-none data-highlighted:bg-craft-menu-highlight focus-visible:craft-focus focus-visible:-outline-offset-2 data-disabled:text-craft-track data-disabled:cursor-not-allowed [&_svg]:shrink-0";

/** A destructive item: red text, and a red row while it's highlighted. */
export const menuItemDestructiveClassName =
  "text-craft-destructive-text data-highlighted:bg-craft-destructive data-highlighted:text-craft-destructive-fg";

export const menuGroupLabelClassName =
  "bg-craft-menu font-craft-body text-craft-text-muted px-(--craft-space) pt-2 pb-1 text-sm";

/** A heavier divider than the line between rows. */
export const menuSeparatorClassName =
  "bg-craft-outline h-(--craft-unit) shrink-0";
