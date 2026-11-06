import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  SettingsMenu,
  SettingsNav,
  SettingsNavItem,
  SettingsNavLabel,
  SettingsPanel,
  SettingsRow,
  SettingsSection,
} from "./settings-menu";
import { Slider } from "./slider";
import { Switch } from "./switch";

function Example() {
  return (
    <SettingsMenu defaultValue="audio">
      <SettingsNav aria-label="Categories">
        <SettingsNavLabel>General</SettingsNavLabel>
        <SettingsNavItem value="audio">Audio</SettingsNavItem>
        <SettingsNavItem value="video">Video</SettingsNavItem>
        <SettingsNavItem disabled value="creator">
          Creator
        </SettingsNavItem>
      </SettingsNav>
      <SettingsPanel value="audio">
        <SettingsSection
          action={<button type="button">Reset</button>}
          description="How loud each sound is"
          title="Volume"
        >
          <SettingsRow description="Plays music in menus" label="Menu music">
            <Switch />
          </SettingsRow>
          <SettingsRow label="Master volume" layout="stacked">
            <Slider defaultValue={80} />
          </SettingsRow>
        </SettingsSection>
      </SettingsPanel>
      <SettingsPanel value="video">
        <SettingsSection title="Display">
          <SettingsRow label="Fullscreen">
            <Switch />
          </SettingsRow>
        </SettingsSection>
      </SettingsPanel>
    </SettingsMenu>
  );
}

describe("SettingsMenu", () => {
  it("is a vertical tab list of categories", () => {
    render(<Example />);
    const nav = screen.getByRole("tablist", { name: "Categories" });
    expect(nav).toHaveAttribute("aria-orientation", "vertical");
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByRole("tab", { name: "Audio" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    // Group labels are for sight only: a tab list holds only tabs.
    expect(screen.getByText("General")).toHaveAttribute("aria-hidden", "true");
  });

  it("changes category as the arrow keys move", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("tab", { name: "Audio" }));
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("tab", { name: "Video" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Video" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(
      screen.getByRole("switch", { name: "Fullscreen" })
    ).toBeInTheDocument();
  });

  it("names each section after its title", () => {
    render(<Example />);
    expect(screen.getByRole("region", { name: "Volume" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  });

  it("labels and describes the control in each row", () => {
    render(<Example />);
    const music = screen.getByRole("switch", { name: "Menu music" });
    expect(music).toHaveAccessibleDescription("Plays music in menus");
    expect(
      screen.getByRole("slider", { name: "Master volume" })
    ).toBeInTheDocument();
  });

  it("marks the row's layout", () => {
    render(<Example />);
    expect(
      screen.getByText("Master volume").closest('[data-slot="settings-row"]')
    ).toHaveAttribute("data-layout", "stacked");
  });
});
