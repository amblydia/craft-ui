import type { ComponentProps } from "react";
import {
  buttonDisabledClassName,
  buttonVariants,
} from "@/components/craft/button-variants";
import { cn } from "@/lib/utils";

// No "use client": the links render on the server, so pages can be crawled.

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-6", direction === "left" && "-scale-x-100")}
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 12 12"
    >
      <path d="M4 2h1v1H4zM4 9h1v1H4zM5 3h1v1H5zM5 8h1v1H5zM6 4h1v1H6zM6 7h1v1H6zM7 5h1v2H7z" />
    </svg>
  );
}

export function Pagination({
  "aria-label": ariaLabel = "Pagination",
  className,
  ...props
}: ComponentProps<"nav">) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn("flex w-full justify-center", className)}
      data-slot="pagination"
      {...props}
    />
  );
}

export function PaginationContent({
  className,
  ...props
}: ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-wrap items-center gap-2", className)}
      data-slot="pagination-content"
      {...props}
    />
  );
}

export function PaginationItem(props: ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

export interface PaginationLinkProps extends ComponentProps<"a"> {
  /** Greys the link out and takes it out of the tab order. */
  disabled?: boolean;
  /** Marks the current page: green, as a selection is in Ore UI. */
  isActive?: boolean;
}

export function PaginationLink({
  className,
  disabled,
  href,
  isActive,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        buttonVariants({
          size: "icon",
          variant: isActive ? "primary" : "secondary",
        }),
        "w-auto min-w-(--craft-control-md) px-3 no-underline",
        disabled && cn(buttonDisabledClassName, "pointer-events-none"),
        className
      )}
      data-active={isActive || undefined}
      data-disabled={disabled || undefined}
      data-slot="pagination-link"
      // A disabled link has no destination, so it can't be followed.
      href={disabled ? undefined : href}
      role={disabled ? "link" : undefined}
      tabIndex={disabled ? -1 : undefined}
      {...props}
    />
  );
}

export function PaginationPrevious({
  children = "Previous",
  className,
  ...props
}: PaginationLinkProps) {
  return (
    <PaginationLink
      aria-label="Go to the previous page"
      className={cn("gap-1 pl-1", className)}
      data-slot="pagination-previous"
      {...props}
    >
      <ChevronIcon direction="left" />
      <span className="max-sm:sr-only">{children}</span>
    </PaginationLink>
  );
}

export function PaginationNext({
  children = "Next",
  className,
  ...props
}: PaginationLinkProps) {
  return (
    <PaginationLink
      aria-label="Go to the next page"
      className={cn("gap-1 pr-1", className)}
      data-slot="pagination-next"
      {...props}
    >
      <span className="max-sm:sr-only">{children}</span>
      <ChevronIcon direction="right" />
    </PaginationLink>
  );
}

/** Stands in for the pages that aren't shown. */
export function PaginationEllipsis({
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "font-craft-display text-craft-text flex size-(--craft-control-md) items-center justify-center text-(length:--craft-label-size)",
        className
      )}
      data-slot="pagination-ellipsis"
      {...props}
    >
      <span aria-hidden="true">...</span>
      <span className="sr-only">More pages</span>
    </span>
  );
}
