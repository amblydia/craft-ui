import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { type Item, ItemSlot, ItemTooltip, itemLabel } from "./item-slot";

const pickaxe: Item = {
  description: "Mines stone and ore.",
  durability: 0.4,
  icon: <svg data-testid="icon" />,
  id: "pickaxe",
  name: "Iron Pickaxe",
};
const torches: Item = { count: 32, id: "torch", name: "Torch" };

describe("itemLabel", () => {
  it("says the name, count and durability", () => {
    expect(itemLabel(torches)).toBe("Torch, 32");
    expect(itemLabel(pickaxe)).toBe("Iron Pickaxe, 40% durability");
    expect(itemLabel({ count: 1, durability: 1, id: "a", name: "Apple" })).toBe(
      "Apple"
    );
  });

  it("names an empty slot", () => {
    expect(itemLabel(null)).toBe("Empty slot");
    expect(itemLabel(undefined, "Vide")).toBe("Vide");
  });
});

describe("ItemSlot", () => {
  it("shows the count from two, and hides the icon from screen readers", () => {
    const { container, rerender } = render(<ItemSlot item={torches} />);
    expect(
      container.querySelector('[data-slot="item-slot-count"]')
    ).toHaveTextContent("32");

    rerender(<ItemSlot item={{ ...torches, count: 1 }} />);
    expect(
      container.querySelector('[data-slot="item-slot-count"]')
    ).not.toBeInTheDocument();

    rerender(<ItemSlot item={pickaxe} />);
    expect(screen.getByTestId("icon").parentElement).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });

  it("shows durability only while it's worn", () => {
    const { container, rerender } = render(<ItemSlot item={pickaxe} />);
    const bar = container.querySelector('[data-slot="item-slot-durability"]');
    expect(bar?.firstElementChild).toHaveStyle({ "--durability": "40%" });

    rerender(<ItemSlot item={{ ...pickaxe, durability: 1 }} />);
    expect(
      container.querySelector('[data-slot="item-slot-durability"]')
    ).not.toBeInTheDocument();
  });

  it("holds its label as text, which a translation can replace", () => {
    const { rerender } = render(<ItemSlot item={pickaxe} />);
    expect(screen.getByText("Iron Pickaxe, 40% durability")).toHaveClass(
      "sr-only"
    );
    rerender(<ItemSlot item={pickaxe} label="Pioche en fer" />);
    expect(screen.getByText("Pioche en fer")).toBeInTheDocument();
    rerender(<ItemSlot />);
    expect(screen.getByText("Empty slot")).toBeInTheDocument();
  });

  it("marks its states", () => {
    render(<ItemSlot data-testid="slot" disabled selected size="lg" />);
    const slot = screen.getByTestId("slot");
    expect(slot).toHaveAttribute("data-selected");
    expect(slot).toHaveAttribute("data-disabled");
    expect(slot).toHaveAttribute("data-empty");
    expect(slot).toHaveAttribute("data-size", "lg");
  });

  it("renders as a button, named by its item", async () => {
    let pressed = 0;
    const user = userEvent.setup();
    render(
      <ItemSlot
        item={torches}
        onClick={() => {
          pressed += 1;
        }}
        render={<button type="button" />}
      />
    );
    await user.click(screen.getByRole("button", { name: "Torch, 32" }));
    expect(pressed).toBe(1);
  });
});

describe("ItemTooltip", () => {
  it("shows the name and description on keyboard focus", async () => {
    const user = userEvent.setup();
    render(
      <ItemTooltip item={pickaxe}>
        <ItemSlot item={pickaxe} render={<button type="button" />} />
      </ItemTooltip>
    );
    await user.tab();
    expect(await screen.findByText("Mines stone and ore.")).toBeInTheDocument();
  });

  it("adds nothing to an empty slot", () => {
    render(
      <ItemTooltip item={null}>
        <ItemSlot data-testid="slot" />
      </ItemTooltip>
    );
    expect(screen.getByTestId("slot")).toBeInTheDocument();
  });
});
