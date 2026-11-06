"use client";

import { useState } from "react";
import { Hotbar } from "@/components/craft/hotbar";
import { items } from "@/components/demos/game-art";

const bar = [items.sword, items.pickaxe, items.torch, items.bread, items.apple];

export function HotbarHotkeys() {
  const [slot, setSlot] = useState(0);
  return (
    <div className="flex flex-col items-center gap-3">
      <Hotbar
        aria-label="Hotbar"
        hotkeys
        items={bar}
        onValueChange={setSlot}
        size="sm"
        value={slot}
      />
      <p className="font-craft-body text-craft-text-muted text-sm">
        Press 1 to 5 anywhere on this page. Holding: {bar[slot]?.name}
      </p>
    </div>
  );
}
