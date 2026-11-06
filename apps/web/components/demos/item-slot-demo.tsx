import { ItemSlot, ItemTooltip } from "@/components/craft/item-slot";
import { items } from "@/components/demos/game-art";

export function ItemSlotDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ItemSlot />
      <ItemSlot item={items.planks} />
      <ItemSlot item={items.pickaxe} />
      <ItemSlot item={items.bread} selected />
      <ItemSlot disabled item={items.potion} />
      <ItemTooltip item={items.sword}>
        <ItemSlot item={items.sword} render={<button type="button" />} />
      </ItemTooltip>
    </div>
  );
}
