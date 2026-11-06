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
        // A unit of room on every side, taken back by the negative margin, so
        // that the scrolling list doesn't clip a tab's focus ring.
        "group/tabs-list -m-(--craft-unit) flex h-[calc(var(--craft-control-md)+var(--craft-unit)*2)] w-[calc(100%+var(--craft-unit)*2)] [scrollbar-width:none] items-start overflow-x-auto p-(--craft-unit)",
        // Segmented choices share the width and wrap long labels, as in the
        // reference, so they grow taller instead of scrolling. Each one
        // stretches to the row, less the selected one's sink.
        "data-[variant=segmented]:h-auto data-[variant=segmented]:min-h-[calc(var(--craft-control-md)+var(--craft-unit)*2)] data-[variant=segmented]:items-stretch",
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
        "craft-bevel font-craft-display text-craft-text focus-visible:craft-focus relative -ml-(--craft-unit) h-(--craft-control-md) min-w-max flex-1 cursor-pointer px-(--craft-space) pb-(--craft-edge) text-(length:--craft-label-size) first:ml-0 focus-visible:z-10",
        "[--bevel-depth:var(--craft-edge)] [--bevel-edge:var(--craft-raised-edge)] [--bevel-face:var(--craft-raised)] [--bevel-hi:var(--craft-raised-hi)] [--bevel-lo:var(--craft-raised-lo)]",
        "not-data-active:not-data-disabled:hover:[--bevel-face:var(--craft-raised-hover)] not-data-active:not-data-disabled:hover:[--bevel-hi:var(--craft-raised-hover-hi)] not-data-active:not-data-disabled:hover:[--bevel-lo:var(--craft-raised-hover-lo)]",
        // The selected tab sinks by the depth of its base, so its neighbours
        // stand taller. A pressed tab looks the same.
        "data-active:mt-(--craft-edge) data-active:h-[calc(var(--craft-control-md)-var(--craft-edge))] data-active:pb-0 data-active:[--bevel-depth:0px] data-active:[--bevel-face:var(--craft-sunken)] data-active:[--bevel-hi:var(--craft-selected-hi)] data-active:[--bevel-lo:var(--craft-selected-lo)]",
        // As specific as the hover rule, and after it, so that pressing wins.
        "not-data-active:not-data-disabled:active:mt-(--craft-edge) not-data-active:not-data-disabled:active:h-[calc(var(--craft-control-md)-var(--craft-edge))] not-data-active:not-data-disabled:active:pb-0 not-data-active:not-data-disabled:active:[--bevel-depth:0px] not-data-active:not-data-disabled:active:[--bevel-face:var(--craft-sunken)] not-data-active:not-data-disabled:active:[--bevel-hi:var(--craft-selected-hi)] not-data-active:not-data-disabled:active:[--bevel-lo:var(--craft-selected-lo)]",
        // The underline has a fixed width and sits on the tab's bottom edge.
        "after:absolute after:bottom-0 after:left-1/2 after:hidden after:h-(--craft-unit) after:w-[calc(var(--craft-unit)*24)] after:max-w-full after:-translate-x-1/2 after:bg-current data-active:after:block",
        // The segmented look: light tabs and a green selection.
        "group-data-[variant=segmented]/tabs-list:h-auto! group-data-[variant=segmented]/tabs-list:min-w-0 group-data-[variant=segmented]/tabs-list:py-2 group-data-[variant=segmented]/tabs-list:pb-[calc(var(--craft-edge)+0.5rem)] group-data-[variant=segmented]/tabs-list:leading-tight group-data-[variant=segmented]/tabs-list:data-active:pb-2",
        "group-data-[variant=segmented]/tabs-list:text-craft-secondary-fg group-data-[variant=segmented]/tabs-list:[--bevel-edge:var(--craft-secondary-edge)] group-data-[variant=segmented]/tabs-list:[--bevel-face:var(--craft-secondary)] group-data-[variant=segmented]/tabs-list:[--bevel-hi:var(--craft-secondary-hi)] group-data-[variant=segmented]/tabs-list:[--bevel-lo:var(--craft-secondary-lo)]",
        "group-data-[variant=segmented]/tabs-list:not-data-active:not-data-disabled:hover:[--bevel-face:var(--craft-secondary-hover)] group-data-[variant=segmented]/tabs-list:not-data-active:not-data-disabled:hover:[--bevel-hi:var(--craft-secondary-hover-hi)] group-data-[variant=segmented]/tabs-list:not-data-active:not-data-disabled:hover:[--bevel-lo:var(--craft-secondary-hover-lo)]",
        "group-data-[variant=segmented]/tabs-list:not-data-active:not-data-disabled:active:[--bevel-face:var(--craft-secondary-active)] group-data-[variant=segmented]/tabs-list:not-data-active:not-data-disabled:active:[--bevel-hi:var(--craft-secondary-active-hi)] group-data-[variant=segmented]/tabs-list:not-data-active:not-data-disabled:active:[--bevel-lo:var(--craft-secondary-active-lo)]",
        "group-data-[variant=segmented]/tabs-list:data-active:text-craft-primary-fg group-data-[variant=segmented]/tabs-list:data-active:[--bevel-face:var(--craft-primary)] group-data-[variant=segmented]/tabs-list:data-active:[--bevel-hi:var(--craft-primary-hi)] group-data-[variant=segmented]/tabs-list:data-active:[--bevel-lo:var(--craft-primary-lo)]",
        // A disabled tab looks the same as the others, as in the reference. In
        // the segmented look it takes the usual disabled colors.
        "data-disabled:cursor-not-allowed",
        "group-data-[variant=segmented]/tabs-list:data-disabled:text-craft-disabled-fg group-data-[variant=segmented]/tabs-list:data-disabled:[--bevel-edge:var(--craft-disabled-edge)] group-data-[variant=segmented]/tabs-list:data-disabled:[--bevel-face:var(--craft-disabled)] group-data-[variant=segmented]/tabs-list:data-disabled:[--bevel-hi:var(--craft-disabled)] group-data-[variant=segmented]/tabs-list:data-disabled:[--bevel-lo:var(--craft-disabled)] group-data-[variant=segmented]/tabs-list:data-disabled:[--bevel-outline:var(--craft-disabled-outline)]",
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
