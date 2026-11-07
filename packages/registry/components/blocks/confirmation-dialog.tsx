"use client";

import { type ReactElement, type ReactNode, useState } from "react";
import { Button } from "@/components/craft/button";
import { Checkbox } from "@/components/craft/checkbox";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/craft/dialog";
import { Panel } from "@/components/craft/panel";

export interface ConfirmationDialogProps {
  /**
   * A sentence the player has to tick before confirming, such as "I
   * understand this can't be undone". Without it, they confirm straight away.
   */
  acknowledgement?: ReactNode;
  /** The label of the button that closes it without doing anything. */
  cancelLabel?: string;
  /** The label of the button that confirms. */
  confirmLabel: string;
  /** What will happen, under the title. */
  description: ReactNode;
  /** Makes the confirm button red, for something that can't be undone. */
  destructive?: boolean;
  /** Called once the player confirms. The dialog then closes. */
  onConfirm: () => void;
  /** Called when it opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Whether it's open, when you control it. */
  open?: boolean;
  /** The question, in the title bar, such as "Delete Riverside?". */
  title: ReactNode;
  /** The element that opens it, such as a `Button`. */
  trigger?: ReactElement;
}

/**
 * A dialog that asks before doing something, laid out as Ore UI's modal: the
 * question in the title bar, what will happen, an optional box to tick, and
 * the actions stacked at the bottom.
 */
export function ConfirmationDialog({
  acknowledgement,
  cancelLabel = "Cancel",
  confirmLabel,
  description,
  destructive = false,
  onConfirm,
  onOpenChange,
  open: openProp,
  title,
  trigger,
}: ConfirmationDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const open = openProp ?? uncontrolledOpen;

  const setOpen = (next: boolean) => {
    setUncontrolledOpen(next);
    // A fresh question each time it opens.
    if (!next) {
      setAcknowledged(false);
    }
    onOpenChange?.(next);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      {trigger ? <DialogTrigger render={trigger} /> : null}
      <DialogContent role="alertdialog">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>{description}</DialogDescription>
        </DialogBody>
        {acknowledgement ? (
          <Panel className="px-(--craft-space) py-3">
            <Checkbox
              checked={acknowledged}
              label={acknowledgement}
              onCheckedChange={(checked) => setAcknowledged(checked === true)}
            />
          </Panel>
        ) : null}
        <DialogFooter className="flex-col sm:flex-col sm:*:flex-none">
          <Button
            disabled={Boolean(acknowledgement) && !acknowledged}
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
            variant={destructive ? "destructive" : "primary"}
          >
            {confirmLabel}
          </Button>
          <DialogClose render={<Button variant="secondary" />}>
            {cancelLabel}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
