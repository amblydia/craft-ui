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
  DialogTrigger,
} from "@/components/craft/dialog";

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive" />}>
        Delete world
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete world?</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            Harbor will be gone for good. This can't be undone.
          </DialogDescription>
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="secondary" />}>
            Keep world
          </DialogClose>
          <DialogClose render={<Button variant="destructive" />}>
            Delete
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
