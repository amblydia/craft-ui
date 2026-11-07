"use client";

import { useState } from "react";
import {
  type Server,
  ServerBrowser,
} from "@/components/craft/blocks/server-browser";
import { GameArt, Scene } from "@/components/demos/game-art";

const start: Server[] = [
  {
    banner: <Scene name="night" />,
    description: "Minigames with friends, parties and more.",
    favorite: true,
    icon: <GameArt name="gem" />,
    id: "gemfall",
    name: "Gemfall",
    ping: 38,
    players: { max: 20_000, online: 12_737 },
    status: "online",
  },
  {
    banner: <Scene name="desert" />,
    description: "Build anything on a shared island.",
    icon: <GameArt name="planks" />,
    id: "builders-bay",
    name: "Builders Bay",
    ping: 210,
    players: { max: 500, online: 214 },
    status: "online",
  },
  {
    banner: <Scene name="snow" />,
    description: "Survive the night together.",
    icon: <GameArt name="torch" />,
    id: "lantern",
    name: "Lantern Isles",
    ping: 120,
    players: { max: 300, online: 96 },
    status: "connecting",
  },
  {
    description: "Back soon after maintenance.",
    icon: <GameArt name="stone" />,
    id: "quarry",
    name: "The Quarry",
    status: "offline",
  },
];

export function ServerBrowserDemo() {
  const [servers, setServers] = useState(start);
  const [joining, setJoining] = useState<string | null>(null);

  return (
    <>
      <ServerBrowser
        background={<Scene name="night" />}
        onAddServer={() => setJoining("Adding a server")}
        onBack={() => setJoining("Going back")}
        onFavoriteChange={(server, favorite) =>
          setServers((current) =>
            current.map((item) =>
              item.id === server.id ? { ...item, favorite } : item
            )
          )
        }
        onJoin={(server) => setJoining(`Joining ${server.name}…`)}
        servers={servers}
        title="Play"
      />
      <output className="sr-only">{joining}</output>
    </>
  );
}
