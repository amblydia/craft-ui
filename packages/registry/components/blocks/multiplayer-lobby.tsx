"use client";

import {
  type ComponentProps,
  type FormEvent,
  type ReactNode,
  useState,
} from "react";
import { Badge } from "@/components/craft/badge";
import { Button } from "@/components/craft/button";
import { Input } from "@/components/craft/input";
import { ProfileAvatar } from "@/components/craft/profile-panel";
import {
  Screen,
  ScreenBody,
  ScreenHeader,
  ScreenSection,
} from "@/components/craft/screen";
import { ScrollArea } from "@/components/craft/scroll-area";
import { cn } from "@/lib/utils";

export interface LobbyPlayer {
  /** The avatar's image address. */
  avatar?: string;
  /** Leads the lobby, and starts the game. */
  host?: boolean;
  id: string;
  name: string;
  ready: boolean;
}

export interface LobbyMessage {
  author: string;
  id: string;
  text: string;
}

export interface MultiplayerLobbyProps
  extends Omit<ComponentProps<"div">, "children" | "title"> {
  /** Fills the screen behind the content. */
  background?: ReactNode;
  /** The id of the player using the screen. */
  currentPlayerId: string;
  /** What's being played, under the lobby's name, such as "Survival · Hard". */
  details?: ReactNode;
  /** The most players the lobby takes. */
  maxPlayers?: number;
  /** The chat so far, oldest first. */
  messages: LobbyMessage[];
  /** The lobby's name. */
  name: string;
  /** Called by the back arrow. Without it, there is no back arrow. */
  onBack?: () => void;
  /** Called by Invite. Without it, there is no Invite button. */
  onInvite?: () => void;
  /** Called by Leave. */
  onLeave: () => void;
  /** Called with the player's new ready state. */
  onReadyChange: (ready: boolean) => void;
  /** Called with the text of a message to send. */
  onSendMessage: (text: string) => void;
  /** Called by Start, which only the host has, once everyone is ready. */
  onStart: () => void;
  /** The players in the lobby. */
  players: LobbyPlayer[];
  /** The screen's name, in the bar along the top. */
  title?: string;
}

/**
 * A lobby before a game starts, in the style of Ore UI's party screen: the
 * players and whether they're ready, a chat, and Ready, Leave and, for the
 * host, Start once everyone is ready.
 */
export function MultiplayerLobby({
  background,
  className,
  currentPlayerId,
  details,
  maxPlayers,
  messages,
  name,
  onBack,
  onInvite,
  onLeave,
  onReadyChange,
  onSendMessage,
  onStart,
  players,
  title = "Lobby",
  ...props
}: MultiplayerLobbyProps) {
  const [draft, setDraft] = useState("");
  const me = players.find((player) => player.id === currentPlayerId);
  const allReady =
    players.length > 0 && players.every((player) => player.ready);
  const readyCount = players.filter((player) => player.ready).length;

  const send = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (text) {
      onSendMessage(text);
      setDraft("");
    }
  };

  return (
    <Screen
      background={background}
      className={cn("min-h-[40rem]", className)}
      data-slot="multiplayer-lobby"
      {...props}
    >
      <ScreenHeader onBack={onBack} title={title} />
      <ScreenBody>
        <div className="flex flex-col gap-1">
          <h2 className="font-craft-display leading-tight text-(length:--craft-label-size)">
            {name}
          </h2>
          {details ? (
            <p className="font-craft-body text-craft-text-muted text-sm">
              {details}
            </p>
          ) : null}
        </div>
        <div className="grid items-start gap-6 @3xl/screen:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <ScreenSection
            action={
              onInvite ? (
                <Button onClick={onInvite} size="sm" variant="secondary">
                  Invite
                </Button>
              ) : undefined
            }
            title={`Players (${players.length}${maxPlayers ? `/${maxPlayers}` : ""})`}
            tone="warning"
          >
            <ul className="bg-craft-outline border-craft-outline flex flex-col gap-(--craft-unit) border-(length:--craft-unit)">
              {players.map((player) => (
                <li
                  className="bg-craft-surface flex items-center gap-3 p-3 shadow-[inset_0_var(--craft-unit)_0_var(--craft-surface-hi),inset_0_calc(-1*var(--craft-unit))_0_var(--craft-surface-lo)]"
                  key={player.id}
                >
                  <ProfileAvatar
                    className="size-12"
                    fallback={player.name.slice(0, 2).toUpperCase()}
                    src={player.avatar}
                  />
                  <span className="font-craft-display min-w-0 flex-1 truncate leading-tight text-(length:--craft-label-size)">
                    {player.name}
                    {player.id === currentPlayerId ? (
                      <span className="text-craft-text-muted"> (you)</span>
                    ) : null}
                  </span>
                  {player.host ? <Badge variant="info">Host</Badge> : null}
                  <Badge variant={player.ready ? "primary" : "neutral"}>
                    {player.ready ? "Ready" : "Not ready"}
                  </Badge>
                </li>
              ))}
            </ul>
          </ScreenSection>
          <ScreenSection title="Chat">
            <div className="border-craft-outline bg-craft-sunken flex flex-col border-(length:--craft-unit)">
              <ScrollArea className="h-64" label="Chat messages">
                <ol
                  aria-live="polite"
                  className="font-craft-body flex flex-col gap-2 p-(--craft-space) text-sm"
                >
                  {messages.map((message) => (
                    <li key={message.id}>
                      <span className="font-craft-display">
                        {message.author}:
                      </span>{" "}
                      {message.text}
                    </li>
                  ))}
                </ol>
              </ScrollArea>
              <form className="bg-craft-surface flex gap-2 p-2" onSubmit={send}>
                <Input
                  aria-label="Message"
                  className="flex-1"
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Say something"
                  size="sm"
                  value={draft}
                />
                <Button size="sm" type="submit" variant="secondary">
                  Send
                </Button>
              </form>
            </div>
          </ScreenSection>
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-3">
          <Button onClick={onLeave} variant="destructive">
            Leave
          </Button>
          <p
            aria-live="polite"
            className="font-craft-body bg-craft-overlay ml-auto px-3 py-2 text-sm"
          >
            {readyCount} of {players.length} ready
          </p>
          {me ? (
            <Button
              aria-pressed={me.ready}
              onClick={() => onReadyChange(!me.ready)}
              variant="secondary"
            >
              {me.ready ? "Not ready" : "Ready"}
            </Button>
          ) : null}
          {me?.host ? (
            <Button disabled={!allReady} onClick={onStart} variant="hero">
              Start
            </Button>
          ) : null}
        </div>
      </ScreenBody>
    </Screen>
  );
}
