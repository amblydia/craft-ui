"use client";

import { useState } from "react";
import { Checkbox } from "@/components/craft/checkbox";

const packs = ["Textures", "Sounds", "Behaviors"];

export function CheckboxIndeterminate() {
  const [enabled, setEnabled] = useState(["Textures"]);
  const allEnabled = enabled.length === packs.length;

  return (
    <div className="flex flex-col gap-3">
      <Checkbox
        checked={allEnabled}
        indeterminate={enabled.length > 0 && !allEnabled}
        label="All packs"
        onCheckedChange={(checked) => setEnabled(checked ? packs : [])}
      />
      <div className="flex flex-col gap-3 pl-8">
        {packs.map((pack) => (
          <Checkbox
            checked={enabled.includes(pack)}
            key={pack}
            label={pack}
            onCheckedChange={(checked) =>
              setEnabled((current) =>
                checked
                  ? [...current, pack]
                  : current.filter((name) => name !== pack)
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
