import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";

function Example({
  onCopy,
  onDelete,
  onRename,
}: {
  onCopy?: () => void;
  onDelete?: () => void;
  onRename?: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>World options</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>World</DropdownMenuLabel>
          <DropdownMenuItem onClick={onCopy}>Copy world</DropdownMenuItem>
          <DropdownMenuItem disabled onClick={onRename}>
            Rename
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuCheckboxItem defaultChecked>
          Show coordinates
        </DropdownMenuCheckboxItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Export</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>As .mcworld</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} variant="destructive">
          Delete world
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe("DropdownMenu", () => {
  it("opens from its trigger and runs an action", async () => {
    const onCopy = vi.fn();
    const user = userEvent.setup();
    render(<Example onCopy={onCopy} />);

    await user.click(screen.getByRole("button", { name: "World options" }));
    await user.click(
      await screen.findByRole("menuitem", { name: "Copy world" })
    );

    expect(onCopy).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument()
    );
  });

  it("doesn't run a disabled action", async () => {
    const onRename = vi.fn();
    const user = userEvent.setup();
    render(<Example onRename={onRename} />);
    await user.click(screen.getByRole("button", { name: "World options" }));
    const rename = await screen.findByRole("menuitem", { name: "Rename" });
    expect(rename).toHaveAttribute("aria-disabled", "true");
    await user.click(rename);
    expect(onRename).not.toHaveBeenCalled();
  });

  it("marks destructive actions and toggles checkbox items", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "World options" }));

    expect(
      await screen.findByRole("menuitem", { name: "Delete world" })
    ).toHaveAttribute("data-variant", "destructive");
    const coordinates = screen.getByRole("menuitemcheckbox", {
      name: "Show coordinates",
    });
    expect(coordinates).toHaveAttribute("aria-checked", "true");
    await user.click(coordinates);
    expect(coordinates).toHaveAttribute("aria-checked", "false");
  });

  it("moves with the arrow keys and opens a submenu to the right", async () => {
    const user = userEvent.setup();
    render(<Example />);
    screen.getByRole("button", { name: "World options" }).focus();
    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Copy world" })).toHaveFocus()
    );

    // Disabled items are skipped, and so is the checkbox item's label.
    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Export" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    await waitFor(() =>
      expect(
        screen.getByRole("menuitem", { name: "As .mcworld" })
      ).toHaveFocus()
    );
  });
});
