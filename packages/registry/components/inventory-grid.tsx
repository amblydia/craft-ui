"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import {
  type ComponentProps,
  type DragEvent,
  type KeyboardEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type Item,
  ItemInfo,
  ItemSlot,
  type ItemSlotSize,
  itemLabel,
} from "@/components/craft/item-slot";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/craft/tooltip";
import { cn } from "@/lib/utils";

const MOVE_KEYS: Record<string, [row: number, column: number]> = {
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
  ArrowUp: [-1, 0],
};

export interface InventoryGridProps
  extends Omit<ComponentProps<"div">, "children" | "defaultValue"> {
  /** How many slots in a row. */
  columns?: number;
  /** The selected slot to start with, when you don't control `selectedIndex`. */
  defaultSelectedIndex?: number | null;
  /** Slots that can't be selected or dropped on, by index. */
  disabledSlots?: readonly number[];
  /** What a screen reader hears for an empty slot. */
  emptyLabel?: string;
  /**
   * What a screen reader hears for each slot. Defaults to the item's name,
   * count and durability.
   */
  getItemLabel?: (item: Item, index: number) => string;
  /**
   * What a screen reader hears after a move, such as "Moved Torch to slot 5".
   * Slots are counted from 1.
   */
  getMoveAnnouncement?: (item: Item, to: number) => string;
  /**
   * The contents of each slot, by index. `null` is an empty slot. The grid
   * shows them but never changes them: update them in `onMove`.
   */
  items: readonly (Item | null | undefined)[];
  /**
   * Called when an item is dragged to another slot, or moved with Alt and an
   * arrow key. Move or swap the items in your state. Without it, items can't
   * be moved.
   */
  onMove?: (from: number, to: number) => void;
  /** Called when a slot is selected by click, Enter or Space. */
  onSelectedIndexChange?: (index: number | null) => void;
  /** How many rows. Defaults to as many as the items need. */
  rows?: number;
  /** The selected slot. `null` when none is. */
  selectedIndex?: number | null;
  /** The size of every slot. */
  size?: ItemSlotSize;
  /** Shows each item's name and description on hover and keyboard focus. */
  tooltips?: boolean;
}

/**
 * A grid of item slots, like an inventory or a chest. It's a keyboard grid:
 * Tab enters it once, and the arrow keys move between slots.
 */
export function InventoryGrid({
  className,
  columns = 9,
  defaultSelectedIndex = null,
  disabledSlots,
  emptyLabel = "Empty slot",
  getItemLabel,
  getMoveAnnouncement = (item, to) => `Moved ${item.name} to slot ${to}`,
  items,
  onMove,
  onSelectedIndexChange,
  rows,
  selectedIndex: selectedIndexProp,
  size = "md",
  style,
  tooltips = true,
  ...props
}: InventoryGridProps) {
  const rowCount = Math.max(1, rows ?? Math.ceil(items.length / columns));
  const slotCount = rowCount * columns;

  const [uncontrolledSelected, setUncontrolledSelected] =
    useState(defaultSelectedIndex);
  const selectedIndex =
    selectedIndexProp === undefined ? uncontrolledSelected : selectedIndexProp;
  const [focusIndex, setFocusIndex] = useState(selectedIndex ?? 0);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const slots = useRef<(HTMLElement | null)[]>([]);
  const tooltip = useMemo(() => BaseTooltip.createHandle<Item>(), []);

  const disabled = useMemo(() => new Set(disabledSlots), [disabledSlots]);
  // The roving tab stop stays inside the grid, even if it shrinks.
  const tabStop = Math.min(focusIndex, slotCount - 1);

  const select = useCallback(
    (index: number) => {
      if (disabled.has(index) || index === selectedIndex) {
        return;
      }
      setUncontrolledSelected(index);
      onSelectedIndexChange?.(index);
    },
    [disabled, onSelectedIndexChange, selectedIndex]
  );

  const focus = (index: number) => {
    setFocusIndex(index);
    slots.current[index]?.focus();
  };

  const move = (from: number, to: number) => {
    const item = items[from];
    if (!(onMove && item) || from === to || disabled.has(to)) {
      return false;
    }
    onMove(from, to);
    setAnnouncement(getMoveAnnouncement(item, to + 1));
    return true;
  };

  const target = (event: KeyboardEvent, index: number) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const step = MOVE_KEYS[event.key];
    if (step) {
      const nextRow = row + step[0];
      const nextColumn = column + step[1];
      if (
        nextRow < 0 ||
        nextRow >= rowCount ||
        nextColumn < 0 ||
        nextColumn >= columns
      ) {
        return index;
      }
      return nextRow * columns + nextColumn;
    }
    const control = event.ctrlKey || event.metaKey;
    if (event.key === "Home") {
      return control ? 0 : row * columns;
    }
    if (event.key === "End") {
      return control ? slotCount - 1 : row * columns + columns - 1;
    }
    return null;
  };

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      select(index);
      return;
    }
    const next = target(event, index);
    if (next === null) {
      return;
    }
    event.preventDefault();
    if (event.altKey && MOVE_KEYS[event.key]) {
      if (move(index, next)) {
        focus(next);
      }
      return;
    }
    focus(next);
  };

  const dragProps = (index: number, item: Item | null | undefined) => {
    if (!onMove) {
      return {};
    }
    return {
      draggable: Boolean(item) && !disabled.has(index),
      onDragEnd: () => {
        setDragIndex(null);
        setDropIndex(null);
      },
      onDragLeave: () => {
        setDropIndex((current) => (current === index ? null : current));
      },
      onDragOver: (event: DragEvent) => {
        if (dragIndex === null || dragIndex === index || disabled.has(index)) {
          return;
        }
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setDropIndex(index);
      },
      onDragStart: (event: DragEvent) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", String(index));
        setDragIndex(index);
      },
      onDrop: (event: DragEvent) => {
        event.preventDefault();
        if (dragIndex !== null) {
          move(dragIndex, index);
          setFocusIndex(index);
        }
        setDragIndex(null);
        setDropIndex(null);
      },
    };
  };

  return (
    <>
      {/* biome-ignore lint/a11y/useSemanticElements: slots are laid out as a CSS grid, not a table of data. */}
      <div
        className={cn(
          "border-craft-outline bg-craft-outline inline-grid w-max max-w-full gap-(--craft-unit) overflow-x-auto border-(length:--craft-unit)",
          className
        )}
        data-slot="inventory-grid"
        role="grid"
        style={style}
        {...props}
      >
        {Array.from({ length: rowCount }, (_, row) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: rows have no identity of their own.
          // biome-ignore lint/a11y/useSemanticElements: see the grid above.
          // biome-ignore lint/a11y/useFocusableInteractive: in a grid, the cells take focus, not the rows.
          <div className="flex gap-(--craft-unit)" key={row} role="row">
            {Array.from({ length: columns }, (__, column) => {
              const index = row * columns + column;
              const item = items[index] ?? null;
              const isDisabled = disabled.has(index);
              const slot = (
                <ItemSlot
                  aria-disabled={isDisabled || undefined}
                  aria-selected={index === selectedIndex}
                  data-drop-target={dropIndex === index ? "" : undefined}
                  disabled={isDisabled}
                  item={item}
                  // Slots keep their place, and their contents change.
                  key={index}
                  label={
                    item
                      ? (getItemLabel?.(item, index) ?? itemLabel(item))
                      : emptyLabel
                  }
                  onClick={() => {
                    setFocusIndex(index);
                    select(index);
                  }}
                  onFocus={() => setFocusIndex(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  ref={(element: HTMLDivElement | null) => {
                    slots.current[index] = element;
                  }}
                  role="gridcell"
                  selected={index === selectedIndex}
                  size={size}
                  tabIndex={index === tabStop ? 0 : -1}
                  {...dragProps(index, item)}
                />
              );
              // Every slot is a trigger, even when empty, so that a slot isn't
              // remounted, and doesn't lose focus, when an item moves into it.
              return tooltips ? (
                <TooltipTrigger
                  disabled={!item}
                  handle={tooltip}
                  key={index}
                  payload={item ?? undefined}
                  render={slot}
                />
              ) : (
                slot
              );
            })}
          </div>
        ))}
      </div>
      {/* Outside the grid, which may only hold rows. */}
      {tooltips ? (
        <Tooltip handle={tooltip}>
          {({ payload }) => (
            <TooltipContent align="center">
              {payload ? <ItemInfo item={payload as Item} /> : null}
            </TooltipContent>
          )}
        </Tooltip>
      ) : null}
      <span aria-live="polite" className="sr-only" role="status">
        {announcement}
      </span>
    </>
  );
}
