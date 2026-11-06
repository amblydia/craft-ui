import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Radio, RadioGroup } from "./radio-group";

function Example({
  onValueChange,
  orientation,
}: {
  onValueChange?: (value: unknown) => void;
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <RadioGroup
      aria-label="Difficulty"
      defaultValue="normal"
      onValueChange={onValueChange}
      orientation={orientation}
    >
      <Radio label="Peaceful" value="peaceful" />
      <Radio label="Normal" value="normal" />
      <Radio disabled label="Hardcore" value="hardcore" />
      <Radio label="Hard" value="hard" />
    </RadioGroup>
  );
}

describe("RadioGroup", () => {
  it("starts on its default and changes by pointer, label included", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Example onValueChange={onValueChange} />);
    expect(screen.getByRole("radio", { name: "Normal" })).toBeChecked();

    await user.click(screen.getByText("Peaceful"));
    expect(screen.getByRole("radio", { name: "Peaceful" })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith("peaceful", expect.anything());
  });

  it("moves with the arrow keys and skips disabled options", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    expect(screen.getByRole("radio", { name: "Normal" })).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Hard" })).toHaveFocus();
    expect(screen.getByRole("radio", { name: "Hard" })).toBeChecked();
  });

  it("doesn't select a disabled option", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByText("Hardcore"));
    expect(screen.getByRole("radio", { name: "Hardcore" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Normal" })).toBeChecked();
  });

  it("marks its layout", () => {
    render(<Example orientation="horizontal" />);
    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "data-orientation",
      "horizontal"
    );
  });

  it("shows the gem only on the selected option", () => {
    render(<Example />);
    expect(
      document.querySelectorAll('[data-slot="radio-indicator"]')
    ).toHaveLength(1);
  });
});
