import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge, badgeVariants } from "./badge";

describe("Badge", () => {
  it("defaults to the neutral tag", () => {
    render(<Badge>Owner</Badge>);
    const badge = screen.getByText("Owner");
    expect(badge).toHaveAttribute("data-variant", "neutral");
    expect(badge).toHaveClass("bg-craft-tag-neutral");
  });

  it.each(["primary", "info", "warning", "destructive", "accent"] as const)(
    "has a %s variant",
    (variant) => {
      render(<Badge variant={variant}>Tag</Badge>);
      expect(screen.getByText("Tag")).toHaveClass(`bg-craft-tag-${variant}`);
    }
  );

  it("styles other elements, such as a link", () => {
    expect(badgeVariants({ size: "sm", variant: "info" })).toContain(
      "bg-craft-tag-info"
    );
  });
});
