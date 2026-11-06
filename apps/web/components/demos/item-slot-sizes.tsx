import { ItemSlot } from "@/components/craft/item-slot";
import { items } from "@/components/demos/game-art";

export function ItemSlotSizes() {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <ItemSlot item={items.torch} size="sm" />
      <ItemSlot item={items.torch} size="md" />
      <ItemSlot item={items.torch} size="lg" />
    </div>
  );
}
