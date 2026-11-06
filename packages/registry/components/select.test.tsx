import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

const modes = [
  { label: "Survival", value: "survival" },
  { label: "Creative", value: "creative" },
  { label: "Adventure", value: "adventure" },
];

function Example({
  disabled,
  onValueChange,
  variant,
}: {
  disabled?: boolean;
  onValueChange?: (value: string | null) => void;
  variant?: "default" | "sunken";
}) {
  return (
    <Select
      disabled={disabled}
      items={modes}
      onValueChange={(value) => onValueChange?.(value as string | null)}
    >
      <SelectLabel>Game mode</SelectLabel>
      <SelectTrigger variant={variant}>
        <SelectValue placeholder="Choose a mode" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectGroupLabel>Classic</SelectGroupLabel>
          <SelectItem value="survival">Survival</SelectItem>
          <SelectItem value="creative">Creative</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectItem disabled value="adventure">
          Adventure
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

describe("Select", () => {
  it("shows the placeholder until something is chosen", () => {
    render(<Example />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Choose a mode");
  });

  it("opens by pointer and shows the chosen label", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Example onValueChange={onValueChange} />);

    await user.click(screen.getByRole("combobox"));
    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("Classic")).toBeInTheDocument();
    await user.click(screen.getByRole("option", { name: "Creative" }));

    await waitFor(() =>
      expect(screen.getByRole("combobox")).toHaveTextContent("Creative")
    );
    expect(onValueChange).toHaveBeenCalledWith("creative");
  });

  it("can be chosen by keyboard", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Example onValueChange={onValueChange} />);

    await user.tab();
    expect(screen.getByRole("combobox")).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    await waitFor(() =>
      expect(screen.getByRole("listbox")).toBeInTheDocument()
    );
    await user.keyboard("{ArrowDown}{Enter}");

    await waitFor(() => expect(onValueChange).toHaveBeenCalled());
    expect(screen.getByRole("combobox")).not.toHaveTextContent("Choose a mode");
  });

  it("doesn't choose a disabled option", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Example onValueChange={onValueChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "Adventure" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("can't be opened when disabled", async () => {
    const user = userEvent.setup();
    render(<Example disabled />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("marks the trigger's variant", () => {
    render(<Example variant="sunken" />);
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "data-variant",
      "sunken"
    );
  });
});
