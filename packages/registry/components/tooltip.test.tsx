import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

function Example() {
  return (
    <TooltipProvider delay={0}>
      <Tooltip>
        <TooltipTrigger>Help</TooltipTrigger>
        <TooltipContent side="right">Opens the manual</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

describe("Tooltip", () => {
  it("stays closed until asked", () => {
    render(<Example />);
    expect(screen.queryByText("Opens the manual")).not.toBeInTheDocument();
  });

  it("opens on hover", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.hover(screen.getByRole("button", { name: "Help" }));
    expect(await screen.findByText("Opens the manual")).toBeInTheDocument();
  });

  it("opens on keyboard focus and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    expect(await screen.findByText("Opens the manual")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByText("Opens the manual")).not.toBeInTheDocument()
    );
  });
});
