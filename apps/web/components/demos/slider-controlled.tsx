"use client";

import { useState } from "react";
import { Button } from "@/components/craft/button";
import { Slider } from "@/components/craft/slider";

export function SliderControlled() {
  const [volume, setVolume] = useState(50);

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Slider
        label="Volume"
        onValueChange={setVolume}
        showValue
        value={volume}
      />
      <Button onClick={() => setVolume(50)} size="sm" variant="secondary">
        Reset
      </Button>
    </div>
  );
}
