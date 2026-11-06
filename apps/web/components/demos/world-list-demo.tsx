"use client";

import { useState } from "react";
import { Badge } from "@/components/craft/badge";
import { Button } from "@/components/craft/button";
import { Input } from "@/components/craft/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/craft/select";
import { WorldCard, WorldList } from "@/components/craft/world-list";
import { Scene, type SceneName } from "@/components/demos/game-art";

interface World {
  experimental?: boolean;
  id: string;
  mode: "Survival" | "Creative";
  name: string;
  played: number; // days ago
  scene: SceneName;
}

const start: World[] = [
  { id: "1", mode: "Survival", name: "Riverside", played: 1, scene: "meadow" },
  {
    id: "2",
    mode: "Creative",
    name: "Sand Castles",
    played: 6,
    scene: "desert",
  },
  {
    experimental: true,
    id: "3",
    mode: "Creative",
    name: "Frost Peaks",
    played: 3,
    scene: "snow",
  },
  {
    id: "4",
    mode: "Survival",
    name: "Night Shift",
    played: 12,
    scene: "night",
  },
];

const sorts = [
  { label: "Last played", value: "played" },
  { label: "Name", value: "name" },
];

export function WorldListDemo() {
  const [worlds, setWorlds] = useState(start);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("played");
  const [opened, setOpened] = useState<string | null>(null);

  const shown = worlds
    .filter((world) => world.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name) : a.played - b.played
    );

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <Input
          aria-label="Search worlds"
          className="min-w-48 flex-1"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search worlds"
          type="search"
          value={query}
        />
        <Select
          items={sorts}
          onValueChange={(value) => setSort(String(value))}
          value={sort}
        >
          <SelectTrigger aria-label="Sort by" className="w-56" variant="sunken">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sorts.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() =>
            setWorlds((current) => [
              {
                id: String(Date.now()),
                mode: "Survival",
                name: `New World ${current.length + 1}`,
                played: 0,
                scene: "meadow",
              },
              ...current,
            ])
          }
        >
          Create new world
        </Button>
      </div>
      {shown.length > 0 ? (
        <WorldList aria-label="Worlds">
          {shown.map((world) => (
            <WorldCard
              key={world.id}
              meta={
                world.played === 0
                  ? "Never played"
                  : `Last played ${world.played} ${world.played === 1 ? "day" : "days"} ago`
              }
              name={world.name}
              onDelete={() =>
                setWorlds((current) =>
                  current.filter((item) => item.id !== world.id)
                )
              }
              onEdit={() => setOpened(`Editing ${world.name}`)}
              onPlay={() => setOpened(`Playing ${world.name}`)}
              tags={
                <>
                  <Badge>{world.mode}</Badge>
                  {world.experimental ? (
                    <Badge variant="warning">Experimental</Badge>
                  ) : null}
                </>
              }
              thumbnail={<Scene name={world.scene} />}
            />
          ))}
        </WorldList>
      ) : (
        <p className="font-craft-body text-craft-text-muted text-sm">
          No worlds match "{query}".
        </p>
      )}
      <p
        aria-live="polite"
        className="font-craft-body text-craft-text-muted text-sm"
      >
        {opened}
      </p>
    </div>
  );
}
