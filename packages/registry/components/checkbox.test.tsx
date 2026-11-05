import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("toggles when the box is clicked", async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    render(<Checkbox aria-label="Sound" onCheckedChange={onCheckedChange} />);

    const box = screen.getByRole("checkbox", { name: "Sound" });
    expect(box).toHaveAttribute("aria-checked", "false");
    await user.click(box);
    expect(box).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("toggles when its label is clicked", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Sound" />);
    await user.click(screen.getByText("Sound"));
    expect(screen.getByRole("checkbox", { name: "Sound" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("toggles with the space key", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Sound" />);
    await user.tab();
    expect(screen.getByRole("checkbox")).toHaveFocus();
    await user.keyboard(" ");
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("reports the indeterminate state as mixed", () => {
    render(<Checkbox aria-label="All" indeterminate />);
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "mixed"
    );
  });

  it("stays put when disabled", async () => {
    const user = userEvent.setup();
    render(<Checkbox disabled label="Sound" />);
    await user.click(screen.getByText("Sound"));
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "false"
    );
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  it("honors a controlled value", async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="Sound" checked={false} />);
    await user.click(screen.getByRole("checkbox"));
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });
});
