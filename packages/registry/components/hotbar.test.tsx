import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Hotbar } from "./hotbar";
import type { Item } from "./item-slot";

const items: (Item | null)[] = [
  { id: "sword", name: "Sword" },
  { count: 16, id: "bread", name: "Bread" },
  null,
  { id: "torch", name: "Torch" },
];

const option = (name: string) => screen.getByRole("option", { name });
const optionAt = (index: number) =>
  screen.getAllByRole("option")[index] as HTMLElement;

describe("Hotbar", () => {
  it("is a list of slots with one selected", () => {
    render(<Hotbar aria-label="Hotbar" items={items} showName />);
    expect(screen.getByRole("listbox", { name: "Hotbar" })).toHaveAttribute(
      "aria-orientation",
      "horizontal"
    );
    expect(screen.getAllByRole("option")).toHaveLength(4);
    expect(option("Sword")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Sword", { selector: "p" })).toBeInTheDocument();
  });

  it("defaults to nine slots", () => {
    render(<Hotbar aria-label="Hotbar" items={[]} />);
    expect(screen.getAllByRole("option")).toHaveLength(9);
  });

  it("moves the selection with the arrow keys, wrapping at the ends", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Hotbar aria-label="Hotbar" items={items} onValueChange={onValueChange} />
    );
    await user.tab();
    expect(option("Sword")).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(option("Bread, 16")).toHaveFocus();
    expect(option("Bread, 16")).toHaveAttribute("aria-selected", "true");
    expect(onValueChange).toHaveBeenLastCalledWith(1);

    await user.keyboard("{Home}{ArrowLeft}");
    expect(option("Torch")).toHaveAttribute("aria-selected", "true");
  });

  it("picks a slot with a number key while focused", async () => {
    const user = userEvent.setup();
    render(<Hotbar aria-label="Hotbar" items={items} />);
    await user.tab();
    await user.keyboard("4");
    expect(option("Torch")).toHaveAttribute("aria-selected", "true");
    expect(option("Torch")).toHaveFocus();
    // There is no ninth slot.
    await user.keyboard("9");
    expect(option("Torch")).toHaveAttribute("aria-selected", "true");
  });

  it("picks a slot from anywhere with hotkeys, but not while typing", async () => {
    const user = userEvent.setup();
    render(
      <>
        <input aria-label="Chat" />
        <button type="button">Elsewhere</button>
        <Hotbar aria-label="Hotbar" hotkeys items={items} />
      </>
    );
    await user.click(screen.getByRole("button", { name: "Elsewhere" }));
    await user.keyboard("2");
    expect(option("Bread, 16")).toHaveAttribute("aria-selected", "true");

    await user.click(screen.getByRole("textbox", { name: "Chat" }));
    await user.keyboard("4");
    expect(option("Bread, 16")).toHaveAttribute("aria-selected", "true");
  });

  it("selects by click", async () => {
    const user = userEvent.setup();
    render(<Hotbar aria-label="Hotbar" items={items} />);
    await user.click(optionAt(2));
    expect(optionAt(2)).toHaveAttribute("aria-selected", "true");
  });

  it("can be controlled", async () => {
    const user = userEvent.setup();
    render(<Hotbar aria-label="Hotbar" items={items} value={3} />);
    await user.click(option("Sword"));
    expect(option("Torch")).toHaveAttribute("aria-selected", "true");
  });
});
