"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Tabs({
  className,
  ...props
}: ComponentProps<typeof BaseTabs.Root>) {
  return (
    <BaseTabs.Root
      className={cn("flex w-full flex-col gap-4", className)}
      data-slot="tabs"
      {...props}
    />
  );
}

export interface TabsListProps extends ComponentProps<typeof BaseTabs.List> {
  /**
   * `default` is the dark tab bar at the top of Ore UI screens. `segmented` is
   * the light row of choices with a green selection.
   */
  variant?: "default" | "segmented";
}

export function TabsList({
  className,
  variant = "default",
  ...props
}: TabsListProps) {
  return (
    <BaseTabs.List
      className={cn(
        "group/tabs-list flex w-full [scrollbar-width:none] overflow-x-auto",
        className
      )}
      data-slot="tabs-list"
      data-variant={variant}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof BaseTabs.Tab>) {
  return (
    <BaseTabs.Tab
      className={cn(
        // Neighbouring tabs share one outline, and the focused tab sits on top
        // so its ring is not covered by the next tab.
        "craft-bevel font-craft-display text-craft-text focus-visible:craft-focus relative -ml-(--craft-unit) h-(--craft-control-lg) min-w-max flex-1 cursor-pointer px-(--craft-space) pb-(--craft-edge) text-xl first:ml-0 focus-visible:z-10 focus-visible:-outline-offset-2",
        "[--bevel-edge:var(--craft-raised-edge)] [--bevel-face:var(--craft-raised)] [--bevel-hi:var(--craft-raised-hi)] [--bevel-lo:var(--craft-raised-lo)]",
        "hover:[--bevel-face:var(--craft-raised-lo)]",
        // The selected tab sinks, loses its base and gains an underline.
        "data-active:pb-0 data-active:[--bevel-depth:0px] data-active:[--bevel-face:var(--craft-sunken)] data-active:[--bevel-hi:var(--craft-sunken-hi)] data-active:[--bevel-lo:var(--craft-sunken-hi)]",
        "after:absolute after:inset-x-1/3 after:bottom-[calc(var(--craft-unit)*3)] after:hidden after:h-(--craft-unit) after:bg-current data-active:after:block",
        // The segmented look: light tabs and a green selection.
        "group-data-[variant=segmented]/tabs-list:text-craft-secondary-fg group-data-[variant=segmented]/tabs-list:[--bevel-edge:var(--craft-secondary-edge)] group-data-[variant=segmented]/tabs-list:[--bevel-face:var(--craft-secondary)] group-data-[variant=segmented]/tabs-list:[--bevel-hi:var(--craft-secondary-hi)] group-data-[variant=segmented]/tabs-list:[--bevel-lo:var(--craft-secondary-lo)]",
        "group-data-[variant=segmented]/tabs-list:hover:[--bevel-face:var(--craft-secondary-hover)]",
        "group-data-[variant=segmented]/tabs-list:data-active:text-craft-primary-fg group-data-[variant=segmented]/tabs-list:data-active:[--bevel-face:var(--craft-primary)] group-data-[variant=segmented]/tabs-list:data-active:[--bevel-hi:var(--craft-primary-hi)] group-data-[variant=segmented]/tabs-list:data-active:[--bevel-lo:var(--craft-primary-lo)]",
        // A disabled tab recedes into the bar, so it doesn't draw the eye.
        "data-disabled:text-craft-placeholder data-disabled:cursor-not-allowed data-disabled:[--bevel-edge:transparent] data-disabled:[--bevel-face:var(--craft-surface-lo)] data-disabled:[--bevel-hi:var(--craft-surface-lo)] data-disabled:[--bevel-lo:var(--craft-surface-lo)]",
        className
      )}
      data-slot="tabs-trigger"
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: ComponentProps<typeof BaseTabs.Panel>) {
  return (
    <BaseTabs.Panel
      className={cn("focus-visible:craft-focus outline-none", className)}
      data-slot="tabs-content"
      {...props}
    />
  );
}
