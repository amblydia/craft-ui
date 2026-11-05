import { ScrollArea } from "@/components/craft/scroll-area";

const slots = Array.from({ length: 30 }, (_, index) => `Slot ${index + 1}`);

export function ScrollAreaHorizontal() {
  return (
    <ScrollArea
      className="w-full max-w-md"
      label="Inventory slots"
      orientation="horizontal"
    >
      <ul className="font-craft-display flex w-max gap-2 p-3 text-(length:--craft-label-size)">
        {slots.map((slot) => (
          <li
            className="border-craft-outline flex size-20 items-center justify-center border-2"
            key={slot}
          >
            {slot}
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
