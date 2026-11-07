"use client";

import { useState } from "react";
import {
  MainMenu,
  MainMenuIconButton,
} from "@/components/craft/blocks/main-menu";
import { Button } from "@/components/craft/button";
import { Explorer, Scene } from "@/components/demos/game-art";

function SlidersIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 12 12"
    >
      <path d="M1 2h10v1H1zM1 6h10v1H1zM1 10h10v1H1zM3 1h2v3H3zM7 5h2v3H7zM4 9h2v3H4z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 12 12"
    >
      <path d="M0 2h12v1H0zM0 10h12v1H0zM0 3h1v7H0zM11 3h1v7h-1zM1 3h1v1H1zM10 3h1v1h-1zM2 4h1v1H2zM9 4h1v1H9zM3 5h1v1H3zM8 5h1v1H8zM4 6h4v1H4z" />
    </svg>
  );
}

export function MainMenuDemo() {
  const [last, setLast] = useState("Choose something.");

  return (
    <MainMenu
      actions={[
        {
          label: "Marketplace",
          onClick: () => setLast("Opening the marketplace"),
        },
        {
          label: "Dressing room",
          onClick: () => setLast("Opening the dressing room"),
        },
      ]}
      background={<Scene name="meadow" />}
      character={<Explorer />}
      logo={
        <p className="bg-craft-overlay font-craft-display px-4 py-2 text-[2.75rem] leading-none tracking-widest uppercase">
          Blockfall
        </p>
      }
      playerName="Skylark"
      primaryAction={{
        label: "Play",
        onClick: () => setLast("Starting to play"),
      }}
      toolbar={
        <>
          <MainMenuIconButton aria-label="Settings" icon={<SlidersIcon />} />
          <MainMenuIconButton
            aria-label="Inbox, 1 unread message"
            icon={<MailIcon />}
            notification
          />
          <Button variant="secondary">Social (0)</Button>
          <output className="bg-craft-overlay font-craft-body sr-only px-3 py-2 text-sm">
            {last}
          </output>
        </>
      }
    />
  );
}
