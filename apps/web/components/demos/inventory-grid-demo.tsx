"use client";

import { useState } from "react";
import { InventoryGrid } from "@/components/craft/inventory-grid";
import type { Item } from "@/components/craft/item-slot";
import { items } from "@/components/demos/game-art";

const start: (Item | null)[] = [
  items.sword,
  items.pickaxe,
  null,
  items.bread,
  null,
  null,
  items.torch,
  null,
  items.apple,
  items.planks,
  items.stone,
  null,
  null,
  items.gem,
  null,
  null,
  null,
  items.potion,
];

export function InventoryGridDemo() {
  const [slots, setSlots] = useState(start);
  const [selected, setSelected] = useState<number | null>(null);

  // Swap the two slots. An app could merge stacks of the same item here.
  function move(from: number, to: number) {
    setSlots((current) => {
      const next = [...current];
      [next[from], next[to]] = [next[to] ?? null, next[from] ?? null];
      return next;
    });
    setSelected((index) => (index === from ? to : index));
  }

  const item = selected === null ? null : slots[selected];

  return (
    <div className="flex flex-col items-center gap-3">
      <InventoryGrid
        aria-label="Backpack"
        columns={9}
        items={slots}
        onMove={move}
        onSelectedIndexChange={setSelected}
        selectedIndex={selected}
      />
      <p className="font-craft-body text-craft-text-muted text-sm">
        {item ? `Selected: ${item.name}` : "Select a slot, or drag an item."}
      </p>
    </div>
  );
}
