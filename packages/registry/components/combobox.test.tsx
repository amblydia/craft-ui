import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "./combobox";

const biomes = ["Badlands", "Birch Forest", "Desert", "Jungle", "Taiga"];

function Example({
  onValueChange,
}: {
  onValueChange?: (value: string | null) => void;
}) {
  return (
    <Combobox
      items={biomes}
      onValueChange={(value) => onValueChange?.(value as string | null)}
    >
      <ComboboxLabel>Biome</ComboboxLabel>
      <ComboboxInput placeholder="Search biomes" showClear />
      <ComboboxContent>
        <ComboboxEmpty>No biomes found.</ComboboxEmpty>
        <ComboboxList>
          {(biome: string) => (
            <ComboboxItem key={biome} value={biome}>
              {biome}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

describe("Combobox", () => {
  it("filters the options as you type", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.type(screen.getByRole("combobox"), "bi");
    await waitFor(() => expect(screen.getAllByRole("option")).toHaveLength(1));
    expect(screen.getByRole("option")).toHaveTextContent("Birch Forest");
  });

  it("says when nothing matches", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.type(screen.getByRole("combobox"), "ocean");
    await waitFor(() =>
      expect(screen.getByText("No biomes found.")).toBeInTheDocument()
    );
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
  });

  it("chooses with the keyboard", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Example onValueChange={onValueChange} />);

    await user.type(screen.getByRole("combobox"), "jun");
    await user.keyboard("{ArrowDown}{Enter}");

    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith("Jungle"));
    expect(screen.getByRole("combobox")).toHaveValue("Jungle");
  });

  it("has a button that shows every option", async () => {
    const user = userEvent.setup();
    render(<Example />);
    // It's out of the tab order: from the keyboard, the input opens the list.
    await user.click(screen.getByLabelText("Show all"));
    await waitFor(() =>
      expect(screen.getAllByRole("option")).toHaveLength(biomes.length)
    );
  });
});
