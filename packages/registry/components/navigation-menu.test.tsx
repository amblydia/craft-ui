import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLabel,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu";

function Example({ orientation }: { orientation?: "horizontal" | "vertical" }) {
  return (
    <NavigationMenu aria-label="Main" orientation={orientation}>
      <NavigationMenuList>
        <NavigationMenuLabel>General</NavigationMenuLabel>
        <NavigationMenuItem>
          <NavigationMenuLink active href="#play">
            Play
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Settings</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="#video">Video</NavigationMenuLink>
            <NavigationMenuLink href="#audio">Audio</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

describe("NavigationMenu", () => {
  it("is a navigation landmark that marks the current page", () => {
    render(<Example />);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Play" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("opens a panel of nested links", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const settings = screen.getByRole("button", { name: "Settings" });
    expect(settings).toHaveAttribute("aria-expanded", "false");

    await user.click(settings);
    await waitFor(() =>
      expect(settings).toHaveAttribute("aria-expanded", "true")
    );
    expect(await screen.findByRole("link", { name: "Video" })).toHaveAttribute(
      "data-slot",
      "navigation-menu-link"
    );
  });

  it("opens a panel from the keyboard and closes it with Escape", async () => {
    const user = userEvent.setup();
    render(<Example />);
    screen.getByRole("button", { name: "Settings" }).focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("link", { name: "Audio" })).toBeVisible();

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("link", { name: "Audio" })).toBeNull()
    );
  });

  it("can be a sidebar", () => {
    render(<Example orientation="vertical" />);
    expect(screen.getByRole("navigation")).toHaveAttribute(
      "data-orientation",
      "vertical"
    );
  });
});
