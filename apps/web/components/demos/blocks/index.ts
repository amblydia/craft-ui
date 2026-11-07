import type { ComponentType } from "react";
import { ConfirmationDialogDemo } from "./confirmation-dialog-demo";
import { GameDashboardDemo } from "./game-dashboard-demo";
import { InventoryScreenDemo } from "./inventory-screen-demo";
import { MainMenuDemo } from "./main-menu-demo";
import { MarketplaceDemo } from "./marketplace-demo";
import { MultiplayerLobbyDemo } from "./multiplayer-lobby-demo";
import { ProfileScreenDemo } from "./profile-screen-demo";
import { ScreenDemo } from "./screen-demo";
import { ServerBrowserDemo } from "./server-browser-demo";
import { SettingsScreenDemo } from "./settings-screen-demo";
import { WorldBrowserDemo } from "./world-browser-demo";

/** Every block's demo, by its name, for the full-page view at /view/{name}. */
export const blockDemos: Record<string, ComponentType> = {
  "confirmation-dialog": ConfirmationDialogDemo,
  "game-dashboard": GameDashboardDemo,
  "inventory-screen": InventoryScreenDemo,
  "main-menu": MainMenuDemo,
  marketplace: MarketplaceDemo,
  "multiplayer-lobby": MultiplayerLobbyDemo,
  "profile-screen": ProfileScreenDemo,
  screen: ScreenDemo,
  "server-browser": ServerBrowserDemo,
  "settings-screen": SettingsScreenDemo,
  "world-browser": WorldBrowserDemo,
};
