"use client";

import { type CSSProperties, useState } from "react";
import { Button } from "@/components/craft/button";
import { Checkbox } from "@/components/craft/checkbox";
import { Input } from "@/components/craft/input";
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/components/craft/panel";
import { Slider } from "@/components/craft/slider";
import { Switch } from "@/components/craft/switch";

const accents = [
  { hi: "#639d52", label: "Green", lo: "#4f913c", value: "#3c8527" },
  { hi: "#5889ea", label: "Blue", lo: "#4a7fe8", value: "#2e6be5" },
  { hi: "#b980e0", label: "Purple", lo: "#a668d6", value: "#8344b8" },
];

export function ThemeTokens() {
  const [accent, setAccent] = useState(0);
  const [unit, setUnit] = useState(2);
  const [radius, setRadius] = useState(0);
  const selected = accents[accent] ?? accents[0];

  const tokens = {
    "--craft-edge": `${unit * 2}px`,
    "--craft-primary": selected?.value,
    "--craft-primary-hi": selected?.hi,
    "--craft-primary-lo": selected?.lo,
    "--craft-radius": `${radius}px`,
    "--craft-unit": `${unit}px`,
  } as CSSProperties;

  return (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Slider
          label="--craft-unit"
          max={4}
          min={1}
          onValueChange={setUnit}
          showValue
          value={unit}
        />
        <Slider
          label="--craft-radius"
          max={12}
          min={0}
          onValueChange={setRadius}
          showValue
          value={radius}
        />
        <fieldset className="font-craft-display flex flex-wrap items-center gap-2 text-(length:--craft-label-size)">
          <legend className="mb-2">--craft-primary</legend>
          {accents.map((option, index) => (
            <Button
              aria-pressed={index === accent}
              key={option.label}
              onClick={() => setAccent(index)}
              size="sm"
              variant={index === accent ? "secondary" : "outline"}
            >
              {option.label}
            </Button>
          ))}
        </fieldset>
      </div>
      <div style={tokens}>
        <Panel>
          <PanelHeader>
            <PanelTitle>Preview</PanelTitle>
          </PanelHeader>
          <PanelContent className="flex flex-col gap-4">
            <Input aria-label="World name" placeholder="World name" />
            <Checkbox defaultChecked label="Show coordinates" />
            <Switch defaultChecked label="Music" />
            <Button fullWidth>Play</Button>
          </PanelContent>
        </Panel>
      </div>
    </div>
  );
}
