import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "./context-menu";

function Example({ onOpenFolder }: { onOpenFolder?: () => void }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger tabIndex={0}>Screenshot</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onOpenFolder}>Open folder</ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Copy link</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

describe("ContextMenu", () => {
  it("opens on right-click and runs an action", async () => {
    const onOpenFolder = vi.fn();
    const user = userEvent.setup();
    render(<Example onOpenFolder={onOpenFolder} />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    fireEvent.contextMenu(screen.getByText("Screenshot"));
    await waitFor(() => expect(screen.getByRole("menu")).toBeInTheDocument());
    await user.click(screen.getByRole("menuitem", { name: "Open folder" }));
    expect(onOpenFolder).toHaveBeenCalledOnce();
  });

  it("opens a nested menu from the keyboard", async () => {
    const user = userEvent.setup();
    render(<Example />);
    fireEvent.contextMenu(screen.getByText("Screenshot"));
    await waitFor(() => expect(screen.getByRole("menu")).toBeInTheDocument());

    await user.keyboard("{ArrowDown}{ArrowDown}");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Share" })).toHaveFocus()
    );
    await user.keyboard("{ArrowRight}");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Copy link" })).toHaveFocus()
    );

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("menuitem", { name: "Copy link" })).toBeNull()
    );
  });
});
