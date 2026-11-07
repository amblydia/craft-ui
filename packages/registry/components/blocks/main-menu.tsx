"use client";

import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/craft/button";
import { Screen } from "@/components/craft/screen";
import { cn } from "@/lib/utils";

export interface MainMenuAction {
  label: string;
  onClick?: () => void;
}

export interface MainMenuProps
  extends Omit<ComponentProps<"div">, "children" | "title"> {
  /** The other choices, as light buttons under the first, such as Marketplace. */
  actions?: MainMenuAction[];
  /** Fills the screen behind the menu, such as a picture of the world. */
  background?: ReactNode;
  /**
   * The player's character, or a picture of it, on the right. CraftUI doesn't
   * draw characters.
   */
  character?: ReactNode;
  /** The game's title or logo, above the buttons. */
  logo?: ReactNode;
  /** The player's name, on a tag above their character. */
  playerName?: string;
  /** The main choice, as the big green button. */
  primaryAction: MainMenuAction;
  /** Controls in the top corner, such as settings, inbox and Social. */
  toolbar?: ReactNode;
}

/**
 * Ore UI's main menu: a big green Play button and light buttons under it, the
 * player's character on the right, and controls in the top corner. On a
 * narrow screen, the character is left out.
 */
export function MainMenu({
  actions = [],
  background,
  character,
  className,
  logo,
  playerName,
  primaryAction,
  toolbar,
  ...props
}: MainMenuProps) {
  return (
    <Screen
      background={background}
      className={cn("min-h-[36rem]", className)}
      data-slot="main-menu"
      {...props}
    >
      {toolbar ? (
        <div
          className="flex flex-wrap justify-end gap-3 p-(--craft-space)"
          data-slot="main-menu-toolbar"
        >
          {toolbar}
        </div>
      ) : null}
      <div className="grid flex-1 items-center gap-8 p-(--craft-space) @3xl/screen:grid-cols-[minmax(0,26rem)_1fr] @3xl/screen:px-[8%]">
        <nav aria-label="Main menu" className="flex min-w-0 flex-col gap-4">
          {logo ? (
            <div
              className="mb-4 flex justify-center *:max-w-full"
              data-slot="main-menu-logo"
            >
              {logo}
            </div>
          ) : null}
          <Button
            fullWidth
            onClick={primaryAction.onClick}
            size="lg"
            variant="hero"
          >
            {primaryAction.label}
          </Button>
          {actions.map((action) => (
            <Button
              fullWidth
              key={action.label}
              onClick={action.onClick}
              size="lg"
              variant="secondary"
            >
              {action.label}
            </Button>
          ))}
        </nav>
        {character ? (
          <div
            className="hidden flex-col items-center justify-center gap-3 self-stretch @3xl/screen:flex"
            data-slot="main-menu-character"
          >
            {playerName ? (
              <span className="bg-craft-overlay font-craft-display px-3 py-1 leading-tight text-(length:--craft-label-size)">
                {playerName}
              </span>
            ) : null}
            <div className="flex max-h-96 w-full max-w-64 flex-1 items-end justify-center [&>img]:max-h-full [&>img]:object-contain [&>img]:[image-rendering:pixelated] [&>svg]:max-h-full">
              {character}
            </div>
          </div>
        ) : null}
      </div>
    </Screen>
  );
}

export interface MainMenuIconButtonProps
  extends Omit<ComponentProps<typeof Button>, "children"> {
  /** The button's accessible name. */
  "aria-label": string;
  /** The picture on the button. */
  icon: ReactNode;
  /** Shows a red square in the corner, such as for unread messages. */
  notification?: boolean;
}

/** A square light button for the top corner, with an optional red dot. */
export function MainMenuIconButton({
  className,
  icon,
  notification,
  ...props
}: MainMenuIconButtonProps) {
  return (
    <span className="relative inline-flex">
      <Button
        className={cn("[&_svg]:size-6", className)}
        size="icon"
        variant="secondary"
        {...props}
      >
        {icon}
      </Button>
      {notification ? (
        <span
          aria-hidden="true"
          className="bg-craft-tag-destructive border-craft-outline absolute -top-1 -right-1 size-[calc(var(--craft-unit)*5)] border-(length:--craft-unit)"
          data-slot="main-menu-notification"
        />
      ) : null}
    </span>
  );
}
