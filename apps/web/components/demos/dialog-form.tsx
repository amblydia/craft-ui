"use client";

import { useState } from "react";
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
import { Input } from "@/components/craft/input";

export function DialogForm() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={<Button />}>Create world</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create world</DialogTitle>
        </DialogHeader>
        <form
          className="contents"
          onSubmit={(event) => {
            event.preventDefault();
            setOpen(false);
          }}
        >
          <DialogBody>
            <DialogDescription>Give your new world a name.</DialogDescription>
            <Input aria-label="World name" placeholder="World name" required />
            <Checkbox label="Public world" />
          </DialogBody>
          <DialogFooter>
            <DialogClose render={<Button variant="secondary" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
