import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ProfileActions,
  ProfileAvatar,
  ProfileDetail,
  ProfileDetails,
  ProfileHeader,
  ProfileIdentity,
  ProfileName,
  ProfilePanel,
  ProfilePreview,
  ProfileStat,
  ProfileStats,
  ProfileStatus,
} from "./profile-panel";

describe("ProfilePanel", () => {
  it("puts the parts together", () => {
    render(
      <ProfilePanel>
        <ProfilePreview />
        <ProfileHeader>
          <ProfileAvatar fallback="AL" />
          <ProfileIdentity>
            <ProfileName>Alex</ProfileName>
            <ProfileStatus status="online" />
          </ProfileIdentity>
        </ProfileHeader>
        <ProfileActions>
          <button type="button">Dressing room</button>
        </ProfileActions>
        <ProfileStats>
          <ProfileStat label="Friends" value={3} />
          <ProfileStat detail="2,950" label="Achievements" value="130" wide />
        </ProfileStats>
        <ProfileDetails>
          <ProfileDetail label="Joined">March 2021</ProfileDetail>
        </ProfileDetails>
      </ProfilePanel>
    );
    expect(screen.getByRole("heading", { name: "Alex" })).toBeInTheDocument();
    expect(screen.getByText("AL")).toBeInTheDocument();
    expect(screen.getByText("Online")).toBeInTheDocument();
    expect(screen.getByText("Friends").tagName).toBe("DT");
    expect(screen.getByText("3").tagName).toBe("DD");
    expect(screen.getByText("Joined").tagName).toBe("DT");
    expect(screen.getByText("March 2021").tagName).toBe("DD");
  });

  it("says the status in words, which can be replaced", () => {
    const { rerender } = render(<ProfileStatus status="away" />);
    expect(screen.getByText("Away")).toHaveAttribute("data-status", "away");
    rerender(<ProfileStatus status="busy">In a game</ProfileStatus>);
    expect(screen.getByText("In a game")).toBeInTheDocument();
  });

  it("shows a plain figure in an empty preview", () => {
    const { container, rerender } = render(<ProfilePreview />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
    rerender(
      <ProfilePreview>
        <svg aria-label="Alex in armor" role="img" />
      </ProfilePreview>
    );
    expect(screen.getByRole("img", { name: "Alex in armor" })).toBeVisible();
  });
});
