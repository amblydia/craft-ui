import { Hotbar } from "@/components/craft/hotbar";
import { items } from "@/components/demos/game-art";

export function HotbarDemo() {
  return (
    <Hotbar
      aria-label="Hotbar"
      items={[
        items.sword,
        items.pickaxe,
        items.torch,
        items.bread,
        null,
        items.planks,
        null,
        items.potion,
        items.gem,
      ]}
      showName
    />
  );
}
