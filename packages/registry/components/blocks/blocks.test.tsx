import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConfirmationDialog } from "./confirmation-dialog";
import { GameDashboard } from "./game-dashboard";
import { InventoryScreen } from "./inventory-screen";
import { MainMenu, MainMenuIconButton } from "./main-menu";
import { Marketplace, type Product } from "./marketplace";
import { MultiplayerLobby } from "./multiplayer-lobby";
import { ProfileScreen } from "./profile-screen";
import { type Server, ServerBrowser } from "./server-browser";
import { type SettingsCategory, SettingsScreen } from "./settings-screen";
import { lastPlayedLabel, WorldBrowser } from "./world-browser";

describe("MainMenu", () => {
  it("offers Play first, then the other choices", async () => {
    const play = vi.fn();
    const user = userEvent.setup();
    render(
      <MainMenu
        actions={[{ label: "Marketplace" }, { label: "Dressing room" }]}
        primaryAction={{ label: "Play", onClick: play }}
        toolbar={
          <MainMenuIconButton
            aria-label="Inbox, 1 unread"
            icon={<svg />}
            notification
          />
        }
      />
    );
    const menu = screen.getByRole("navigation", { name: "Main menu" });
    const buttons = within(menu).getAllByRole("button");
    expect(buttons.map((button) => button.textContent)).toEqual([
      "Play",
      "Marketplace",
      "Dressing room",
    ]);
    await user.click(buttons[0] as HTMLElement);
    expect(play).toHaveBeenCalledOnce();
    expect(
      screen.getByRole("button", { name: "Inbox, 1 unread" })
    ).toBeInTheDocument();
  });
});

const servers: Server[] = [
  { favorite: true, id: "a", name: "Gemfall", ping: 30, status: "online" },
  {
    description: "Build together",
    id: "b",
    name: "Builders Bay",
    ping: 200,
    status: "online",
  },
  { id: "c", name: "The Quarry", status: "offline" },
];

describe("ServerBrowser", () => {
  it("shows the chosen server's details and joins it", async () => {
    const onJoin = vi.fn();
    const user = userEvent.setup();
    render(<ServerBrowser onJoin={onJoin} servers={servers} />);
    expect(
      screen.getByRole("region", { name: "Gemfall details" })
    ).toBeInTheDocument();

    // Named by the server alone, and described by its description.
    expect(
      screen.getByRole("button", { name: "Builders Bay" })
    ).toHaveAccessibleDescription("Build together");
    await user.click(screen.getByRole("button", { name: "Builders Bay" }));
    expect(
      screen.getByRole("button", { name: "Builders Bay" })
    ).toHaveAttribute("aria-current", "true");
    await user.click(screen.getByRole("button", { name: "Play Builders Bay" }));
    expect(onJoin).toHaveBeenCalledWith(servers[1]);
  });

  it("searches, and filters to favorites", async () => {
    const user = userEvent.setup();
    render(<ServerBrowser onJoin={vi.fn()} servers={servers} />);
    await user.type(
      screen.getByRole("searchbox", { name: "Search servers" }),
      "bay"
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(1);

    await user.clear(screen.getByRole("searchbox", { name: "Search servers" }));
    await user.click(screen.getByRole("switch", { name: "Favorites only" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText("Servers (1)")).toBeInTheDocument();
  });

  it("can't play an offline server", async () => {
    const user = userEvent.setup();
    render(<ServerBrowser onJoin={vi.fn()} servers={servers} />);
    await user.click(screen.getByRole("button", { name: "The Quarry" }));
    expect(
      screen.getByRole("button", { name: "Play The Quarry" })
    ).toBeDisabled();
  });
});

describe("WorldBrowser", () => {
  const worlds = [
    { id: "1", lastPlayed: new Date(2026, 0, 1), name: "Riverside" },
    {
      id: "2",
      lastPlayed: new Date(2026, 0, 5),
      mode: "Creative",
      name: "Alpine",
    },
  ];

  it("sorts by last played, then by name", () => {
    render(<WorldBrowser onPlay={vi.fn()} worlds={worlds} />);
    const names = screen
      .getAllByRole("button", { name: /^Play /u })
      .map((button) => button.getAttribute("aria-label"));
    expect(names).toEqual(["Play Alpine", "Play Riverside"]);
  });

  it("searches, and says when nothing matches", async () => {
    const user = userEvent.setup();
    render(<WorldBrowser onPlay={vi.fn()} worlds={worlds} />);
    await user.type(screen.getByRole("searchbox"), "zzz");
    expect(screen.getByText('No worlds match "zzz".')).toBeInTheDocument();
  });

  it("describes when a world was last played", () => {
    const now = new Date(2026, 0, 10);
    expect(lastPlayedLabel(undefined, now)).toBe("Never played");
    expect(lastPlayedLabel(new Date(2026, 0, 9), now)).toBe(
      "Last played yesterday"
    );
  });
});

describe("SettingsScreen", () => {
  const categories: SettingsCategory[] = [
    {
      id: "audio",
      label: "Audio",
      sections: [
        {
          settings: [
            { id: "music", label: "Music", type: "switch" },
            { id: "volume", label: "Volume", type: "slider" },
            {
              id: "quality",
              label: "Quality",
              options: [
                { label: "Low", value: "low" },
                { label: "High", value: "high" },
              ],
              type: "choice",
            },
          ],
          title: "Sound",
        },
      ],
    },
  ];

  it("builds the controls, and reports changes and resets", async () => {
    const onValueChange = vi.fn();
    const onReset = vi.fn();
    const user = userEvent.setup();
    render(
      <SettingsScreen
        categories={categories}
        onReset={onReset}
        onValueChange={onValueChange}
        values={{ music: false, quality: "low", volume: 40 }}
      />
    );
    await user.click(screen.getByRole("switch", { name: "Music" }));
    expect(onValueChange).toHaveBeenCalledWith("music", true);
    expect(screen.getByRole("slider", { name: "Volume" })).toHaveValue("40");
    await user.click(screen.getByRole("tab", { name: "High" }));
    expect(onValueChange).toHaveBeenCalledWith("quality", "high");
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(onReset).toHaveBeenCalledWith(categories[0]);
  });
});

describe("InventoryScreen", () => {
  const sword = { id: "sword", name: "Sword" };
  const bread = { count: 3, id: "bread", name: "Bread" };

  it("moves the chosen item between the hotbar and the backpack", async () => {
    const onContentsChange = vi.fn();
    const user = userEvent.setup();
    render(
      <InventoryScreen
        columns={3}
        defaultContents={{ hotbar: [sword], inventory: [bread] }}
        onContentsChange={onContentsChange}
        rows={1}
      />
    );
    // The hotbar's first slot is chosen to start with.
    expect(screen.getByText("Sword", { selector: "p" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Move to backpack" }));
    expect(onContentsChange).toHaveBeenLastCalledWith({
      hotbar: [null, null, null],
      inventory: [bread, sword, null],
    });
  });

  it("drops the chosen item", async () => {
    const onDrop = vi.fn();
    const user = userEvent.setup();
    render(
      <InventoryScreen
        columns={3}
        defaultContents={{ hotbar: [sword], inventory: [] }}
        onDrop={onDrop}
        rows={1}
      />
    );
    await user.click(screen.getByRole("button", { name: "Drop" }));
    expect(onDrop).toHaveBeenCalledWith(sword);
    expect(screen.getByRole("button", { name: "Drop" })).toBeDisabled();
  });
});

describe("ProfileScreen", () => {
  it("shows the player, their stats and achievements", () => {
    render(
      <ProfileScreen
        completed={[
          { description: "Did it", id: "a", points: 20, title: "Done" },
        ]}
        profile={{ name: "Skylark", status: "online" }}
        stats={[{ label: "Friends", value: "3" }]}
        suggested={[{ description: "Try it", id: "b", title: "Next" }]}
      />
    );
    expect(
      screen.getByRole("heading", { name: "Skylark" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Suggested next achievements" })
    ).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Stats" })).toBeInTheDocument();
  });
});

describe("ConfirmationDialog", () => {
  it("waits for the box to be ticked before confirming", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(
      <ConfirmationDialog
        acknowledgement="I understand"
        confirmLabel="Delete"
        description="This can't be undone."
        destructive
        onConfirm={onConfirm}
        title="Delete Riverside?"
        trigger={<button type="button">Delete world</button>}
      />
    );
    await user.click(screen.getByRole("button", { name: "Delete world" }));
    const dialog = await screen.findByRole("alertdialog", {
      name: "Delete Riverside?",
    });
    const confirm = within(dialog).getByRole("button", { name: "Delete" });
    expect(confirm).toBeDisabled();
    await user.click(
      within(dialog).getByRole("checkbox", { name: "I understand" })
    );
    await user.click(confirm);
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});

describe("GameDashboard", () => {
  it("shows the world's state and reports control changes", async () => {
    const onWeatherChange = vi.fn();
    const user = userEvent.setup();
    render(
      <GameDashboard
        events={[{ id: "1", message: "joined", player: "Alex", time: "12:00" }]}
        hour={12}
        meters={[{ label: "Memory", value: 40 }]}
        onHourChange={vi.fn()}
        onWeatherChange={onWeatherChange}
        stats={[{ label: "Players", value: "4" }]}
        status="online"
        weather="clear"
        worldName="Riverside"
      />
    );
    expect(screen.getByText("Online")).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", { name: "Memory" })
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Alex" })).toBeInTheDocument();
    await user.click(screen.getByRole("combobox", { name: "Weather" }));
    await user.click(await screen.findByRole("option", { name: "Rain" }));
    expect(onWeatherChange).toHaveBeenCalledWith("rain");
  });
});

describe("MultiplayerLobby", () => {
  const players = [
    { host: true, id: "me", name: "Skylark", ready: true },
    { id: "b", name: "Pebble", ready: false },
  ];

  it("starts only once everyone is ready", () => {
    const { rerender } = render(
      <MultiplayerLobby
        currentPlayerId="me"
        messages={[]}
        name="Night raid"
        onLeave={vi.fn()}
        onReadyChange={vi.fn()}
        onSendMessage={vi.fn()}
        onStart={vi.fn()}
        players={players}
      />
    );
    expect(screen.getByRole("button", { name: "Start" })).toBeDisabled();
    rerender(
      <MultiplayerLobby
        currentPlayerId="me"
        messages={[]}
        name="Night raid"
        onLeave={vi.fn()}
        onReadyChange={vi.fn()}
        onSendMessage={vi.fn()}
        onStart={vi.fn()}
        players={players.map((player) => ({ ...player, ready: true }))}
      />
    );
    expect(screen.getByRole("button", { name: "Start" })).toBeEnabled();
  });

  it("sends a message and toggles ready", async () => {
    const onSendMessage = vi.fn();
    const onReadyChange = vi.fn();
    const user = userEvent.setup();
    render(
      <MultiplayerLobby
        currentPlayerId="b"
        messages={[{ author: "Skylark", id: "1", text: "Hi" }]}
        name="Night raid"
        onLeave={vi.fn()}
        onReadyChange={onReadyChange}
        onSendMessage={onSendMessage}
        onStart={vi.fn()}
        players={players}
      />
    );
    await user.type(
      screen.getByRole("textbox", { name: "Message" }),
      "Hello{Enter}"
    );
    expect(onSendMessage).toHaveBeenCalledWith("Hello");
    expect(screen.getByRole("textbox", { name: "Message" })).toHaveValue("");
    await user.click(screen.getByRole("button", { name: "Ready" }));
    expect(onReadyChange).toHaveBeenCalledWith(true);
    // Only the host can start.
    expect(
      screen.queryByRole("button", { name: "Start" })
    ).not.toBeInTheDocument();
  });
});

describe("Marketplace", () => {
  const products: Product[] = Array.from({ length: 10 }, (_, index) => ({
    creator: "Studio",
    id: String(index),
    price: (index + 1) * 100,
    title: `Pack ${index + 1}`,
  }));

  it("pages the results and opens a product", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <Marketplace onSelect={onSelect} pageSize={4} products={products} />
    );
    expect(screen.getAllByRole("listitem").length).toBeGreaterThanOrEqual(4);
    await user.click(screen.getByRole("link", { name: "3" }));
    expect(screen.getByRole("button", { name: "Pack 9" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Pack 9" }));
    expect(onSelect).toHaveBeenCalledWith(products[8]);
  });

  it("sorts by price", async () => {
    const user = userEvent.setup();
    render(
      <Marketplace onSelect={vi.fn()} pageSize={20} products={products} />
    );
    await user.click(screen.getByRole("combobox", { name: "Sort by" }));
    await user.click(
      await screen.findByRole("option", { name: "Price: high to low" })
    );
    const titles = within(screen.getByRole("list", { name: "Products" }))
      .getAllByRole("button")
      .map((button) => button.textContent);
    expect(titles[0]).toBe("Pack 10");
  });
});
