"use client";

import { useState } from "react";
import {
  ServerList,
  ServerListItem,
  ServerListLabel,
  type ServerStatus,
} from "@/components/craft/server-list";
import { type ArtName, GameArt } from "@/components/demos/game-art";

interface Server {
  art: ArtName;
  description: string;
  id: string;
  name: string;
  ping: number;
  players: { max: number; online: number };
  status: ServerStatus;
}

const servers: Server[] = [
  {
    art: "gem",
    description: "Minigames with friends, parties and more.",
    id: "gemfall",
    name: "Gemfall",
    ping: 38,
    players: { max: 20_000, online: 12_737 },
    status: "online",
  },
  {
    art: "planks",
    description: "Build anything on a shared island.",
    id: "builders-bay",
    name: "Builders Bay",
    ping: 210,
    players: { max: 500, online: 214 },
    status: "online",
  },
  {
    art: "torch",
    description: "Survive the night together.",
    id: "lantern",
    name: "Lantern Isles",
    ping: 120,
    players: { max: 300, online: 96 },
    status: "connecting",
  },
  {
    art: "stone",
    description: "Back soon after maintenance.",
    id: "quarry",
    name: "The Quarry",
    ping: 0,
    players: { max: 100, online: 0 },
    status: "offline",
  },
];

export function ServerListDemo() {
  const [favorites, setFavorites] = useState(["gemfall"]);
  const [joined, setJoined] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-3xl flex-col gap-3">
      <ServerList aria-label="Servers">
        <ServerListLabel>Featured ({servers.length})</ServerListLabel>
        {servers.map((server) => (
          <ServerListItem
            description={server.description}
            favorite={favorites.includes(server.id)}
            icon={<GameArt name={server.art} />}
            key={server.id}
            name={server.name}
            onFavoriteChange={(favorite) =>
              setFavorites((current) =>
                favorite
                  ? [...current, server.id]
                  : current.filter((id) => id !== server.id)
              )
            }
            onJoin={() => setJoined(server.name)}
            ping={server.ping}
            players={server.players}
            status={server.status}
          />
        ))}
      </ServerList>
      <p
        aria-live="polite"
        className="font-craft-body text-craft-text-muted text-sm"
      >
        {joined ? `Joining ${joined}…` : "Pick a server to join."}
      </p>
    </div>
  );
}
