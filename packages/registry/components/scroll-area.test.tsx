import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ScrollArea } from "./scroll-area";

describe("ScrollArea", () => {
  it("renders its content", () => {
    render(<ScrollArea>Worlds</ScrollArea>);
    expect(screen.getByText("Worlds")).toBeVisible();
  });

  it("can be reached by keyboard and is named by its label", async () => {
    const user = userEvent.setup();
    render(<ScrollArea label="Saved worlds">Worlds</ScrollArea>);
    await user.tab();
    expect(screen.getByRole("group", { name: "Saved worlds" })).toHaveFocus();
  });

  it("passes className to the root", () => {
    render(
      <ScrollArea className="h-40" data-testid="area">
        Worlds
      </ScrollArea>
    );
    expect(screen.getByTestId("area")).toHaveClass("h-40");
  });
});
