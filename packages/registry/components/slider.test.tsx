import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Slider } from "./slider";

function Controlled() {
  const [value, setValue] = useState(5);
  return (
    <>
      <Slider aria-label="Level" onValueChange={setValue} value={value} />
      <output>{value}</output>
    </>
  );
}

describe("Slider", () => {
  it("is named by its label and shows its value", () => {
    render(<Slider defaultValue={30} label="Volume" showValue />);
    expect(screen.getByRole("slider", { name: "Volume" })).toHaveAttribute(
      "aria-valuenow",
      "30"
    );
    expect(screen.getByText("30")).toBeVisible();
  });

  it("can be named with aria-label instead", () => {
    render(<Slider aria-label="Volume" defaultValue={30} />);
    expect(screen.getByRole("slider", { name: "Volume" })).toBeVisible();
  });

  it("moves by step from the keyboard, within its range", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Slider
        aria-label="Render distance"
        defaultValue={10}
        max={12}
        min={2}
        onValueChange={onValueChange}
        step={2}
      />
    );

    const thumb = screen.getByRole("slider");
    await user.tab();
    expect(thumb).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(thumb).toHaveAttribute("aria-valuenow", "12");
    await user.keyboard("{ArrowRight}");
    expect(thumb).toHaveAttribute("aria-valuenow", "12");
    await user.keyboard("{Home}");
    expect(thumb).toHaveAttribute("aria-valuenow", "2");
    expect(onValueChange).toHaveBeenCalled();
  });

  it("works controlled", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("status")).toHaveTextContent("6");
  });

  it("does not move when disabled", async () => {
    const user = userEvent.setup();
    render(<Slider aria-label="Level" defaultValue={5} disabled />);
    expect(screen.getByRole("slider")).toBeDisabled();
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "5");
  });
});
