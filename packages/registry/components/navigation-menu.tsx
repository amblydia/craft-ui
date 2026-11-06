"use client";

import { NavigationMenu as BaseNavigationMenu } from "@base-ui/react/navigation-menu";
import { type ComponentProps, createContext, useContext } from "react";
import {
  menuFrameClassName,
  menuItemClassName,
  menuListClassName,
} from "@/components/craft/menu-styles";
import { cn } from "@/lib/utils";

// Links inside a dropdown panel look like menu rows, not like bar items.
const InPanelContext = createContext(false);

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-6 shrink-0 group-data-[orientation=horizontal]/navigation-menu:group-data-popup-open/navigation-menu-trigger:rotate-180 group-data-[orientation=vertical]/navigation-menu:-rotate-90 motion-safe:transition-transform motion-safe:duration-150"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 12 12"
    >
      <path d="M2 4h1v1H2zM9 4h1v1H9zM3 5h1v1H3zM8 5h1v1H8zM4 6h1v1H4zM7 6h1v1H7zM5 7h2v1H5z" />
    </svg>
  );
}

export interface NavigationMenuProps
  extends ComponentProps<typeof BaseNavigationMenu.Root> {
  /**
   * `horizontal` is a top bar, with panels that drop down. `vertical` is a
   * sidebar, as in Ore UI's settings, with panels that open to the side.
   */
  orientation?: "horizontal" | "vertical";
}

export function NavigationMenu({
  children,
  className,
  orientation = "horizontal",
  ...props
}: NavigationMenuProps) {
  return (
    <BaseNavigationMenu.Root
      className={cn(
        "group/navigation-menu text-craft-text relative",
        orientation === "vertical" && "w-full",
        className
      )}
      data-orientation={orientation}
      data-slot="navigation-menu"
      orientation={orientation}
      {...props}
    >
      {children}
      <BaseNavigationMenu.Portal>
        <BaseNavigationMenu.Positioner
          className="z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width)"
          collisionPadding={8}
          side={orientation === "vertical" ? "inline-end" : "bottom"}
          sideOffset={orientation === "vertical" ? 0 : 4}
        >
          <BaseNavigationMenu.Popup
            className={cn(
              menuFrameClassName,
              "box-content h-(--popup-height) w-(--popup-width)"
            )}
            data-slot="navigation-menu-popup"
          >
            <BaseNavigationMenu.Viewport className="relative h-full w-full overflow-hidden" />
          </BaseNavigationMenu.Popup>
        </BaseNavigationMenu.Positioner>
      </BaseNavigationMenu.Portal>
    </BaseNavigationMenu.Root>
  );
}

export function NavigationMenuList({
  className,
  ...props
}: ComponentProps<typeof BaseNavigationMenu.List>) {
  return (
    <BaseNavigationMenu.List
      className={cn(
        "flex",
        "group-data-[orientation=horizontal]/navigation-menu:items-stretch group-data-[orientation=horizontal]/navigation-menu:gap-(--craft-unit)",
        // The sidebar is a sunken panel, as in Ore UI's settings.
        "group-data-[orientation=vertical]/navigation-menu:bg-craft-sunken group-data-[orientation=vertical]/navigation-menu:flex-col group-data-[orientation=vertical]/navigation-menu:py-(--craft-unit)",
        className
      )}
      data-slot="navigation-menu-list"
      {...props}
    />
  );
}

export function NavigationMenuItem({
  className,
  ...props
}: ComponentProps<typeof BaseNavigationMenu.Item>) {
  return (
    <BaseNavigationMenu.Item
      className={cn("relative", className)}
      data-slot="navigation-menu-item"
      {...props}
    />
  );
}

// A bar item. In a sidebar it fills the row, and the selected one is lifted to
// the surface color. In a top bar the selected one gets the tab underline.
const barItemClassName = cn(
  "font-craft-display text-craft-text hover:bg-craft-hover focus-visible:craft-focus data-popup-open:bg-craft-hover relative flex h-(--craft-control-md) cursor-pointer items-center gap-2 px-(--craft-space) whitespace-nowrap text-(length:--craft-label-size) no-underline outline-none select-none focus-visible:-outline-offset-2",
  "group-data-[orientation=vertical]/navigation-menu:w-full group-data-[orientation=vertical]/navigation-menu:justify-between",
  "after:absolute after:bottom-0 after:left-1/2 after:hidden after:h-(--craft-unit) after:w-[calc(var(--craft-unit)*24)] after:max-w-full after:-translate-x-1/2 after:bg-current group-data-[orientation=horizontal]/navigation-menu:data-active:after:block",
  "group-data-[orientation=vertical]/navigation-menu:data-active:bg-craft-surface group-data-[orientation=vertical]/navigation-menu:data-active:shadow-[inset_0_var(--craft-unit)_0_var(--craft-surface-hi),inset_0_calc(-1*var(--craft-unit))_0_var(--craft-surface-lo)]"
);

/** Opens a panel of links. Put a `NavigationMenuContent` after it. */
export function NavigationMenuTrigger({
  children,
  className,
  ...props
}: ComponentProps<typeof BaseNavigationMenu.Trigger>) {
  return (
    <BaseNavigationMenu.Trigger
      className={cn(
        barItemClassName,
        "group/navigation-menu-trigger",
        className
      )}
      data-slot="navigation-menu-trigger"
      {...props}
    >
      {children}
      <ChevronIcon />
    </BaseNavigationMenu.Trigger>
  );
}

/** The panel a trigger opens. Its links are drawn as menu rows. */
export function NavigationMenuContent({
  className,
  ...props
}: ComponentProps<typeof BaseNavigationMenu.Content>) {
  return (
    <InPanelContext.Provider value={true}>
      <BaseNavigationMenu.Content
        className={cn(
          menuListClassName,
          "w-max max-w-[calc(100vw-2rem)] min-w-56",
          "data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:transition-opacity motion-safe:duration-150",
          className
        )}
        data-slot="navigation-menu-content"
        {...props}
      />
    </InPanelContext.Provider>
  );
}

export interface NavigationMenuLinkProps
  extends ComponentProps<typeof BaseNavigationMenu.Link> {
  /** Marks the current page: it's selected, and announced as the current page. */
  active?: boolean;
}

/**
 * A link. For client-side routing, pass your framework's link, such as
 * `render={<NextLink href="/settings" />}`.
 */
export function NavigationMenuLink({
  active,
  className,
  ...props
}: NavigationMenuLinkProps) {
  const inPanel = useContext(InPanelContext);
  return (
    <BaseNavigationMenu.Link
      active={active}
      aria-current={active ? "page" : undefined}
      className={cn(
        inPanel
          ? cn(
              menuItemClassName,
              "hover:bg-craft-menu-highlight data-active:bg-craft-menu-highlight no-underline"
            )
          : barItemClassName,
        className
      )}
      data-slot="navigation-menu-link"
      {...props}
    />
  );
}

/** A heading between groups of sidebar links, with a groove under it. */
export function NavigationMenuLabel({
  className,
  ...props
}: ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "font-craft-body text-craft-text-muted mt-3 px-(--craft-space) pt-2 pb-[calc(var(--craft-unit)*4)] text-sm shadow-[inset_0_calc(-1*var(--craft-unit))_0_var(--craft-sunken-hi),inset_0_calc(-2*var(--craft-unit))_0_var(--craft-outline)] first:mt-0",
        className
      )}
      data-slot="navigation-menu-label"
      {...props}
    />
  );
}
