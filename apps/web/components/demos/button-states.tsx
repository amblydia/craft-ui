"use client";

import { useState } from "react";
import { Button } from "@/components/craft/button";

export function ButtonStates() {
  const [saving, setSaving] = useState(false);

  function save() {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  }

  return (
    <>
      <Button disabled>Disabled</Button>
      <Button disabled variant="secondary">
        Disabled
      </Button>
      <Button loading={saving} onClick={save}>
        {saving ? "Saving" : "Click to save"}
      </Button>
    </>
  );
}
