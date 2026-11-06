import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WorldCard, WorldList } from "./world-list";

function Example({
  onDelete = vi.fn(),
  onEdit = vi.fn(),
  onPlay = vi.fn(),
}: {
  onDelete?: () => void;
  onEdit?: () => void;
  onPlay?: () => void;
}) {
  return (
    <WorldList aria-label="Worlds">
      <WorldCard
        meta="Last played yesterday"
        name="Riverside"
        onDelete={onDelete}
        onEdit={onEdit}
        onPlay={onPlay}
        tags={<span>Survival</span>}
      />
    </WorldList>
  );
}

describe("WorldCard", () => {
  it("plays from a button named after the world", async () => {
    const onPlay = vi.fn();
    const user = userEvent.setup();
    render(<Example onPlay={onPlay} />);
    expect(screen.getByRole("list", { name: "Worlds" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Play Riverside" }));
    expect(onPlay).toHaveBeenCalledOnce();
    expect(screen.getByText("Survival")).toBeInTheDocument();
    expect(screen.getByText("Last played yesterday")).toBeInTheDocument();
  });

  it("edits", async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    render(<Example onEdit={onEdit} />);
    await user.click(screen.getByRole("button", { name: "Edit Riverside" }));
    expect(onEdit).toHaveBeenCalledOnce();
  });

  it("asks before deleting, and can be cancelled", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<Example onDelete={onDelete} />);
    await user.click(screen.getByRole("button", { name: "Delete Riverside" }));

    const dialog = await screen.findByRole("alertdialog", {
      name: 'Delete "Riverside"?',
    });
    expect(dialog).toHaveAccessibleDescription(
      "It will be deleted for good. You can't undo this."
    );
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("deletes once confirmed", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<Example onDelete={onDelete} />);
    await user.click(screen.getByRole("button", { name: "Delete Riverside" }));
    await user.click(await screen.findByRole("button", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("shows only what it's given", () => {
    render(<WorldCard name="Riverside" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText("Riverside")).toBeInTheDocument();
  });
});
