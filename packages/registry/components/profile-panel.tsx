"use client";

import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A player's profile, as in Ore UI's profile screen: a preview, their name and
 * status, actions, and statistics. Put the parts in any order.
 */
export function ProfilePanel({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "border-craft-outline bg-craft-surface text-craft-text flex flex-col border-(length:--craft-unit)",
        className
      )}
      data-slot="profile-panel"
      {...props}
    />
  );
}

function PersonIcon() {
  return (
    <svg
      aria-hidden="true"
      className="text-craft-track size-1/3"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 12 12"
    >
      <path d="M4 0h4v1h1v4H8v1H4V5H3V1h1zM2 7h8v1h1v4H1V8h1z" />
    </svg>
  );
}

/**
 * A space for a picture of the player or their character, such as an `<img>`
 * or your own renderer. CraftUI doesn't draw characters. Empty, it shows a
 * plain figure.
 */
export function ProfilePreview({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-craft-sunken relative flex aspect-[4/3] items-center justify-center overflow-hidden [&>img]:size-full [&>img]:object-cover",
        className
      )}
      data-slot="profile-preview"
      {...props}
    >
      {children ?? <PersonIcon />}
    </div>
  );
}

/** The row with the avatar, name and status. */
export function ProfileHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-(--craft-space) pb-0 [&:last-child]:pb-(--craft-space)",
        className
      )}
      data-slot="profile-header"
      {...props}
    />
  );
}

export interface ProfileAvatarProps
  extends ComponentProps<typeof BaseAvatar.Root> {
  /** The image's description. Leave it empty when the name is beside it. */
  alt?: string;
  /** Shown while the image loads, or if it fails, such as the player's initials. */
  fallback?: ReactNode;
  /** The image's address. */
  src?: string;
}

/** A square picture of the player, with a fallback while it loads or if it fails. */
export function ProfileAvatar({
  alt = "",
  className,
  fallback,
  src,
  ...props
}: ProfileAvatarProps) {
  return (
    <BaseAvatar.Root
      className={cn(
        "border-craft-outline bg-craft-sunken font-craft-display text-craft-text inline-flex size-[calc(var(--craft-unit)*28)] shrink-0 items-center justify-center overflow-hidden border-(length:--craft-unit) text-(length:--craft-label-size) select-none",
        className
      )}
      data-slot="profile-avatar"
      {...props}
    >
      {src ? (
        <BaseAvatar.Image
          alt={alt}
          className="size-full object-cover [image-rendering:pixelated]"
          src={src}
        />
      ) : null}
      <BaseAvatar.Fallback>{fallback}</BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}

/** The player's name and status, beside the avatar. */
export function ProfileIdentity({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex min-w-0 flex-col gap-1", className)}
      data-slot="profile-identity"
      {...props}
    />
  );
}

export function ProfileName({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "font-craft-display truncate leading-tight text-(length:--craft-label-size)",
        className
      )}
      data-slot="profile-name"
      {...props}
    />
  );
}

const statuses = {
  away: { color: "bg-craft-warning", label: "Away" },
  busy: { color: "bg-craft-destructive", label: "Busy" },
  offline: { color: "bg-craft-track", label: "Offline" },
  online: { color: "bg-craft-tag-primary", label: "Online" },
};

export type ProfileStatusValue = keyof typeof statuses;

export interface ProfileStatusProps extends ComponentProps<"span"> {
  /** The words beside the dot. Defaults to the status, such as "Online". */
  children?: ReactNode;
  status: ProfileStatusValue;
}

/** A colored square and the status in words, so it never relies on color. */
export function ProfileStatus({
  children,
  className,
  status,
  ...props
}: ProfileStatusProps) {
  return (
    <span
      className={cn(
        "font-craft-body text-craft-text-muted inline-flex items-center gap-2 text-sm",
        className
      )}
      data-slot="profile-status"
      data-status={status}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "border-craft-outline size-[calc(var(--craft-unit)*6)] shrink-0 border-(length:--craft-unit)",
          statuses[status].color
        )}
      />
      {children ?? statuses[status].label}
    </span>
  );
}

/** A row of buttons, such as Edit profile and More. */
export function ProfileActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 p-(--craft-space) [&>:first-child]:flex-1",
        className
      )}
      data-slot="profile-actions"
      {...props}
    />
  );
}

/** Tiles of statistics, two or more to a row as space allows. */
export function ProfileStats({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        // Tiles share each row, so a short last row leaves no empty cell.
        "bg-craft-outline flex flex-wrap gap-(--craft-unit) *:flex-[1_1_12rem]",
        className
      )}
      data-slot="profile-stats"
      {...props}
    />
  );
}

export interface ProfileStatProps
  extends Omit<ComponentProps<"div">, "children"> {
  /** Something at the far end, such as points earned. */
  detail?: ReactNode;
  /** A small picture before the label. It's decorative. */
  icon?: ReactNode;
  /** What's counted, such as "Friends". */
  label: ReactNode;
  /** The number, such as 230. */
  value: ReactNode;
  /** Takes a whole row. */
  wide?: boolean;
}

/** One statistic: its label over its value, as in Ore UI's profile. */
export function ProfileStat({
  className,
  detail,
  icon,
  label,
  value,
  wide,
  ...props
}: ProfileStatProps) {
  return (
    <div
      className={cn(
        "bg-craft-surface flex flex-wrap items-center gap-3 p-(--craft-space) shadow-[inset_0_var(--craft-unit)_0_var(--craft-surface-hi),inset_0_calc(-1*var(--craft-unit))_0_var(--craft-surface-lo)]",
        wide && "basis-full!",
        className
      )}
      data-slot="profile-stat"
      {...props}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center [&>img]:size-full [&>img]:[image-rendering:pixelated] [&>svg]:size-full"
        >
          {icon}
        </span>
      ) : null}
      {/* Each tile is its own term and value, so the icon and detail can sit beside them. */}
      <dl className="flex min-w-24 flex-1 flex-col gap-1">
        <dt className="font-craft-body text-craft-text-muted text-sm">
          {label}
        </dt>
        <dd className="font-craft-display leading-tight text-(length:--craft-label-size) tabular-nums">
          {value}
        </dd>
      </dl>
      {detail ? (
        <span className="font-craft-display text-craft-text-muted ml-auto leading-tight text-(length:--craft-label-size) tabular-nums">
          {detail}
        </span>
      ) : null}
    </div>
  );
}

/** Other facts as label and value pairs, such as when they joined. */
export function ProfileDetails({ className, ...props }: ComponentProps<"dl">) {
  return (
    <dl
      className={cn(
        "font-craft-body grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 p-(--craft-space) text-sm",
        className
      )}
      data-slot="profile-details"
      {...props}
    />
  );
}

export interface ProfileDetailProps
  extends Omit<ComponentProps<"div">, "children"> {
  children: ReactNode;
  label: ReactNode;
}

export function ProfileDetail({
  children,
  className,
  label,
  ...props
}: ProfileDetailProps) {
  return (
    <div
      className={cn("col-span-full grid grid-cols-subgrid", className)}
      data-slot="profile-detail"
      {...props}
    >
      <dt className="text-craft-text-muted">{label}</dt>
      <dd className="text-craft-text">{children}</dd>
    </div>
  );
}
