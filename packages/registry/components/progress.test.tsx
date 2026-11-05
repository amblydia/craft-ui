import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress } from "./progress";

describe("Progress", () => {
  it("exposes a determinate value", () => {
    render(<Progress label="Loading" value={40} />);
    const bar = screen.getByRole("progressbar", { name: "Loading" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("has no value when indeterminate", () => {
    render(<Progress aria-label="Connecting" value={null} />);
    const bar = screen.getByRole("progressbar", { name: "Connecting" });
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar.querySelector("[data-indeterminate]")).toBeInTheDocument();
  });

  it("shows the value when asked", () => {
    render(<Progress aria-label="Loading" showValue value={40} />);
    expect(screen.getByText("40%")).toBeVisible();
  });

  it("selects a tone", () => {
    render(<Progress aria-label="Loading" tone="warning" value={40} />);
    expect(screen.getByRole("progressbar").getAttribute("style")).toContain(
      "var(--craft-warning)"
    );
  });

  it("lets a custom color override the tone", () => {
    render(<Progress aria-label="Loading" color="#ff00ff" value={40} />);
    const style = screen.getByRole("progressbar").getAttribute("style");
    expect(style).toContain("#ff00ff");
    expect(style).not.toContain("--craft-info)");
  });

  it("uses the thin bar by default", () => {
    const { container } = render(<Progress aria-label="Thin" value={10} />);
    expect(container.innerHTML).toContain("h-[calc(var(--craft-unit)*2)]");
    expect(container.innerHTML).not.toContain("border-craft-outline");
  });
});
