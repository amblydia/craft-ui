import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Screen, ScreenBody, ScreenHeader, ScreenSection } from "./screen";

describe("Screen", () => {
  it("names the screen with a heading, and goes back", async () => {
    const onBack = vi.fn();
    const user = userEvent.setup();
    render(
      <Screen background={<span>Sky</span>}>
        <ScreenHeader
          actions={<button type="button">Social</button>}
          onBack={onBack}
          title="Play"
        />
        <ScreenBody>Content</ScreenBody>
      </Screen>
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Play" })
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(onBack).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Social" })).toBeInTheDocument();
  });

  it("hides the background from screen readers", () => {
    const { container } = render(<Screen background={<span>Sky</span>} />);
    expect(
      container.querySelector('[data-slot="screen-background"]')
    ).toHaveAttribute("aria-hidden", "true");
  });

  it("leaves out the back arrow without a handler", () => {
    render(<ScreenHeader title="Play" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("ScreenSection", () => {
  it("is a region named by its title", () => {
    render(
      <ScreenSection
        action={<button type="button">See all</button>}
        title="Top games"
      >
        Games
      </ScreenSection>
    );
    expect(
      screen.getByRole("region", { name: "Top games" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "See all" })).toBeInTheDocument();
  });

  it("marks its tone", () => {
    const { container } = render(
      <ScreenSection title="Received invites" tone="warning" />
    );
    expect(
      container.querySelector('[data-slot="screen-section"]')
    ).toHaveAttribute("data-tone", "warning");
  });
});
