"use client";

import { useState } from "react";
import {
  type LobbyMessage,
  type LobbyPlayer,
  MultiplayerLobby,
} from "@/components/craft/blocks/multiplayer-lobby";
import { Scene } from "@/components/demos/game-art";

const startPlayers: LobbyPlayer[] = [
  { host: true, id: "me", name: "Skylark", ready: false },
  { id: "pebble", name: "Pebble", ready: true },
  { id: "moss", name: "Moss", ready: true },
];

export function MultiplayerLobbyDemo() {
  const [players, setPlayers] = useState(startPlayers);
  const [messages, setMessages] = useState<LobbyMessage[]>([
    { author: "Pebble", id: "1", text: "Ready when you are!" },
    { author: "Moss", id: "2", text: "Bring torches this time." },
  ]);
  const [status, setStatus] = useState("");

  return (
    <>
      <MultiplayerLobby
        background={<Scene name="night" />}
        currentPlayerId="me"
        details="Survival · Hard · Riverside"
        maxPlayers={8}
        messages={messages}
        name="Night raid"
        onInvite={() => setStatus("Inviting friends")}
        onLeave={() => setStatus("Left the lobby")}
        onReadyChange={(ready) =>
          setPlayers((current) =>
            current.map((player) =>
              player.id === "me" ? { ...player, ready } : player
            )
          )
        }
        onSendMessage={(text) =>
          setMessages((current) => [
            ...current,
            { author: "Skylark", id: String(current.length + 1), text },
          ])
        }
        onStart={() => setStatus("Starting the game")}
        players={players}
      />
      <output className="sr-only">{status}</output>
    </>
  );
}
