import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  Panel,
  PanelActions,
  PanelContent,
  PanelDescription,
  PanelFooter,
  PanelHeader,
  PanelTitle,
} from "./panel";

const example = (
  <Panel data-testid="panel" variant="raised">
    <PanelHeader>
      <PanelTitle>Profile</PanelTitle>
      <PanelActions>
        <button type="button">Edit</button>
      </PanelActions>
      <PanelDescription>Your details</PanelDescription>
    </PanelHeader>
    <PanelContent>Content</PanelContent>
    <PanelFooter>Footer</PanelFooter>
  </Panel>
);

describe("Panel", () => {
  it("composes its parts in order", () => {
    render(example);
    expect(screen.getByRole("heading", { name: "Profile" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Edit" })).toBeVisible();
    expect(screen.getByText("Your details")).toBeVisible();
    expect(screen.getByTestId("panel").textContent).toBe(
      "ProfileEditYour detailsContentFooter"
    );
  });

  it("applies the variant", () => {
    render(example);
    expect(screen.getByTestId("panel").className).toContain("--craft-raised");
  });

  it("uses the surface variant by default", () => {
    render(<Panel data-testid="panel" />);
    expect(screen.getByTestId("panel").className).toContain("--craft-surface");
  });

  it("renders on the server without a client boundary", () => {
    expect(renderToString(example)).toContain("Profile");
  });
});
