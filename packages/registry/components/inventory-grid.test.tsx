import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { InventoryGrid } from "./inventory-grid";
import type { Item } from "./item-slot";

const start: (Item | null)[] = [
  { count: 12, id: "bread", name: "Bread" },
  null,
  { description: "Lights the way.", id: "torch", name: "Torch" },
  null,
  { id: "sword", name: "Sword" },
  null,
];

function Example({
  onSelectedIndexChange,
}: {
  onSelectedIndexChange?: (index: number | null) => void;
}) {
  const [items, setItems] = useState(start);
  return (
    <InventoryGrid
      aria-label="Backpack"
      columns={3}
      disabledSlots={[5]}
      items={items}
      onMove={(from, to) =>
        setItems((current) => {
          const next = [...current];
          [next[from], next[to]] = [next[to] ?? null, next[from] ?? null];
          return next;
        })
      }
      onSelectedIndexChange={onSelectedIndexChange}
    />
  );
}

const cell = (name: string) => screen.getByRole("gridcell", { name });
const cellAt = (index: number) =>
  screen.getAllByRole("gridcell")[index] as HTMLElement;

describe("InventoryGrid", () => {
  it("lays the slots out in rows, and names each one", () => {
    render(<Example />);
    expect(screen.getByRole("grid", { name: "Backpack" })).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(2);
    expect(screen.getAllByRole("gridcell")).toHaveLength(6);
    expect(cell("Bread, 12")).toBeInTheDocument();
    expect(
      screen.getAllByRole("gridcell", { name: "Empty slot" })
    ).toHaveLength(3);
  });

  it("adds rows to fill a fixed size", () => {
    render(
      <InventoryGrid aria-label="Chest" columns={9} items={[]} rows={3} />
    );
    expect(screen.getAllByRole("gridcell")).toHaveLength(27);
  });

  it("is one tab stop, and moves with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    expect(cell("Bread, 12")).toHaveFocus();
    expect(cell("Bread, 12")).toHaveAttribute("tabindex", "0");
    expect(cell("Torch")).toHaveAttribute("tabindex", "-1");

    await user.keyboard("{ArrowDown}");
    expect(cellAt(3)).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(cell("Sword")).toHaveFocus();
    await user.keyboard("{End}");
    expect(cellAt(5)).toHaveFocus();
    await user.keyboard("{Control>}{Home}{/Control}");
    expect(cell("Bread, 12")).toHaveFocus();
    // The edges stop the focus, rather than wrapping.
    await user.keyboard("{ArrowUp}{ArrowLeft}");
    expect(cell("Bread, 12")).toHaveFocus();
  });

  it("selects by click, Enter or Space, but not a disabled slot", async () => {
    const onSelectedIndexChange = vi.fn();
    const user = userEvent.setup();
    render(<Example onSelectedIndexChange={onSelectedIndexChange} />);

    await user.click(cell("Torch"));
    expect(cell("Torch")).toHaveAttribute("aria-selected", "true");
    expect(onSelectedIndexChange).toHaveBeenLastCalledWith(2);

    await user.keyboard("{ArrowLeft}{Enter}");
    expect(cellAt(1)).toHaveAttribute("aria-selected", "true");

    expect(cellAt(5)).toHaveAttribute("aria-disabled", "true");
    await user.click(cellAt(5));
    expect(cellAt(5)).toHaveAttribute("aria-selected", "false");
    expect(onSelectedIndexChange).toHaveBeenCalledTimes(2);
  });

  it("moves an item with Alt and an arrow key, and says so", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(cell("Bread, 12"));
    await user.keyboard("{Alt>}{ArrowRight}{/Alt}");

    expect(cellAt(1)).toHaveAccessibleName("Bread, 12");
    expect(cellAt(0)).toHaveAccessibleName("Empty slot");
    expect(cellAt(1)).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Moved Bread to slot 2"
    );
  });

  it("won't move an item onto a disabled slot", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(cell("Sword"));
    await user.keyboard("{Alt>}{ArrowRight}{/Alt}");
    expect(cellAt(4)).toHaveAccessibleName("Sword");
  });

  it("moves an item by dragging it", () => {
    render(<Example />);
    const from = cell("Torch");
    expect(from).toHaveAttribute("draggable", "true");
    const dataTransfer = {
      dropEffect: "",
      effectAllowed: "",
      setData: vi.fn(),
    };
    fireEvent.dragStart(from, { dataTransfer });
    fireEvent.dragOver(cellAt(3), { dataTransfer });
    expect(cellAt(3)).toHaveAttribute("data-drop-target");
    fireEvent.drop(cellAt(3), { dataTransfer });
    expect(cellAt(3)).toHaveAccessibleName("Torch");
  });

  it("can't drag without onMove", () => {
    render(<InventoryGrid aria-label="Chest" items={start} />);
    expect(cell("Torch")).not.toHaveAttribute("draggable");
  });

  it("shows an item's tooltip on keyboard focus", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.keyboard("{ArrowRight}{ArrowRight}");
    await waitFor(() =>
      expect(screen.getByText("Lights the way.")).toBeInTheDocument()
    );
  });
});
