"use client";

import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-6 shrink-0 group-data-panel-open/accordion-trigger:rotate-180 motion-safe:transition-transform motion-safe:duration-150"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 12 12"
    >
      <path d="M2 4h1v1H2zM9 4h1v1H9zM3 5h1v1H3zM8 5h1v1H8zM4 6h1v1H4zM7 6h1v1H7zM5 7h2v1H5z" />
    </svg>
  );
}

/** Set `multiple` to let more than one item open at a time. */
export function Accordion({
  className,
  ...props
}: ComponentProps<typeof BaseAccordion.Root>) {
  return (
    <BaseAccordion.Root
      className={cn("flex w-full flex-col gap-2", className)}
      data-slot="accordion"
      {...props}
    />
  );
}

/** One framed row, as in Ore UI's expandable lists. */
export function AccordionItem({
  className,
  ...props
}: ComponentProps<typeof BaseAccordion.Item>) {
  return (
    <BaseAccordion.Item
      className={cn(
        "craft-bevel text-craft-text [--bevel-depth:0px] [--bevel-edge:transparent] [--bevel-face:var(--craft-surface)] [--bevel-hi:var(--craft-surface-hi)] [--bevel-lo:var(--craft-surface-lo)]",
        className
      )}
      data-slot="accordion-item"
      {...props}
    />
  );
}

export function AccordionTrigger({
  children,
  className,
  ...props
}: ComponentProps<typeof BaseAccordion.Trigger>) {
  return (
    <BaseAccordion.Header className="flex" data-slot="accordion-header">
      <BaseAccordion.Trigger
        className={cn(
          "group/accordion-trigger font-craft-display hover:bg-craft-hover focus-visible:craft-focus flex min-h-(--craft-control-lg) w-full cursor-pointer items-center justify-between gap-4 px-(--craft-space) py-2 text-left leading-tight text-(length:--craft-label-size) outline-none focus-visible:-outline-offset-2",
          "data-disabled:text-craft-text-muted data-disabled:cursor-not-allowed data-disabled:hover:bg-transparent",
          className
        )}
        data-slot="accordion-trigger"
        {...props}
      >
        {children}
        <ChevronIcon />
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

export function AccordionContent({
  children,
  className,
  ...props
}: ComponentProps<typeof BaseAccordion.Panel>) {
  return (
    <BaseAccordion.Panel
      className="h-(--accordion-panel-height) overflow-hidden data-ending-style:h-0 data-starting-style:h-0 motion-safe:transition-[height] motion-safe:duration-150"
      data-slot="accordion-content"
      {...props}
    >
      <div
        className={cn(
          "border-craft-surface-lo font-craft-body mx-(--craft-unit) border-t-(length:--craft-unit) px-[calc(var(--craft-space)-var(--craft-unit))] py-(--craft-space)",
          className
        )}
      >
        {children}
      </div>
    </BaseAccordion.Panel>
  );
}
