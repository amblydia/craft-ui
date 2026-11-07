"use client";

import { type ComponentProps, type ReactNode, useState } from "react";
import { Button } from "@/components/craft/button";
import { Hotbar } from "@/components/craft/hotbar";
import { InventoryGrid } from "@/components/craft/inventory-grid";
import { type Item, ItemSlot } from "@/components/craft/item-slot";
import { Progress } from "@/components/craft/progress";
import {
  Screen,
  ScreenBody,
  ScreenHeader,
  ScreenSection,
} from "@/components/craft/screen";
import { cn } from "@/lib/utils";

type Slots = (Item | null)[];

export interface InventoryContents {
  /** The bar of quick slots. */
  hotbar: Slots;
  /** The backpack's slots. */
  inventory: Slots;
}

/** Fills or trims a list of slots to a length. */
function fill(slots: readonly (Item | null | undefined)[], length: number) {
  return Array.from({ length }, (_, index) => slots[index] ?? null);
}

export interface InventoryScreenProps
  extends Omit<ComponentProps<"div">, "children" | "onDrop" | "title"> {
  /** Fills the screen behind the content. */
  background?: ReactNode;
  /** A picture of the player's character, beside the backpack. */
  character?: ReactNode;
  /** How many slots in each backpack row. */
  columns?: number;
  /** What the slots hold to start with. The screen keeps them from then on. */
  defaultContents: InventoryContents;
  /** Called by the back arrow. Without it, there is no back arrow. */
  onBack?: () => void;
  /** Called with the new contents after every move, use or drop. */
  onContentsChange?: (contents: InventoryContents) => void;
  /** Called with an item when Drop is pressed. It's then taken out. */
  onDrop?: (item: Item) => void;
  /** Called with an item when Use is pressed. Without it, there is no Use button. */
  onUse?: (item: Item) => void;
  /** How many backpack rows. */
  rows?: number;
  /** The screen's name, in the bar along the top. */
  title?: string;
}

interface Place {
  area: "hotbar" | "inventory";
  index: number;
}

/**
 * An inventory screen: the backpack, the hotbar under it, the character, and
 * the chosen item's details with Use, Drop and a button to move it between the
 * backpack and the hotbar.
 */
export function InventoryScreen({
  background,
  character,
  className,
  columns = 9,
  defaultContents,
  onBack,
  onContentsChange,
  onDrop,
  onUse,
  rows = 3,
  title = "Inventory",
  ...props
}: InventoryScreenProps) {
  const [contents, setContents] = useState<InventoryContents>(() => ({
    hotbar: fill(defaultContents.hotbar, columns),
    inventory: fill(defaultContents.inventory, columns * rows),
  }));
  const [chosen, setChosen] = useState<Place>({ area: "hotbar", index: 0 });
  // The hotbar always has a selected slot, as in a game, even while a
  // backpack slot is the one shown in the details.
  const [hotbarIndex, setHotbarIndex] = useState(0);
  const item = contents[chosen.area][chosen.index] ?? null;

  const update = (next: InventoryContents) => {
    setContents(next);
    onContentsChange?.(next);
  };

  const swapWithin = (area: Place["area"], from: number, to: number) => {
    const slots = [...contents[area]];
    [slots[from], slots[to]] = [slots[to] ?? null, slots[from] ?? null];
    update({ ...contents, [area]: slots });
    if (chosen.area === area && chosen.index === from) {
      setChosen({ area, index: to });
    }
  };

  // Moves the chosen item to the other area: the first empty backpack slot,
  // or the hotbar's first empty slot.
  const moveAcross = () => {
    const target = chosen.area === "hotbar" ? "inventory" : "hotbar";
    const empty = contents[target].indexOf(null);
    if (!item || empty === -1) {
      return;
    }
    const from = [...contents[chosen.area]];
    const to = [...contents[target]];
    to[empty] = item;
    from[chosen.index] = null;
    update({ ...contents, [chosen.area]: from, [target]: to });
    setChosen({ area: target, index: empty });
    if (target === "hotbar") {
      setHotbarIndex(empty);
    }
  };

  const drop = () => {
    if (!item) {
      return;
    }
    const slots = [...contents[chosen.area]];
    slots[chosen.index] = null;
    update({ ...contents, [chosen.area]: slots });
    onDrop?.(item);
  };

  const otherArea = chosen.area === "hotbar" ? "backpack" : "hotbar";
  const hasRoom =
    contents[chosen.area === "hotbar" ? "inventory" : "hotbar"].includes(null);

  return (
    <Screen
      background={background}
      className={cn("min-h-[40rem]", className)}
      data-slot="inventory-screen"
      {...props}
    >
      <ScreenHeader onBack={onBack} title={title} />
      <ScreenBody className="items-center">
        <div className="grid w-full max-w-5xl items-start gap-6 @4xl/screen:grid-cols-[auto_minmax(0,1fr)]">
          <div className="flex flex-col items-center gap-6">
            {character ? (
              <div
                aria-hidden="true"
                className="border-craft-outline bg-craft-sunken flex aspect-[3/4] w-full max-w-60 items-end justify-center overflow-hidden border-(length:--craft-unit) p-(--craft-space) [&>img]:max-h-full [&>img]:[image-rendering:pixelated] [&>svg]:max-h-full"
                data-slot="inventory-screen-character"
              >
                {character}
              </div>
            ) : null}
          </div>
          <div className="flex min-w-0 flex-col gap-6">
            <ScreenSection title="Backpack">
              <InventoryGrid
                aria-label="Backpack"
                columns={columns}
                items={contents.inventory}
                onMove={(from, to) => swapWithin("inventory", from, to)}
                onSelectedIndexChange={(index) =>
                  index === null
                    ? null
                    : setChosen({ area: "inventory", index })
                }
                rows={rows}
                selectedIndex={
                  chosen.area === "inventory" ? chosen.index : null
                }
              />
            </ScreenSection>
            <ScreenSection title="Hotbar">
              <Hotbar
                aria-label="Hotbar"
                items={contents.hotbar}
                onFocus={() =>
                  setChosen({ area: "hotbar", index: hotbarIndex })
                }
                onValueChange={(index) => {
                  setHotbarIndex(index);
                  setChosen({ area: "hotbar", index });
                }}
                slots={columns}
                value={hotbarIndex}
              />
            </ScreenSection>
            <ScreenSection title="Details">
              <div
                className="bg-craft-surface flex flex-wrap items-center gap-4 p-(--craft-space)"
                data-slot="inventory-screen-details"
              >
                <ItemSlot item={item} size="lg" />
                <div className="flex min-w-48 flex-1 flex-col gap-2">
                  <p className="font-craft-display leading-tight text-(length:--craft-label-size)">
                    {item?.name ?? "Empty slot"}
                  </p>
                  {item?.description ? (
                    <p className="font-craft-body text-craft-text-muted text-sm">
                      {item.description}
                    </p>
                  ) : null}
                  {item?.durability === undefined ? null : (
                    <Progress
                      label="Durability"
                      showValue
                      size="sm"
                      tone="primary"
                      value={Math.round(item.durability * 100)}
                    />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {onUse ? (
                    <Button
                      disabled={!item}
                      onClick={() => item && onUse(item)}
                      size="sm"
                    >
                      Use
                    </Button>
                  ) : null}
                  <Button
                    disabled={!(item && hasRoom)}
                    onClick={moveAcross}
                    size="sm"
                    variant="secondary"
                  >
                    Move to {otherArea}
                  </Button>
                  <Button
                    disabled={!item}
                    onClick={drop}
                    size="sm"
                    variant="destructive"
                  >
                    Drop
                  </Button>
                </div>
              </div>
            </ScreenSection>
          </div>
        </div>
      </ScreenBody>
    </Screen>
  );
}
