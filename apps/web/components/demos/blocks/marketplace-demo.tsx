"use client";

import { useState } from "react";
import {
  Marketplace,
  type Product,
} from "@/components/craft/blocks/marketplace";
import { Scene, type SceneName } from "@/components/demos/game-art";

const scenes: SceneName[] = ["meadow", "desert", "snow", "night"];
const kinds = [
  { label: "Worlds", value: "worlds" },
  { label: "Skin packs", value: "skins" },
  { label: "Texture packs", value: "textures" },
];
const names = [
  "Sky Islands",
  "Desert Ruins",
  "Frozen Keep",
  "Moonlit Farm",
  "Pixel Heroes",
  "Cozy Cottage",
  "Copper Age",
  "Deep Caverns",
  "Lantern Town",
  "Coral Reef",
  "Pastel Pack",
  "Night Market",
];

const products: Product[] = names.map((title, index) => ({
  category: kinds[index % kinds.length]?.value,
  creator: ["Gemfall Studios", "Brickwork", "Moss & Co"][index % 3] ?? "",
  id: String(index),
  owned: index === 4,
  price: [490, 990, 1340, 1510, 1690][index % 5] ?? 0,
  rating: 3.8 + ((index * 7) % 12) / 10,
  thumbnail: <Scene name={scenes[index % scenes.length] ?? "meadow"} />,
  title,
}));

export function MarketplaceDemo() {
  const [opened, setOpened] = useState("");

  return (
    <>
      <Marketplace
        background={<Scene name="meadow" />}
        categories={kinds}
        onBack={() => setOpened("Going back")}
        onSelect={(product) => setOpened(`Opened ${product.title}`)}
        products={products}
      />
      <output className="sr-only">{opened}</output>
    </>
  );
}
