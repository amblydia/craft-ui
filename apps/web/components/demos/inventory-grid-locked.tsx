import { InventoryGrid } from "@/components/craft/inventory-grid";
import { items } from "@/components/demos/game-art";

// Without onMove, items stay where they are. The last two slots are locked.
export function InventoryGridLocked() {
  return (
    <InventoryGrid
      aria-label="Furnace"
      columns={5}
      disabledSlots={[3, 4]}
      items={[items.stone, items.planks, null]}
      rows={1}
      size="lg"
    />
  );
}
