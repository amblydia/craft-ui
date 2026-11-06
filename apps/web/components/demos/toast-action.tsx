"use client";

import { Button } from "@/components/craft/button";
import { ToastProvider, useToast } from "@/components/craft/toast";

function DeleteButton() {
  const toast = useToast();

  function remove() {
    const id = toast.add({
      actionProps: {
        children: "Undo",
        onClick: () => {
          toast.close(id);
          toast.add({ title: "Screenshot restored", type: "success" });
        },
      },
      title: "Screenshot deleted",
    });
  }

  return (
    <Button onClick={remove} variant="destructive">
      Delete screenshot
    </Button>
  );
}

export function ToastAction() {
  return (
    <ToastProvider>
      <DeleteButton />
    </ToastProvider>
  );
}
