"use client";

import { type ComponentProps, type ReactNode, useState } from "react";
import { Button } from "@/components/craft/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/craft/dialog";
import { cn } from "@/lib/utils";

function EditIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-6 shrink-0"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 12 12"
    >
      <path d="M8 1h2v1h1v2h-1v1H9v1H8v1H7v1H6v1H5v1H4v1H1V8h1V7h1V6h1V5h1V4h1V3h1V2h1zM2 9v1h1V9z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-6 shrink-0"
      fill="currentColor"
      shapeRendering="crispEdges"
      viewBox="0 0 12 12"
    >
      <path d="M4 0h4v1h3v2H1V1h3zM2 4h8v8H2zM4 5v6h1V5zM7 5v6h1V5z" />
    </svg>
  );
}

/** The grid of worlds. Put a `WorldCard` in each item. */
export function WorldList({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "grid grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),1fr))] gap-4",
        className
      )}
      data-slot="world-list"
      {...props}
    />
  );
}

export interface WorldCardProps extends Omit<ComponentProps<"li">, "children"> {
  /** The label of the button that closes the confirmation without deleting. */
  cancelLabel?: string;
  /** Extra content under the tags, such as a progress bar. */
  children?: ReactNode;
  /** The label of the delete button, read with the world's name. */
  deleteLabel?: string;
  /** The text of the confirmation, under its title. */
  deleteMessage?: ReactNode;
  /** The label of the edit button. */
  editLabel?: string;
  /** A line about the world, such as when it was last played. */
  meta?: ReactNode;
  /** The world's name. */
  name: string;
  /**
   * Called once the player confirms the delete. Without it, there is no
   * delete button.
   */
  onDelete?: () => void;
  /** Called when Edit is pressed. Without it, there is no edit button. */
  onEdit?: () => void;
  /** Called when the card is pressed, to open the world. */
  onPlay?: () => void;
  /** Read before the name by screen readers, for the button that opens it. */
  playLabel?: string;
  /** Tags, such as `Badge`s for the game mode. */
  tags?: ReactNode;
  /**
   * The world's picture, usually an `<img>` with an empty `alt`. Without one,
   * the card shows a plain landscape.
   */
  thumbnail?: ReactNode;
}

/**
 * A world, as in Ore UI's world list: its picture, name and tags, which open
 * it when pressed, and Edit along the bottom. Delete asks for confirmation
 * first.
 */
export function WorldCard({
  cancelLabel = "Cancel",
  className,
  children,
  deleteLabel = "Delete",
  deleteMessage = "It will be deleted for good. You can't undo this.",
  editLabel = "Edit",
  meta,
  name,
  onDelete,
  onEdit,
  onPlay,
  playLabel = "Play",
  tags,
  thumbnail,
  ...props
}: WorldCardProps) {
  const [confirming, setConfirming] = useState(false);
  const hasFooter = Boolean(onEdit || onDelete);

  return (
    <li
      className={cn(
        "border-craft-outline bg-craft-surface text-craft-text relative flex flex-col border-(length:--craft-unit)",
        "has-[[data-slot=world-card-play]:focus-visible]:craft-focus",
        className
      )}
      data-slot="world-card"
      {...props}
    >
      <div
        aria-hidden="true"
        className="bg-craft-sunken relative aspect-video overflow-hidden [&>img]:size-full [&>img]:object-cover"
        data-slot="world-card-thumbnail"
      >
        {thumbnail ?? (
          // A plain sky, grass and ground, when there's no picture.
          <span className="block size-full bg-[linear-gradient(var(--craft-tag-info)_0_62%,var(--craft-primary)_62%_72%,var(--craft-track)_72%)]" />
        )}
      </div>
      <div
        className="flex flex-1 flex-col gap-2 p-(--craft-space) shadow-[inset_0_var(--craft-unit)_0_var(--craft-surface-hi)]"
        data-slot="world-card-body"
      >
        {onPlay ? (
          <button
            aria-label={`${playLabel} ${name}`}
            className="font-craft-display cursor-pointer text-left leading-tight text-(length:--craft-label-size) outline-none after:absolute after:inset-0 after:content-[''] hover:underline"
            data-slot="world-card-play"
            onClick={onPlay}
            type="button"
          >
            {name}
          </button>
        ) : (
          <span className="font-craft-display leading-tight text-(length:--craft-label-size)">
            {name}
          </span>
        )}
        {tags ? (
          <div className="flex flex-wrap gap-2" data-slot="world-card-tags">
            {tags}
          </div>
        ) : null}
        {meta ? (
          <p className="font-craft-body text-craft-text-muted text-sm">
            {meta}
          </p>
        ) : null}
        {children}
      </div>
      {hasFooter ? (
        // Above the card's link, so that its buttons can be pressed.
        <div
          className="bg-craft-surface relative z-10 flex shadow-[inset_0_calc(var(--craft-unit)*2)_0_var(--craft-surface-lo)]"
          data-slot="world-card-footer"
        >
          {onEdit ? (
            <button
              aria-label={`${editLabel} ${name}`}
              className="font-craft-display hover:bg-craft-hover focus-visible:craft-focus active:bg-craft-active flex h-(--craft-control-md) flex-1 cursor-pointer items-center justify-center gap-2 pt-(--craft-unit) text-(length:--craft-label-size) focus-visible:-outline-offset-2"
              data-slot="world-card-edit"
              onClick={onEdit}
              type="button"
            >
              <EditIcon />
              {editLabel}
            </button>
          ) : null}
          {onDelete ? (
            <button
              aria-label={`${deleteLabel} ${name}`}
              className="text-craft-destructive-text hover:bg-craft-destructive hover:text-craft-destructive-fg focus-visible:craft-focus active:bg-craft-active ml-auto flex size-(--craft-control-md) cursor-pointer items-center justify-center pt-(--craft-unit) focus-visible:-outline-offset-2"
              data-slot="world-card-delete"
              onClick={() => setConfirming(true)}
              type="button"
            >
              <DeleteIcon />
            </button>
          ) : null}
        </div>
      ) : null}
      {onDelete ? (
        <Dialog onOpenChange={setConfirming} open={confirming}>
          <DialogContent role="alertdialog">
            <DialogHeader>
              <DialogTitle>
                {deleteLabel} "{name}"?
              </DialogTitle>
            </DialogHeader>
            <DialogBody>
              <DialogDescription>{deleteMessage}</DialogDescription>
            </DialogBody>
            <DialogFooter>
              <DialogClose render={<Button variant="secondary" />}>
                {cancelLabel}
              </DialogClose>
              <Button
                onClick={() => {
                  setConfirming(false);
                  onDelete();
                }}
                variant="destructive"
              >
                {deleteLabel}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </li>
  );
}
