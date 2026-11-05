import { ScrollArea } from "@/components/craft/scroll-area";

const worlds = Array.from({ length: 24 }, (_, index) => `World ${index + 1}`);

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-64 w-full max-w-sm" label="Saved worlds">
      <ul className="font-craft-display flex flex-col gap-2 p-3 text-(length:--craft-label-size)">
        {worlds.map((world) => (
          <li key={world}>{world}</li>
        ))}
      </ul>
    </ScrollArea>
  );
}
