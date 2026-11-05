"use client";

import { useState } from "react";
import { Button } from "@/components/craft/button";
import { Input } from "@/components/craft/input";
import { Panel } from "@/components/craft/panel";
import { Progress } from "@/components/craft/progress";
import { ScrollArea } from "@/components/craft/scroll-area";
import { Slider } from "@/components/craft/slider";
import { Switch } from "@/components/craft/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/craft/tabs";

const servers = [
  { name: "Lantern Bay", players: "42 / 100" },
  { name: "Old Quarry", players: "8 / 20" },
  { name: "Frost Hollow", players: "117 / 200" },
  { name: "Red Canyon", players: "3 / 10" },
];

/** A made-up menu built from the real components, so it all works when clicked. */
export function ServerListPreview() {
  const [joined, setJoined] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const matches = servers.filter((server) =>
    server.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Panel className="w-full" framed variant="sunken">
      <div className="p-3">
        <Tabs defaultValue="servers">
          <TabsList>
            <TabsTrigger value="servers">Servers</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent className="flex flex-col gap-3" value="servers">
            <Input
              aria-label="Search servers"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search servers"
              value={query}
            />
            <ScrollArea className="h-52" label="Servers">
              <ul className="flex flex-col gap-2 p-2">
                {matches.map((server) => (
                  <li key={server.name}>
                    <Panel className="flex-row items-center gap-3 p-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-craft-display truncate text-(length:--craft-label-size)">
                          {server.name}
                        </p>
                        <p className="text-craft-text-muted text-sm">
                          {server.players} players
                        </p>
                      </div>
                      <Button
                        onClick={() => setJoined(server.name)}
                        size="sm"
                        variant={
                          joined === server.name ? "secondary" : "primary"
                        }
                      >
                        {joined === server.name ? "Joined" : "Join"}
                      </Button>
                    </Panel>
                  </li>
                ))}
                {matches.length === 0 && (
                  <li className="p-4 text-center text-sm">No servers found.</li>
                )}
              </ul>
            </ScrollArea>
            <Progress
              label={joined ? `Connected to ${joined}` : "Not connected"}
              size="sm"
              tone="info"
              value={joined ? 100 : 0}
            />
          </TabsContent>
          <TabsContent className="flex flex-col gap-5 py-1" value="settings">
            <Slider defaultValue={70} label="Music" showValue />
            <Slider defaultValue={40} label="Sound effects" showValue />
            <Switch defaultChecked label="Show coordinates" />
            <Switch label="Friendly fire" />
          </TabsContent>
        </Tabs>
      </div>
    </Panel>
  );
}
