import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./switch";

describe("Switch", () => {
  it("toggles by pointer and reports the change", async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    render(<Switch aria-label="Music" onCheckedChange={onCheckedChange} />);

    const control = screen.getByRole("switch", { name: "Music" });
    await user.click(control);
    expect(control).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("toggles from its label", async () => {
    const user = userEvent.setup();
    render(<Switch label="Music" />);
    await user.click(screen.getByText("Music"));
    expect(screen.getByRole("switch", { name: "Music" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("toggles from the keyboard", async () => {
    const user = userEvent.setup();
    render(<Switch defaultChecked label="Music" />);
    await user.tab();
    expect(screen.getByRole("switch")).toHaveFocus();
    await user.keyboard(" ");
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("stays put when disabled", async () => {
    const user = userEvent.setup();
    render(<Switch disabled label="Music" />);
    await user.click(screen.getByText("Music"));
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("switch")).toHaveAttribute("aria-disabled", "true");
  });

  it("applies className to the label wrapper when there is a label", () => {
    render(<Switch className="m-4" label="Music" />);
    expect(screen.getByText("Music")).toHaveClass("m-4");
  });
});
