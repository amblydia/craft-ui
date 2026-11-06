"use client";

import { useState } from "react";
import { Radio, RadioGroup } from "@/components/craft/radio-group";

export function RadioGroupHorizontal() {
  const [camera, setCamera] = useState("third");

  return (
    <div className="flex flex-col gap-4">
      <RadioGroup
        aria-label="Camera"
        onValueChange={(value) => setCamera(value as string)}
        orientation="horizontal"
        value={camera}
      >
        <Radio label="First person" value="first" />
        <Radio label="Third person" value="third" />
      </RadioGroup>
      <p className="font-craft-body text-craft-text-muted text-sm">
        Camera: {camera === "first" ? "first person" : "third person"}
      </p>
    </div>
  );
}
