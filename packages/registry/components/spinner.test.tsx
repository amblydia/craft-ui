import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LoadingOverlay, Spinner } from "./spinner";

describe("Spinner", () => {
  it("is announced as a status, with its label hidden by default", () => {
    render(<Spinner label="Loading worlds" />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Loading worlds");
    expect(screen.getByText("Loading worlds")).toHaveClass("sr-only");
  });

  it("can show its label", () => {
    render(<Spinner showLabel />);
    expect(screen.getByText("Loading")).not.toHaveClass("sr-only");
  });
});

describe("LoadingOverlay", () => {
  it("covers its content and blocks it while loading", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <LoadingOverlay label="Joining server" loading>
        <button onClick={onClick} type="button">
          Join
        </button>
      </LoadingOverlay>
    );
    expect(screen.getByRole("status")).toHaveTextContent("Joining server");
    expect(
      document.querySelector('[data-slot="loading-overlay"]')
    ).toHaveAttribute("aria-busy", "true");

    // The content is inert, so it can't be reached while loading. jsdom
    // doesn't apply inert, so the browser tests check its effect.
    expect(screen.getByText("Join").parentElement).toHaveAttribute("inert");

    rerender(
      <LoadingOverlay label="Joining server" loading={false}>
        <button onClick={onClick} type="button">
          Join
        </button>
      </LoadingOverlay>
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Join" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
