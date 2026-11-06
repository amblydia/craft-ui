import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  ServerList,
  ServerListItem,
  ServerListLabel,
  ServerPing,
  ServerPlayers,
} from "./server-list";

describe("ServerPing", () => {
  it.each([
    [40, 4, "Excellent ping, 40 ms"],
    [120, 3, "Good ping, 120 ms"],
    [250, 2, "Fair ping, 250 ms"],
    [900, 1, "Poor ping, 900 ms"],
  ])("draws %i ms as %i bars", (ping, bars, text) => {
    const { container } = render(<ServerPing ping={ping} />);
    expect(container.querySelectorAll("rect.fill-current")).toHaveLength(bars);
    expect(container).toHaveTextContent(text);
  });

  it("says when it's connecting, offline or unknown", () => {
    const { rerender } = render(<ServerPing status="connecting" />);
    expect(screen.getByRole("status")).toHaveTextContent("Connecting");
    rerender(<ServerPing status="offline" />);
    expect(screen.getByText("Offline")).toBeInTheDocument();
    rerender(<ServerPing ping={null} />);
    expect(screen.getByText("Ping unknown")).toBeInTheDocument();
  });

  it("can hide the milliseconds from sight", () => {
    render(<ServerPing ping={40} showValue={false} />);
    expect(screen.getByText(/40 ms/u)).toHaveClass("sr-only");
  });
});

describe("ServerPlayers", () => {
  it("reads the count in words", () => {
    render(<ServerPlayers max={5000} online={1204} />);
    expect(screen.getByText("1,204 of 5,000 players")).toHaveClass("sr-only");
  });
});

describe("ServerListItem", () => {
  it("joins with a button named after the server", async () => {
    const onJoin = vi.fn();
    const user = userEvent.setup();
    render(
      <ServerList aria-label="Servers">
        <ServerListLabel>Featured (1)</ServerListLabel>
        <ServerListItem
          name="Cobble Club"
          onJoin={onJoin}
          ping={45}
          players={{ max: 100, online: 12 }}
        />
      </ServerList>
    );
    expect(screen.getByRole("list", { name: "Servers" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Join Cobble Club" }));
    expect(onJoin).toHaveBeenCalledOnce();
  });

  it("can't join while connecting or offline", () => {
    const { rerender } = render(
      <ServerListItem name="Cobble Club" onJoin={vi.fn()} status="offline" />
    );
    expect(
      screen.getByRole("button", { name: "Join Cobble Club" })
    ).toBeDisabled();
    rerender(
      <ServerListItem name="Cobble Club" onJoin={vi.fn()} status="connecting" />
    );
    expect(
      screen.getByRole("button", { name: "Join Cobble Club" })
    ).toBeDisabled();
  });

  it("toggles its favorite star", async () => {
    const onFavoriteChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ServerListItem name="Cobble Club" onFavoriteChange={onFavoriteChange} />
    );
    const star = screen.getByRole("button", { name: "Favorite Cobble Club" });
    expect(star).toHaveAttribute("aria-pressed", "false");
    await user.click(star);
    expect(onFavoriteChange).toHaveBeenCalledWith(true);
  });

  it("leaves out the buttons without their handlers", () => {
    render(<ServerListItem name="Cobble Club" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
