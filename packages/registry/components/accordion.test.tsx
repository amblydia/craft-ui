import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

function Example({ multiple }: { multiple?: boolean }) {
  return (
    <Accordion multiple={multiple}>
      <AccordionItem value="rules">
        <AccordionTrigger>World rules</AccordionTrigger>
        <AccordionContent>Keep inventory is on.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="players">
        <AccordionTrigger>Players</AccordionTrigger>
        <AccordionContent>Four players have joined.</AccordionContent>
      </AccordionItem>
      <AccordionItem disabled value="locked">
        <AccordionTrigger>Locked</AccordionTrigger>
        <AccordionContent>Hidden</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("Accordion", () => {
  it("expands and collapses an item", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const rules = screen.getByRole("button", { name: "World rules" });
    expect(rules).toHaveAttribute("aria-expanded", "false");

    await user.click(rules);
    expect(rules).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Keep inventory is on.")).toBeVisible();

    await user.click(rules);
    expect(rules).toHaveAttribute("aria-expanded", "false");
  });

  it("opens one item at a time by default", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "World rules" }));
    await user.click(screen.getByRole("button", { name: "Players" }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "World rules" })
      ).toHaveAttribute("aria-expanded", "false")
    );
  });

  it("can open several with `multiple`", async () => {
    const user = userEvent.setup();
    render(<Example multiple />);
    await user.click(screen.getByRole("button", { name: "World rules" }));
    await user.click(screen.getByRole("button", { name: "Players" }));

    expect(screen.getByRole("button", { name: "World rules" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByRole("button", { name: "Players" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("works from the keyboard, and not when disabled", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "World rules" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    await user.click(screen.getByRole("button", { name: "Locked" }));
    expect(screen.getByRole("button", { name: "Locked" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });
});
