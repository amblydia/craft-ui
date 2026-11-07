"use client";

import { type ComponentProps, type ReactNode, useState } from "react";
import { Button } from "@/components/craft/button";
import { Input } from "@/components/craft/input";
import {
  Screen,
  ScreenBody,
  ScreenHeader,
  ScreenSection,
} from "@/components/craft/screen";
import {
  ServerList,
  ServerListItem,
  ServerPing,
  ServerPlayers,
  type ServerStatus,
} from "@/components/craft/server-list";
import { Switch } from "@/components/craft/switch";
import { cn } from "@/lib/utils";

export interface Server {
  /** A wide picture for the details panel. It's decorative. */
  banner?: ReactNode;
  description?: string;
  favorite?: boolean;
  /** A small square picture for the list. It's decorative. */
  icon?: ReactNode;
  id: string;
  name: string;
  /** The round trip, in milliseconds. */
  ping?: number | null;
  players?: { max?: number; online: number };
  status?: ServerStatus;
}

export interface ServerBrowserProps
  extends Omit<ComponentProps<"div">, "children" | "title"> {
  /** Fills the screen behind the content. */
  background?: ReactNode;
  /** Text for the empty list, when nothing matches the search. */
  emptyMessage?: string;
  /** Called by Add server. Without it, there is no Add server button. */
  onAddServer?: () => void;
  /** Called by the back arrow. Without it, there is no back arrow. */
  onBack?: () => void;
  /** Called with the server and its new value when a star is pressed. */
  onFavoriteChange?: (server: Server, favorite: boolean) => void;
  /** Called with the server when Join or Play is pressed. */
  onJoin: (server: Server) => void;
  /** The servers, as your backend reports them. */
  servers: Server[];
  /** The screen's name, in the bar along the top. */
  title?: string;
}

/**
 * Ore UI's server screen: a list of servers you can search and filter by
 * favorites, and the chosen server's details beside it with a big Play
 * button. On a narrow screen, the details sit under the list.
 */
export function ServerBrowser({
  background,
  className,
  emptyMessage = "No servers match your search.",
  onAddServer,
  onBack,
  onFavoriteChange,
  onJoin,
  servers,
  title = "Servers",
  ...props
}: ServerBrowserProps) {
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedId, setSelectedId] = useState(servers[0]?.id);

  const shown = servers.filter(
    (server) =>
      server.name.toLowerCase().includes(query.trim().toLowerCase()) &&
      (!favoritesOnly || server.favorite)
  );
  const selected =
    servers.find((server) => server.id === selectedId) ?? shown[0];

  return (
    <Screen
      background={background}
      className={cn("min-h-[40rem]", className)}
      data-slot="server-browser"
      {...props}
    >
      <ScreenHeader onBack={onBack} title={title} />
      <ScreenBody>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            aria-label="Search servers"
            className="min-w-48 flex-1"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search servers"
            type="search"
            value={query}
          />
          <Switch
            checked={favoritesOnly}
            className="bg-craft-overlay px-3 py-2"
            label="Favorites only"
            onCheckedChange={setFavoritesOnly}
          />
          {onAddServer ? (
            <Button onClick={onAddServer} variant="secondary">
              Add server
            </Button>
          ) : null}
        </div>
        <div className="grid items-start gap-6 @4xl/screen:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <ScreenSection title={`Servers (${shown.length})`}>
            {shown.length > 0 ? (
              <ServerList aria-label="Servers">
                {shown.map((server) => (
                  <ServerListItem
                    description={server.description}
                    favorite={server.favorite}
                    icon={server.icon}
                    key={server.id}
                    name={server.name}
                    onFavoriteChange={
                      onFavoriteChange
                        ? (favorite) => onFavoriteChange(server, favorite)
                        : undefined
                    }
                    onSelect={() => setSelectedId(server.id)}
                    ping={server.ping}
                    players={server.players}
                    selected={server.id === selected?.id}
                    status={server.status}
                  />
                ))}
              </ServerList>
            ) : (
              <p className="bg-craft-overlay font-craft-body p-(--craft-space) text-sm">
                {emptyMessage}
              </p>
            )}
          </ScreenSection>
          {selected ? (
            <ServerDetails onJoin={() => onJoin(selected)} server={selected} />
          ) : null}
        </div>
      </ScreenBody>
    </Screen>
  );
}

function ServerDetails({
  onJoin,
  server,
}: {
  onJoin: () => void;
  server: Server;
}) {
  const status = server.status ?? "online";
  return (
    <section
      aria-label={`${server.name} details`}
      className="border-craft-outline bg-craft-surface flex flex-col border-(length:--craft-unit)"
      data-slot="server-browser-details"
    >
      <div className="bg-craft-sunken flex flex-wrap items-center gap-x-6 gap-y-3 p-(--craft-space)">
        <ServerPing ping={server.ping} status={status} />
        {server.players ? <ServerPlayers {...server.players} /> : null}
        <Button
          aria-label={`Play ${server.name}`}
          className="ml-auto min-w-40"
          disabled={status !== "online"}
          onClick={onJoin}
          variant="hero"
        >
          Play
        </Button>
      </div>
      <div
        aria-hidden="true"
        className="bg-craft-sunken aspect-video overflow-hidden [&>img]:size-full [&>img]:object-cover [&>img]:[image-rendering:pixelated] [&>svg]:size-full"
        data-slot="server-browser-banner"
      >
        {server.banner ?? server.icon}
      </div>
      <div className="flex flex-col gap-1 p-(--craft-space)">
        <h2 className="font-craft-display leading-tight text-(length:--craft-label-size)">
          {server.name}
        </h2>
        {server.description ? (
          <p className="font-craft-body text-craft-text-muted text-sm">
            {server.description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
