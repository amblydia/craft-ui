"use client";

import {
  type ComponentProps,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  type Item,
  ItemSlot,
  type ItemSlotSize,
  itemLabel,
} from "@/components/craft/item-slot";
import { cn } from "@/lib/utils";

/** Whether a key press belongs to a text field, and shouldn't pick a slot. */
function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return (
    target.isContentEditable ||
    target.matches("input, textarea, select, [role=combobox]")
  );
}

const DIGIT = /^[0-9]$/u;

/** The slot a number key picks: 1 to 9, then 0 for the tenth. */
function slotForKey(key: string, slotCount: number) {
  if (!DIGIT.test(key)) {
    return null;
  }
  const index = key === "0" ? 9 : Number(key) - 1;
  return index < slotCount ? index : null;
}

export interface HotbarProps
  extends Omit<ComponentProps<"div">, "children" | "defaultValue"> {
  /** The slot selected to start with, when you don't control `value`. */
  defaultValue?: number;
  /** What a screen reader hears for an empty slot. */
  emptyLabel?: string;
  /**
   * What a screen reader hears for each slot. Defaults to the item's name,
   * count and durability.
   */
  getItemLabel?: (item: Item, index: number) => string;
  /**
   * Lets the number keys pick a slot from anywhere on the page, as in a game,
   * except while typing in a field. Without it, they work while the hotbar
   * has focus.
   */
  hotkeys?: boolean;
  /** The contents of each slot, by index. `null` is an empty slot. */
  items: readonly (Item | null | undefined)[];
  /** Called with the new slot's index when the selection changes. */
  onValueChange?: (index: number) => void;
  /** Shows the selected item's name above the bar. */
  showName?: boolean;
  /** The size of every slot. */
  size?: ItemSlotSize;
  /** How many slots. Defaults to the number of items, or 9. */
  slots?: number;
  /** The selected slot's index. */
  value?: number;
}

/**
 * A row of slots with one always selected, like the bar along the bottom of
 * a game. The arrow keys and the number keys change the selection.
 */
export function Hotbar({
  className,
  defaultValue = 0,
  emptyLabel = "Empty slot",
  getItemLabel,
  hotkeys = false,
  items,
  onValueChange,
  showName = false,
  size = "md",
  slots,
  value: valueProp,
  ...props
}: HotbarProps) {
  const slotCount = slots ?? (items.length || 9);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = Math.min(valueProp ?? uncontrolledValue, slotCount - 1);
  const elements = useRef<(HTMLElement | null)[]>([]);
  const selected = items[value] ?? null;

  const change = (index: number, focus: boolean) => {
    if (focus) {
      elements.current[index]?.focus();
    }
    if (index === value) {
      return;
    }
    setUncontrolledValue(index);
    onValueChange?.(index);
  };

  // The latest change, for the page-wide listener.
  const changeRef = useRef(change);
  changeRef.current = change;

  useEffect(() => {
    if (!hotkeys) {
      return;
    }
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isTyping(event.target)
      ) {
        return;
      }
      const index = slotForKey(event.key, slotCount);
      if (index !== null) {
        changeRef.current(index, false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hotkeys, slotCount]);

  const onKeyDown = (event: KeyboardEvent) => {
    const last = slotCount - 1;
    const next = {
      ArrowLeft: value === 0 ? last : value - 1,
      ArrowRight: value === last ? 0 : value + 1,
      End: last,
      Home: 0,
    }[event.key];
    if (next !== undefined) {
      event.preventDefault();
      change(next, true);
      return;
    }
    // With hotkeys on, the page-wide listener handles the number keys.
    const index = hotkeys ? null : slotForKey(event.key, slotCount);
    if (index !== null) {
      event.preventDefault();
      change(index, true);
    }
  };

  return (
    <div
      className={cn(
        "inline-flex max-w-full flex-col items-center gap-2",
        className
      )}
      data-slot="hotbar"
    >
      {showName ? (
        // Shown for sighted players. Screen readers hear the selected slot.
        <p
          aria-hidden="true"
          className="font-craft-display text-craft-text min-h-[1lh] leading-tight text-(length:--craft-label-size) [text-shadow:var(--craft-unit)_var(--craft-unit)_0_var(--craft-slot-count-shadow)]"
          data-slot="hotbar-name"
        >
          {selected?.name}
        </p>
      ) : null}
      <div
        aria-orientation="horizontal"
        className="border-craft-outline bg-craft-outline flex max-w-full gap-(--craft-unit) overflow-x-auto border-(length:--craft-unit)"
        data-slot="hotbar-slots"
        role="listbox"
        {...props}
      >
        {Array.from({ length: slotCount }, (_, index) => {
          const item = items[index] ?? null;
          return (
            <ItemSlot
              aria-selected={index === value}
              item={item}
              // biome-ignore lint/suspicious/noArrayIndexKey: a slot is its position.
              key={index}
              label={
                item
                  ? (getItemLabel?.(item, index) ?? itemLabel(item))
                  : emptyLabel
              }
              onClick={() => change(index, false)}
              onKeyDown={onKeyDown}
              ref={(element: HTMLDivElement | null) => {
                elements.current[index] = element;
              }}
              role="option"
              selected={index === value}
              size={size}
              tabIndex={index === value ? 0 : -1}
            />
          );
        })}
      </div>
    </div>
  );
}
