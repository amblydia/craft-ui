import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

// No "use client", so a table can render on the server. Sorting needs an
// `onSort` handler, so a sortable table lives in a client component.

function SortIcon({ direction }: { direction: SortDirection }) {
  return (
    <svg
      aria-hidden="true"
      className="size-6 shrink-0"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 12 12"
    >
      {direction === "none" ? (
        <path d="M5 2h2v1H5zM4 3h4v1H4zM4 8h4v1H4zM5 9h2v1H5z" opacity="0.6" />
      ) : null}
      {direction === "ascending" ? (
        <path d="M5 3h2v1H5zM4 4h4v1H4zM3 5h6v1H3zM5 6h2v4H5z" />
      ) : null}
      {direction === "descending" ? (
        <path d="M5 2h2v4H5zM3 6h6v1H3zM4 7h4v1H4zM5 8h2v1H5z" />
      ) : null}
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-6 motion-safe:animate-[spin_1s_steps(8)_infinite]"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 16 16"
    >
      <path d="M7 1h2v4H7zM7 11h2v4H7zM1 7h4v2H1zM11 7h4v2h-4z" />
      <path
        d="M3 3h2v2H3zM11 3h2v2h-2zM3 11h2v2H3zM11 11h2v2h-2z"
        opacity="0.5"
      />
    </svg>
  );
}

export type SortDirection = "ascending" | "descending" | "none";

/** The frame. It scrolls sideways when the table is wider than it. */
export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div
      className="border-craft-outline relative w-full overflow-x-auto border-(length:--craft-unit)"
      data-slot="table-container"
    >
      <table
        className={cn(
          "font-craft-body text-craft-text w-full border-separate border-spacing-0 text-left text-sm",
          className
        )}
        data-slot="table"
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      className={cn("bg-craft-sunken", className)}
      data-slot="table-header"
      {...props}
    />
  );
}

export function TableBody(props: ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" {...props} />;
}

export function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return (
    <tfoot
      className={cn("bg-craft-sunken font-craft-display", className)}
      data-slot="table-footer"
      {...props}
    />
  );
}

export interface TableRowProps extends ComponentProps<"tr"> {
  /** Marks a selected row, with a green bar at its start. */
  selected?: boolean;
}

/**
 * A row, drawn like an Ore UI list row: a light line along its top and a dark
 * line along its bottom.
 */
export function TableRow({ className, selected, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        "[tbody_&]:bg-craft-surface [tbody_&]:hover:bg-craft-menu-highlight [&>td]:border-craft-surface-lo [&>td]:border-b-(length:--craft-unit) [tbody_&>td]:shadow-[inset_0_var(--craft-unit)_0_var(--craft-surface-hi)]",
        "data-selected:bg-craft-menu-highlight data-selected:[&>td:first-child]:shadow-[inset_var(--craft-edge)_0_0_var(--craft-primary),inset_0_var(--craft-unit)_0_var(--craft-surface-hi)]",
        className
      )}
      data-selected={selected || undefined}
      data-slot="table-row"
      {...props}
    />
  );
}

export interface TableHeadProps extends ComponentProps<"th"> {
  /** Called when the heading is clicked. Makes the column sortable. */
  onSort?: () => void;
  /** How the column is sorted now. */
  sortDirection?: SortDirection;
}

export function TableHead({
  children,
  className,
  onSort,
  sortDirection = "none",
  ...props
}: TableHeadProps) {
  return (
    <th
      aria-sort={onSort ? sortDirection : undefined}
      className={cn(
        "border-craft-outline font-craft-display text-craft-text h-(--craft-control-md) border-b-(length:--craft-unit) px-(--craft-space) align-middle font-normal whitespace-nowrap text-(length:--craft-label-size)",
        onSort && "p-0",
        className
      )}
      data-slot="table-head"
      scope="col"
      {...props}
    >
      {onSort ? (
        <button
          className="hover:bg-craft-hover focus-visible:craft-focus flex h-(--craft-control-md) w-full cursor-pointer items-center justify-between gap-2 px-(--craft-space) text-left outline-none focus-visible:-outline-offset-2"
          data-slot="table-sort-button"
          onClick={onSort}
          type="button"
        >
          {children}
          <SortIcon direction={sortDirection} />
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      className={cn("px-(--craft-space) py-3 align-middle", className)}
      data-slot="table-cell"
      {...props}
    />
  );
}

export function TableCaption({
  className,
  ...props
}: ComponentProps<"caption">) {
  return (
    <caption
      className={cn(
        "font-craft-body text-craft-text-muted caption-bottom px-(--craft-space) py-3 text-sm",
        className
      )}
      data-slot="table-caption"
      {...props}
    />
  );
}

export interface TableStateProps extends ComponentProps<"td"> {
  /** How many columns the message spans: the number of columns in the table. */
  colSpan: number;
}

/** A row that says there's nothing to show. */
export function TableEmpty({
  children = "Nothing to show yet.",
  className,
  colSpan,
  ...props
}: TableStateProps) {
  return (
    <tr data-slot="table-empty">
      <td
        className={cn(
          "bg-craft-surface text-craft-text-muted px-(--craft-space) py-10 text-center",
          className
        )}
        colSpan={colSpan}
        {...props}
      >
        {children}
      </td>
    </tr>
  );
}

export interface TableLoadingProps extends TableStateProps {
  /** Announced to screen readers, and shown beside the spinner. */
  label?: ReactNode;
}

/** A row with a spinner, while the data loads. */
export function TableLoading({
  className,
  colSpan,
  label = "Loading",
  ...props
}: TableLoadingProps) {
  return (
    <tr data-slot="table-loading">
      <td
        className={cn(
          "bg-craft-surface text-craft-text-muted px-(--craft-space) py-10",
          className
        )}
        colSpan={colSpan}
        {...props}
      >
        <span
          className="font-craft-display flex items-center justify-center gap-3 text-(length:--craft-label-size)"
          role="status"
        >
          <SpinnerIcon />
          {label}
        </span>
      </td>
    </tr>
  );
}
