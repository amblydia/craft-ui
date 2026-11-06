import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "./popover";

function Example() {
  return (
    <Popover>
      <PopoverTrigger>Seed</PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>World seed</PopoverTitle>
        <PopoverDescription>
          Share it to make the same world.
        </PopoverDescription>
        <input aria-label="Seed value" defaultValue="-4172144997902289642" />
        <PopoverClose>Done</PopoverClose>
      </PopoverContent>
    </Popover>
  );
}

describe("Popover", () => {
  it("opens from its trigger, named by its title", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Seed" }));

    const popover = await screen.findByRole("dialog", { name: "World seed" });
    expect(popover).toHaveAccessibleDescription(
      "Share it to make the same world."
    );
  });

  it("holds interactive content and closes with Escape", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Seed" });
    await user.click(trigger);

    await user.click(
      await screen.findByRole("textbox", { name: "Seed value" })
    );
    expect(screen.getByRole("textbox", { name: "Seed value" })).toHaveFocus();
    await user.keyboard("{Escape}");

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
    expect(trigger).toHaveFocus();
  });

  it("closes from a close button", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Seed" }));
    await user.click(await screen.findByRole("button", { name: "Done" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });
});
