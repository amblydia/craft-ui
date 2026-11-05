import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";
import { buttonVariants } from "./button-variants";

describe("Button", () => {
  it("renders a button that does not submit forms by default", () => {
    render(<Button>Play</Button>);
    expect(screen.getByRole("button", { name: "Play" })).toHaveAttribute(
      "type",
      "button"
    );
  });

  it("fires onClick by pointer and keyboard", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Play</Button>);

    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("does not fire when disabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button disabled onClick={onClick}>
        Play
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("blocks clicks but keeps focus while loading", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>
    );

    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("aria-busy", "true");

    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("only greys out when disabled, not while loading", () => {
    const { rerender } = render(<Button loading>Save</Button>);
    expect(screen.getByRole("button").className).not.toContain(
      "--craft-disabled"
    );
    rerender(<Button disabled>Save</Button>);
    expect(screen.getByRole("button").className).toContain("--craft-disabled");
  });

  it("applies variant and size styles, and className wins conflicts", () => {
    render(
      <Button className="px-1" size="lg" variant="destructive">
        Delete
      </Button>
    );
    const { className } = screen.getByRole("button");
    expect(className).toContain("--craft-destructive");
    expect(className).toContain("h-(--craft-control-lg)");
    expect(className).toContain("px-1");
    expect(className).not.toContain("px-[calc");
  });

  it("stretches with fullWidth", () => {
    render(<Button fullWidth>Play</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });

  it("renders leading and trailing icons around the label", () => {
    render(
      <Button
        leadingIcon={<svg data-testid="leading" />}
        trailingIcon={<svg data-testid="trailing" />}
      >
        Play
      </Button>
    );
    const button = screen.getByRole("button");
    expect(button.firstElementChild).toBe(screen.getByTestId("leading"));
    expect(button.lastElementChild).toBe(screen.getByTestId("trailing"));
  });

  it("names an icon-only button with aria-label", () => {
    render(
      <Button aria-label="Settings" size="icon" variant="ghost">
        <svg />
      </Button>
    );
    expect(screen.getByRole("button", { name: "Settings" })).toBeVisible();
  });

  it("exposes its styles for links, which must stay real anchors", () => {
    render(
      <a className={buttonVariants({ variant: "secondary" })} href="/play">
        Play
      </a>
    );
    const link = screen.getByRole("link", { name: "Play" });
    expect(link).toHaveAttribute("href", "/play");
    expect(link.className).toContain("--craft-secondary");
  });

  it("has a hero variant in capitals", () => {
    render(<Button variant="hero">Play</Button>);
    expect(screen.getByRole("button", { name: "Play" }).className).toContain(
      "uppercase"
    );
  });
});
