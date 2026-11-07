"use client";

import { useState } from "react";
import { ConfirmationDialog } from "@/components/craft/blocks/confirmation-dialog";
import { Button } from "@/components/craft/button";

export function ConfirmationDialogDemo() {
  const [deleted, setDeleted] = useState(false);

  return (
    <div className="bg-craft-background flex flex-col items-center justify-center gap-3">
      <ConfirmationDialog
        acknowledgement="I understand this can't be undone"
        confirmLabel="Delete world"
        description="Riverside and everything in it will be deleted from this device, including its backups."
        destructive
        onConfirm={() => setDeleted(true)}
        title='Delete "Riverside"?'
        trigger={
          <Button disabled={deleted} variant="destructive">
            Delete Riverside
          </Button>
        }
      />
      <p
        aria-live="polite"
        className="font-craft-body text-craft-text-muted text-sm"
      >
        {deleted ? "Riverside was deleted." : "Riverside is still here."}
      </p>
    </div>
  );
}
