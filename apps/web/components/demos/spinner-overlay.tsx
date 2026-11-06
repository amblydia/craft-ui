"use client";

import { useState } from "react";
import { Button } from "@/components/craft/button";
import {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelTitle,
} from "@/components/craft/panel";
import { LoadingOverlay } from "@/components/craft/spinner";

export function SpinnerOverlay() {
  const [loading, setLoading] = useState(false);

  function refresh() {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <LoadingOverlay label="Refreshing" loading={loading}>
        <Panel framed>
          <PanelHeader>
            <PanelTitle>Lifeboat</PanelTitle>
            <PanelDescription>1,824 players online</PanelDescription>
          </PanelHeader>
          <PanelContent>
            <Button fullWidth size="sm" variant="secondary">
              Join server
            </Button>
          </PanelContent>
        </Panel>
      </LoadingOverlay>
      <Button disabled={loading} onClick={refresh}>
        Refresh
      </Button>
    </div>
  );
}
