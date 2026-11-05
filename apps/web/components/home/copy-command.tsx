"use client";

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/craft/button";

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="border-craft-outline bg-craft-field flex w-full max-w-xl items-center gap-2 border-2 py-1.5 pr-1.5 pl-3 shadow-[inset_0_4px_0_var(--craft-field-shade)]">
      <code className="text-craft-text min-w-0 flex-1 overflow-x-auto py-2 font-mono text-sm whitespace-nowrap">
        {command}
      </code>
      <Button
        aria-label={copied ? "Copied" : "Copy the command"}
        onClick={copy}
        size="icon"
        variant="secondary"
      >
        <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} />
      </Button>
    </div>
  );
}
