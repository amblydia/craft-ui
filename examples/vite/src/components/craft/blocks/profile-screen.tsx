"use client";

import type { ComponentProps, ReactNode } from "react";
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
  type ProfileStatusValue,
} from "@/components/craft/profile-panel";
import {
  Screen,
  ScreenBody,
  ScreenHeader,
  ScreenSection,
} from "@/components/craft/screen";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/craft/tabs";
import { cn } from "@/lib/utils";

export interface Achievement {
  description: string;
  /** A small picture. It's decorative. */
  icon?: ReactNode;
  id: string;
  /** The points it's worth. */
  points?: number;
  title: string;
}

export interface Profile {
  /** The avatar's image address. */
  avatar?: string;
  /** Shown while the avatar loads or if it fails, such as initials. */
  avatarFallback?: string;
  name: string;
  /** A picture of the player or their character. */
  preview?: ReactNode;
  status: ProfileStatusValue;
}

export interface ProfileScreenProps
  extends Omit<ComponentProps<"div">, "children" | "title"> {
  /** Buttons under the player's name, such as Dressing room. */
  actions?: ReactNode;
  /** Fills the screen behind the content. */
  background?: ReactNode;
  /** Recently completed achievements, under a green heading. */
  completed?: Achievement[];
  /** Other facts, as label and value pairs, on the Stats tab. */
  details?: { label: string; value: ReactNode }[];
  /** Called by the back arrow. Without it, there is no back arrow. */
  onBack?: () => void;
  profile: Profile;
  /** Statistics as tiles, such as friends and followers. */
  stats?: {
    detail?: ReactNode;
    icon?: ReactNode;
    label: string;
    value: ReactNode;
    wide?: boolean;
  }[];
  /** Achievements to try next, under a blue heading. */
  suggested?: Achievement[];
  /** The screen's name, in the bar along the top. */
  title?: string;
}

/**
 * Ore UI's profile screen: the player's preview, name, status and actions on
 * the left, and their statistics and achievements on the right, in tabs.
 */
export function ProfileScreen({
  actions,
  background,
  className,
  completed = [],
  details = [],
  onBack,
  profile,
  stats = [],
  suggested = [],
  title = "Profile",
  ...props
}: ProfileScreenProps) {
  return (
    <Screen
      background={background}
      className={cn("min-h-[40rem]", className)}
      data-slot="profile-screen"
      {...props}
    >
      <ScreenHeader onBack={onBack} title={title} />
      <ScreenBody>
        <div className="grid items-start gap-6 @3xl/screen:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          <ProfilePanel>
            <ProfilePreview>{profile.preview}</ProfilePreview>
            <ProfileHeader>
              <ProfileAvatar
                fallback={profile.avatarFallback}
                src={profile.avatar}
              />
              <ProfileIdentity>
                <ProfileName>{profile.name}</ProfileName>
                <ProfileStatus status={profile.status} />
              </ProfileIdentity>
            </ProfileHeader>
            {actions ? <ProfileActions>{actions}</ProfileActions> : null}
          </ProfilePanel>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
            <TabsContent className="flex flex-col gap-6" value="overview">
              {stats.length > 0 ? (
                <ProfileStats className="border-craft-outline border-(length:--craft-unit)">
                  {stats.map((stat) => (
                    <ProfileStat key={stat.label} {...stat} />
                  ))}
                </ProfileStats>
              ) : null}
              {suggested.length > 0 ? (
                <ScreenSection title="Suggested next achievements" tone="info">
                  <AchievementList achievements={suggested} />
                </ScreenSection>
              ) : null}
              {completed.length > 0 ? (
                <ScreenSection
                  title="Recently completed achievements"
                  tone="primary"
                >
                  <AchievementList achievements={completed} />
                </ScreenSection>
              ) : null}
            </TabsContent>
            <TabsContent value="stats">
              <ProfilePanel>
                <ProfileDetails>
                  {details.map((detail) => (
                    <ProfileDetail key={detail.label} label={detail.label}>
                      {detail.value}
                    </ProfileDetail>
                  ))}
                </ProfileDetails>
              </ProfilePanel>
            </TabsContent>
          </Tabs>
        </div>
      </ScreenBody>
    </Screen>
  );
}

const points = new Intl.NumberFormat();

function AchievementList({ achievements }: { achievements: Achievement[] }) {
  return (
    <ul className="bg-craft-outline border-craft-outline flex flex-col gap-(--craft-unit) border-(length:--craft-unit)">
      {achievements.map((achievement) => (
        <li
          className="bg-craft-surface flex items-center gap-4 p-3 shadow-[inset_0_var(--craft-unit)_0_var(--craft-surface-hi),inset_0_calc(-1*var(--craft-unit))_0_var(--craft-surface-lo)]"
          key={achievement.id}
        >
          {achievement.icon ? (
            <span
              aria-hidden="true"
              className="border-craft-outline bg-craft-sunken flex size-14 shrink-0 items-center justify-center overflow-hidden border-(length:--craft-unit) [&>img]:size-full [&>img]:[image-rendering:pixelated] [&>svg]:size-10"
            >
              {achievement.icon}
            </span>
          ) : null}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="font-craft-display leading-tight text-(length:--craft-label-size)">
              {achievement.title}
            </p>
            <p className="font-craft-body text-craft-text-muted text-sm">
              {achievement.description}
            </p>
          </div>
          {achievement.points === undefined ? null : (
            <span className="font-craft-display text-craft-text-muted shrink-0 text-(length:--craft-label-size) tabular-nums">
              {points.format(achievement.points)}
              <span className="sr-only"> points</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
