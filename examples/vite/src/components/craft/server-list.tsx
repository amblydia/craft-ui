"use client";

import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/craft/button";
import { Spinner } from "@/components/craft/spinner";
import { cn } from "@/lib/utils";

export type ServerStatus = "online" | "connecting" | "offline";

/** How many of the four bars a ping fills, and its color. */
function signal(ping: number) {
  if (ping <= 80) {
    return { bars: 4, color: "text-craft-signal-good", quality: "Excellent" };
  }
  if (ping <= 150) {
    return { bars: 3, color: "text-craft-signal-good", quality: "Good" };
  }
  if (ping <= 300) {
    return { bars: 2, color: "text-craft-signal-fair", quality: "Fair" };
  }
  return { bars: 1, color: "text-craft-signal-poor", quality: "Poor" };
}

const BAR_HEIGHTS = [3, 5, 7, 9];

function SignalIcon({ bars }: { bars: number }) {
  return (
    <svg
      aria-hidden="true"
      className="size-6 shrink-0"
      shapeRendering="crispEdges"
      viewBox="0 0 12 12"
    >
      {BAR_HEIGHTS.map((height, index) => (
        <rect
          className={index < bars ? "fill-current" : "fill-craft-track"}
          height={height}
          key={height}
          width="2"
          x={1 + index * 3}
          y={10 - height}
        />
      ))}
    </svg>
  );
}

function OfflineIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-6 shrink-0"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 12 12"
    >
      <path d="M1 1h2v2H1zM3 3h2v2H3zM5 5h2v2H5zM7 7h2v2H7zM9 9h2v2H9zM9 1h2v2H9zM7 3h2v2H7zM3 7h2v2H3zM1 9h2v2H1z" />
    </svg>
  );
}

function PlayersIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-6 shrink-0"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 12 12"
    >
      <path d="M4 1h4v1H4zM3 2h1v3H3zM8 2h1v3H8zM4 5h4v1H4zM2 7h8v1H2zM1 8h1v3H1zM10 8h1v3h-1z" />
    </svg>
  );
}

// A five-pointed star on a 12-unit grid, as [row, first column, last column].
const STAR: [number, number, number][] = [
  [0, 5, 6],
  [1, 5, 6],
  [2, 4, 7],
  [3, 0, 11],
  [4, 1, 10],
  [5, 2, 9],
  [6, 3, 8],
  [7, 2, 9],
  [8, 2, 4],
  [8, 7, 9],
  [9, 1, 3],
  [9, 8, 10],
  [10, 1, 2],
  [10, 9, 10],
];

const starCells = new Set(
  STAR.flatMap(([row, first, last]) =>
    Array.from({ length: last - first + 1 }, (_, i) => `${first + i},${row}`)
  )
);

const STAR_FILLED = [...starCells].map((cell) => `M${cell}h1v1h-1z`).join("");

// The empty star keeps only the cells on its edge.
const STAR_OUTLINE = [...starCells]
  .filter((cell) => {
    const [x = 0, y = 0] = cell.split(",").map(Number);
    return [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ].some(([nx, ny]) => !starCells.has(`${nx},${ny}`));
  })
  .map((cell) => `M${cell}h1v1h-1z`)
  .join("");

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="size-6 shrink-0"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 12 12"
    >
      <path d={filled ? STAR_FILLED : STAR_OUTLINE} />
    </svg>
  );
}

const numbers = new Intl.NumberFormat();

export interface ServerPingProps extends ComponentProps<"span"> {
  /** The round trip, in milliseconds. `null` while it's unknown. */
  ping?: number | null;
  /** Shows the milliseconds beside the bars. */
  showValue?: boolean;
  status?: ServerStatus;
}

/**
 * Signal bars for a server's ping: four green bars for a fast connection, down
 * to one red bar for a slow one. It says the same in words for screen readers.
 */
export function ServerPing({
  className,
  ping = null,
  showValue = true,
  status = "online",
  ...props
}: ServerPingProps) {
  let content: ReactNode;
  if (status === "connecting") {
    content = <Spinner label="Connecting" showLabel size="sm" />;
  } else if (status === "offline") {
    content = (
      <>
        <OfflineIcon />
        <span>Offline</span>
      </>
    );
  } else if (ping === null) {
    content = (
      <>
        <SignalIcon bars={0} />
        <span className="sr-only">Ping unknown</span>
      </>
    );
  } else {
    const { bars, color, quality } = signal(ping);
    content = (
      <>
        <span className={color}>
          <SignalIcon bars={bars} />
        </span>
        <span className={showValue ? "tabular-nums" : "sr-only"}>
          <span className="sr-only">{quality} ping, </span>
          {numbers.format(ping)} ms
        </span>
      </>
    );
  }

  return (
    <span
      className={cn(
        "font-craft-display inline-flex items-center gap-2 leading-none whitespace-nowrap text-(length:--craft-label-size) [&_[data-slot=spinner]]:text-(length:--craft-label-size)",
        status === "offline" && "text-craft-destructive-text",
        className
      )}
      data-slot="server-ping"
      data-status={status}
      {...props}
    >
      {content}
    </span>
  );
}

export interface ServerPlayersProps extends ComponentProps<"span"> {
  /** The most players it allows. */
  max?: number;
  /** How many players are on it. */
  online: number;
}

/** A server's player count, such as "1,204 / 5,000". */
export function ServerPlayers({
  className,
  max,
  online,
  ...props
}: ServerPlayersProps) {
  return (
    <span
      className={cn(
        "font-craft-display inline-flex items-center gap-2 leading-none whitespace-nowrap text-(length:--craft-label-size) tabular-nums",
        className
      )}
      data-slot="server-players"
      {...props}
    >
      <PlayersIcon />
      <span aria-hidden="true">
        {numbers.format(online)}
        {max === undefined ? null : ` / ${numbers.format(max)}`}
      </span>
      <span className="sr-only">
        {max === undefined
          ? `${numbers.format(online)} players`
          : `${numbers.format(online)} of ${numbers.format(max)} players`}
      </span>
    </span>
  );
}

/** The list of servers. Put `ServerListItem`s in it, and `ServerListLabel`s between groups. */
export function ServerList({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "border-craft-outline bg-craft-outline flex flex-col gap-(--craft-unit) border-(length:--craft-unit)",
        className
      )}
      data-slot="server-list"
      {...props}
    />
  );
}

/** A heading between groups of servers, such as "Featured (6)". */
export function ServerListLabel({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "bg-craft-sunken font-craft-body text-craft-text-muted px-(--craft-space) pt-3 pb-2 text-sm",
        className
      )}
      data-slot="server-list-label"
      {...props}
    />
  );
}

export interface ServerListItemProps
  extends Omit<ComponentProps<"li">, "children"> {
  /** A line under the name, such as the server's message of the day. */
  description?: ReactNode;
  /** Whether it's a favorite. Shows the star button with `onFavoriteChange`. */
  favorite?: boolean;
  /** The server's picture, usually an `<img>`. It's decorative. */
  icon?: ReactNode;
  /** The label of the join button. */
  joinLabel?: string;
  /** The server's name. */
  name: string;
  /** Called when the star is pressed, with the new value. */
  onFavoriteChange?: (favorite: boolean) => void;
  /** Called when Join is pressed. Without it, there is no join button. */
  onJoin?: () => void;
  /** The round trip, in milliseconds. */
  ping?: number | null;
  /** How many players are on it, and how many it allows. */
  players?: { max?: number; online: number };
  /** Join is disabled while connecting, and while offline. */
  status?: ServerStatus;
}

/** One server: its picture, name, players and ping, with Join and a favorite star. */
export function ServerListItem({
  className,
  description,
  favorite = false,
  icon,
  joinLabel = "Join",
  name,
  onFavoriteChange,
  onJoin,
  ping,
  players,
  status = "online",
  ...props
}: ServerListItemProps) {
  return (
    <li
      className={cn(
        "bg-craft-surface text-craft-text flex flex-wrap items-center gap-x-4 gap-y-2 px-(--craft-space) py-3",
        "shadow-[inset_0_var(--craft-unit)_0_var(--craft-surface-hi),inset_0_calc(-1*var(--craft-unit))_0_var(--craft-surface-lo)]",
        className
      )}
      data-slot="server-list-item"
      data-status={status}
      {...props}
    >
      <span className="flex min-w-48 flex-1 items-center gap-3">
        {icon ? (
          <span
            aria-hidden="true"
            className="border-craft-outline bg-craft-sunken flex size-[calc(var(--craft-unit)*22)] shrink-0 items-center justify-center overflow-hidden border-(length:--craft-unit) [&>img]:size-full [&>img]:object-cover [&>img]:[image-rendering:pixelated]"
            data-slot="server-list-item-icon"
          >
            {icon}
          </span>
        ) : null}
        <span className="flex min-w-0 flex-col gap-1">
          <span className="font-craft-display truncate leading-tight text-(length:--craft-label-size)">
            {name}
          </span>
          {description ? (
            <span className="font-craft-body text-craft-text-muted line-clamp-2 text-sm">
              {description}
            </span>
          ) : null}
        </span>
      </span>
      <span className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-2">
        {players ? <ServerPlayers {...players} /> : null}
        <ServerPing ping={ping} status={status} />
        {onFavoriteChange ? (
          <button
            aria-label={`Favorite ${name}`}
            aria-pressed={favorite}
            className={cn(
              "hover:bg-craft-hover focus-visible:craft-focus active:bg-craft-active inline-flex size-(--craft-control-sm) cursor-pointer items-center justify-center",
              favorite ? "text-craft-favorite" : "text-craft-text-muted"
            )}
            data-slot="server-list-item-favorite"
            onClick={() => onFavoriteChange(!favorite)}
            type="button"
          >
            <StarIcon filled={favorite} />
          </button>
        ) : null}
        {onJoin ? (
          <Button
            // The name tells one Join from another, after the visible label.
            aria-label={`${joinLabel} ${name}`}
            disabled={status !== "online"}
            onClick={onJoin}
            size="sm"
          >
            {joinLabel}
          </Button>
        ) : null}
      </span>
    </li>
  );
}
