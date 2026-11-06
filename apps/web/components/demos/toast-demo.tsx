"use client";

import { Button } from "@/components/craft/button";
import { ToastProvider, useToast } from "@/components/craft/toast";

function Buttons() {
  const toast = useToast();

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button
        onClick={() =>
          toast.add({
            description: "Harbor was backed up to the cloud.",
            title: "World saved",
            type: "success",
          })
        }
      >
        Success
      </Button>
      <Button
        onClick={() =>
          toast.add({
            description: "The server didn't answer. Try again later.",
            title: "Couldn't connect",
            type: "error",
          })
        }
        variant="destructive"
      >
        Error
      </Button>
      <Button
        onClick={() =>
          toast.add({
            title: "Your storage is almost full",
            type: "warning",
          })
        }
        variant="secondary"
      >
        Warning
      </Button>
      <Button
        onClick={() =>
          toast.add({
            description: "A new version is ready to install.",
            title: "Update available",
            type: "info",
          })
        }
        variant="secondary"
      >
        Information
      </Button>
    </div>
  );
}

export function ToastDemo() {
  return (
    <ToastProvider>
      <Buttons />
    </ToastProvider>
  );
}
