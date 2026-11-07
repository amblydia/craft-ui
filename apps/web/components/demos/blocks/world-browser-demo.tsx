"use client";

import { useState } from "react";
import {
  type World,
  WorldBrowser,
} from "@/components/craft/blocks/world-browser";
import { Scene } from "@/components/demos/game-art";

const day = 86_400_000;
const now = Date.now();

const start: World[] = [
  {
    id: "1",
    lastPlayed: new Date(now - day),
    mode: "Survival",
    name: "Riverside",
    thumbnail: <Scene name="meadow" />,
  },
  {
    id: "2",
    lastPlayed: new Date(now - 6 * day),
    mode: "Creative",
    name: "Sand Castles",
    thumbnail: <Scene name="desert" />,
  },
  {
    experimental: true,
    id: "3",
    lastPlayed: new Date(now - 3 * day),
    mode: "Creative",
    name: "Frost Peaks",
    thumbnail: <Scene name="snow" />,
  },
  {
    id: "4",
    lastPlayed: new Date(now - 12 * day),
    mode: "Survival",
    name: "Night Shift",
    thumbnail: <Scene name="night" />,
  },
];

export function WorldBrowserDemo() {
  const [worlds, setWorlds] = useState(start);
  const [status, setStatus] = useState("");

  return (
    <>
      <WorldBrowser
        background={<Scene name="meadow" />}
        onBack={() => setStatus("Going back")}
        onCreate={() =>
          setWorlds((current) => [
            ...current,
            {
              id: String(current.length + 1),
              mode: "Survival",
              name: `New World ${current.length + 1}`,
              thumbnail: <Scene name="meadow" />,
            },
          ])
        }
        onDelete={(world) =>
          setWorlds((current) => current.filter((item) => item.id !== world.id))
        }
        onEdit={(world) => setStatus(`Editing ${world.name}`)}
        onPlay={(world) => setStatus(`Playing ${world.name}`)}
        title="Play"
        worlds={worlds}
      />
      <output className="sr-only">{status}</output>
    </>
  );
}
