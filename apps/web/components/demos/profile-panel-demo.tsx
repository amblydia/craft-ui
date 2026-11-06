import { Button } from "@/components/craft/button";
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
} from "@/components/craft/profile-panel";
import { GameArt, Scene } from "@/components/demos/game-art";

export function ProfilePanelDemo() {
  return (
    <div className="@container w-full max-w-4xl">
      <div className="grid items-start gap-4 @2xl:grid-cols-[20rem_1fr]">
        <ProfilePanel>
          <ProfilePreview>
            <Scene name="meadow" />
          </ProfilePreview>
          <ProfileHeader>
            <ProfileAvatar fallback="SK" />
            <ProfileIdentity>
              <ProfileName>Skylark</ProfileName>
              <ProfileStatus status="online" />
            </ProfileIdentity>
          </ProfileHeader>
          <ProfileActions>
            <Button variant="secondary">Dressing room</Button>
            <Button aria-label="More" size="icon" variant="secondary">
              <svg
                aria-hidden="true"
                fill="currentColor"
                shapeRendering="crispEdges"
                viewBox="0 0 12 12"
              >
                <path d="M5 1h2v2H5zM5 5h2v2H5zM5 9h2v2H5z" />
              </svg>
            </Button>
          </ProfileActions>
        </ProfilePanel>
        <ProfilePanel>
          <ProfileStats>
            <ProfileStat
              icon={<GameArt name="bread" />}
              label="Friends"
              value="3"
            />
            <ProfileStat label="Followers" value="230" />
            <ProfileStat
              detail="2,950 / 2,960"
              icon={<GameArt name="gem" />}
              label="Achievements"
              value="130 / 131"
              wide
            />
          </ProfileStats>
          <ProfileDetails>
            <ProfileDetail label="Joined">March 2021</ProfileDetail>
            <ProfileDetail label="Favorite mode">Survival</ProfileDetail>
            <ProfileDetail label="Time played">412 hours</ProfileDetail>
          </ProfileDetails>
        </ProfilePanel>
      </div>
    </div>
  );
}
