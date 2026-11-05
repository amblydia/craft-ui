"use client";

import { useState } from "react";
import { Switch } from "@/components/craft/switch";

export function SwitchControlled() {
  const [music, setMusic] = useState(true);

  return (
    <div className="flex flex-col gap-2">
      <Switch checked={music} label="Music" onCheckedChange={setMusic} />
      <p className="text-sm">Music is {music ? "on" : "off"}.</p>
    </div>
  );
}
