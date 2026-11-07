"use client";

import { useState } from "react";
import { InventoryScreen } from "@/components/craft/blocks/inventory-screen";
import { Explorer, items, Scene } from "@/components/demos/game-art";

export function InventoryScreenDemo() {
  const [status, setStatus] = useState("");

  return (
    <>
      <InventoryScreen
        background={<Scene name="night" />}
        character={<Explorer />}
        defaultContents={{
          hotbar: [items.sword, items.pickaxe, items.torch, items.bread],
          inventory: [
            items.planks,
            null,
            items.stone,
            null,
            items.gem,
            null,
            null,
            items.apple,
            null,
            null,
            items.potion,
          ],
        }}
        onBack={() => setStatus("Going back")}
        onDrop={(item) => setStatus(`Dropped ${item.name}`)}
        onUse={(item) => setStatus(`Used ${item.name}`)}
      />
      <output className="sr-only">{status}</output>
    </>
  );
}
