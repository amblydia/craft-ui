"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/craft/tooltip";
import { cn } from "@/lib/utils";

/** An item, as your app describes it. CraftUI never looks items up itself. */
export interface Item {
  /** How many are stacked in the slot. Shown from 2. */
  count?: number;
  /** More lines for the tooltip, under the name. */
  description?: ReactNode;
  /** What's left of it, from 0 to 1. Shown as a bar while it's below 1. */
  durability?: number;
  /**
   * The picture: usually an `<img>`, or an SVG. It's hidden from screen
   * readers, because the slot's label already says what it is.
   */
  icon?: ReactNode;
  /** A stable id, for React keys. */
  id: string;
  /** The item's name: read out as the slot's label, and its tooltip's title. */
  name: string;
}

/** The fraction shown by the durability bar, or nothing while the item is whole. */
function wear(item: Item) {
  if (item.durability === undefined || item.durability >= 1) {
    return null;
  }
  return Math.max(0, item.durability);
}

/**
 * What a screen reader hears for a slot: its name, count and durability, such
 * as "Iron Pickaxe, 40% durability". Pass your own to a slot's `label` to
 * translate it.
 */
export function itemLabel(
  item: Item | null | undefined,
  emptyLabel = "Empty slot"
) {
  if (!item) {
    return emptyLabel;
  }
  const parts = [item.name];
  if (item.count !== undefined && item.count > 1) {
    parts.push(String(item.count));
  }
  const left = wear(item);
  if (left !== null) {
    parts.push(`${Math.round(left * 100)}% durability`);
  }
  return parts.join(", ");
}

const sizes = {
  lg: "size-[calc(var(--craft-unit)*32)] [--slot-count-size:var(--craft-label-size)]",
  md: "size-[calc(var(--craft-unit)*24)] [--slot-count-size:var(--craft-label-size)]",
  sm: "size-[calc(var(--craft-unit)*18)] [--slot-count-size:0.6875rem]",
};

export type ItemSlotSize = keyof typeof sizes;

/**
 * The look of a slot, for anything that should match one. Recessed, with a
 * green frame when selected, a highlight on hover when it can be focused, and
 * hatching when disabled.
 */
export const itemSlotClassName = cn(
  "group/item-slot bg-craft-slot border-craft-outline relative isolate inline-flex shrink-0 items-center justify-center border-(length:--craft-unit) outline-none select-none",
  "shadow-[inset_var(--craft-unit)_var(--craft-unit)_0_var(--craft-slot-lo),inset_calc(-1*var(--craft-unit))_calc(-1*var(--craft-unit))_0_var(--craft-slot-hi)]",
  // The highlight sits over the item too, as it does in the game.
  "after:bg-craft-hover after:pointer-events-none after:absolute after:inset-0 after:hidden",
  "[&:is(button,[tabindex]):not([data-disabled]):hover]:cursor-pointer [&:is(button,[tabindex]):not([data-disabled]):hover]:after:block",
  "data-selected:shadow-[inset_0_0_0_var(--craft-unit)_var(--craft-primary-hi),inset_0_0_0_calc(var(--craft-unit)*3)_var(--craft-primary)]",
  "focus-visible:craft-focus focus-visible:z-10",
  "data-disabled:cursor-not-allowed data-disabled:bg-[image:repeating-linear-gradient(135deg,var(--craft-slot-lo)_0_var(--craft-unit),transparent_var(--craft-unit)_calc(var(--craft-unit)*4))]"
);

export interface ItemSlotProps extends useRender.ComponentProps<"div"> {
  /** Hatches the slot and dims its item. Set `aria-disabled` on interactive slots too. */
  disabled?: boolean;
  /** The item in the slot. Leave it out for an empty slot. */
  item?: Item | null;
  /**
   * What a screen reader hears, in place of the item's name, count and
   * durability. Use it to translate the slot.
   */
  label?: string;
  /** Gives the slot a green frame. */
  selected?: boolean;
  /** `sm` is 36px, `md` 48px and `lg` 64px. */
  size?: ItemSlotSize;
}

/**
 * One slot that holds an item, with its count and durability. It's a `div`
 * holding the label as hidden text. To make one that can be pressed, pass
 * `render={<button type="button" />}`.
 */
export function ItemSlot({
  children,
  className,
  disabled,
  item,
  label,
  render,
  selected,
  size = "md",
  ...props
}: ItemSlotProps) {
  const left = item ? wear(item) : null;
  const count = item?.count !== undefined && item.count > 1 ? item.count : null;

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        children: (
          <>
            <span className="sr-only">{label ?? itemLabel(item)}</span>
            {item?.icon ? (
              <span
                aria-hidden="true"
                className="absolute inset-[calc(var(--craft-unit)*3)] flex items-center justify-center group-data-disabled/item-slot:opacity-40 group-data-disabled/item-slot:grayscale [&>img]:size-full [&>img]:object-contain [&>img]:[image-rendering:pixelated] [&>svg]:size-full"
                data-slot="item-slot-icon"
              >
                {item.icon}
              </span>
            ) : null}
            {count === null ? null : (
              <span
                aria-hidden="true"
                className="font-craft-display text-craft-text absolute right-(--craft-unit) bottom-0 leading-none text-(length:--slot-count-size) tabular-nums [text-shadow:var(--craft-unit)_var(--craft-unit)_0_var(--craft-slot-count-shadow)]"
                data-slot="item-slot-count"
              >
                {count}
              </span>
            )}
            {left === null ? null : (
              <span
                aria-hidden="true"
                className="bg-craft-outline absolute inset-x-[calc(var(--craft-unit)*3)] bottom-[calc(var(--craft-unit)*3)] h-[calc(var(--craft-unit)*2)]"
                data-slot="item-slot-durability"
              >
                {/* Green when new, through yellow, to red when nearly broken. */}
                <span
                  className="block h-(--craft-unit) w-(--durability) bg-[hsl(calc(var(--durability-hue)*1deg)_90%_45%)]"
                  style={
                    {
                      "--durability": `${left * 100}%`,
                      "--durability-hue": Math.round(left * 120),
                    } as CSSProperties
                  }
                />
              </span>
            )}
            {children}
          </>
        ),
        className: cn(itemSlotClassName, sizes[size], className),
        "data-disabled": disabled ? "" : undefined,
        "data-empty": item ? undefined : "",
        "data-selected": selected ? "" : undefined,
        "data-size": size,
        "data-slot": "item-slot",
      } as ComponentPropsWithData,
      props
    ),
    render,
  });
}

type ComponentPropsWithData = useRender.ComponentProps<"div"> &
  Record<`data-${string}`, string | undefined>;

/** The tooltip's text for an item: its name, then its description. */
export function ItemInfo({ item }: { item: Item }) {
  return (
    <span className="flex flex-col gap-1" data-slot="item-info">
      <span>{item.name}</span>
      {item.description ? (
        <span className="font-craft-body text-sm leading-snug">
          {item.description}
        </span>
      ) : null}
    </span>
  );
}

export interface ItemTooltipProps {
  /** The element the tooltip is for, such as an `ItemSlot` rendered as a button. */
  children: ReactElement;
  /** The item to describe. Without one, there is no tooltip. */
  item: Item | null | undefined;
}

/**
 * Shows an item's name and description over a single slot, on hover and on
 * keyboard focus. Inventory Grid and Hotbar already include this.
 */
export function ItemTooltip({ children, item }: ItemTooltipProps) {
  if (!item) {
    return children;
  }
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent align="center">
        <ItemInfo item={item} />
      </TooltipContent>
    </Tooltip>
  );
}
