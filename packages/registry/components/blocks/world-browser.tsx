"use client";

import { type ComponentProps, type ReactNode, useState } from "react";
import { Badge } from "@/components/craft/badge";
import { Button } from "@/components/craft/button";
import { Input } from "@/components/craft/input";
import {
  Screen,
  ScreenBody,
  ScreenHeader,
  ScreenSection,
} from "@/components/craft/screen";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/craft/select";
import { WorldCard, WorldList } from "@/components/craft/world-list";
import { cn } from "@/lib/utils";

export interface World {
  /** Marks the world as using experimental features, with a yellow tag. */
  experimental?: boolean;
  id: string;
  /** When it was last played. Worlds never played sort last. */
  lastPlayed?: Date;
  /** The game mode, shown as a tag, such as "Survival". */
  mode?: string;
  name: string;
  /** The world's picture, usually an `<img>` with an empty `alt`. */
  thumbnail?: ReactNode;
}

type Sort = "recent" | "name";

const sorts: { label: string; value: Sort }[] = [
  { label: "Last played", value: "recent" },
  { label: "Name", value: "name" },
];

const relative = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

/** "Last played yesterday", "Last played 3 days ago" or "Never played". */
export function lastPlayedLabel(date?: Date, now = new Date()) {
  if (!date) {
    return "Never played";
  }
  const days = Math.round((date.getTime() - now.getTime()) / 86_400_000);
  return `Last played ${relative.format(days, "day")}`;
}

export interface WorldBrowserProps
  extends Omit<ComponentProps<"div">, "children" | "onPlay" | "title"> {
  /** Fills the screen behind the content. */
  background?: ReactNode;
  /** Called by the back arrow. Without it, there is no back arrow. */
  onBack?: () => void;
  /** Called by Create new world. Without it, there is no create button. */
  onCreate?: () => void;
  /** Called once a delete is confirmed. Without it, worlds can't be deleted. */
  onDelete?: (world: World) => void;
  /** Called by Edit. Without it, there is no edit button. */
  onEdit?: (world: World) => void;
  /** Called when a world is pressed, to open it. */
  onPlay: (world: World) => void;
  /** The screen's name, in the bar along the top. */
  title?: string;
  /** The player's worlds. */
  worlds: World[];
}

/**
 * Ore UI's world screen: the player's worlds as cards, with search, sorting
 * and Create new world. Delete asks for confirmation first.
 */
export function WorldBrowser({
  background,
  className,
  onBack,
  onCreate,
  onDelete,
  onEdit,
  onPlay,
  title = "Worlds",
  worlds,
  ...props
}: WorldBrowserProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("recent");

  const shown = worlds
    .filter((world) =>
      world.name.toLowerCase().includes(query.trim().toLowerCase())
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : (b.lastPlayed?.getTime() ?? 0) - (a.lastPlayed?.getTime() ?? 0)
    );

  return (
    <Screen
      background={background}
      className={cn("min-h-[40rem]", className)}
      data-slot="world-browser"
      {...props}
    >
      <ScreenHeader onBack={onBack} title={title} />
      <ScreenBody>
        <div className="flex flex-wrap items-center gap-3">
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
            onValueChange={(value) => setSort(value as Sort)}
            value={sort}
          >
            <SelectTrigger
              aria-label="Sort by"
              className="w-56"
              variant="sunken"
            >
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
          {onCreate ? (
            <Button onClick={onCreate}>Create new world</Button>
          ) : null}
        </div>
        <ScreenSection title={`All worlds (${shown.length})`}>
          {shown.length > 0 ? (
            <WorldList aria-label="Worlds">
              {shown.map((world) => (
                <WorldCard
                  key={world.id}
                  meta={lastPlayedLabel(world.lastPlayed)}
                  name={world.name}
                  onDelete={onDelete ? () => onDelete(world) : undefined}
                  onEdit={onEdit ? () => onEdit(world) : undefined}
                  onPlay={() => onPlay(world)}
                  tags={
                    world.mode || world.experimental ? (
                      <>
                        {world.mode ? <Badge>{world.mode}</Badge> : null}
                        {world.experimental ? (
                          <Badge variant="warning">Experimental</Badge>
                        ) : null}
                      </>
                    ) : undefined
                  }
                  thumbnail={world.thumbnail}
                />
              ))}
            </WorldList>
          ) : (
            <p className="bg-craft-overlay font-craft-body p-(--craft-space) text-sm">
              {query ? `No worlds match "${query}".` : "No worlds yet."}
            </p>
          )}
        </ScreenSection>
      </ScreenBody>
    </Screen>
  );
}
