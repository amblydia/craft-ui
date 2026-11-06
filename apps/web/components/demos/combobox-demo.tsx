"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@/components/craft/combobox";

const biomes = [
  "Badlands",
  "Bamboo Jungle",
  "Birch Forest",
  "Cherry Grove",
  "Dark Forest",
  "Desert",
  "Frozen Peaks",
  "Jungle",
  "Mangrove Swamp",
  "Meadow",
  "Mushroom Fields",
  "Plains",
  "Savanna",
  "Snowy Taiga",
  "Taiga",
];

export function ComboboxDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Combobox items={biomes}>
        <ComboboxLabel>Starting biome</ComboboxLabel>
        <ComboboxInput placeholder="Search biomes" showClear />
        <ComboboxContent>
          <ComboboxEmpty>No biomes match.</ComboboxEmpty>
          <ComboboxList>
            {(biome: string) => (
              <ComboboxItem key={biome} value={biome}>
                {biome}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
