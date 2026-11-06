"use client";

import { useState } from "react";
import { Button } from "@/components/craft/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/craft/select";
import {
  SettingsMenu,
  SettingsNav,
  SettingsNavItem,
  SettingsNavLabel,
  SettingsPanel,
  SettingsRow,
  SettingsSection,
} from "@/components/craft/settings-menu";
import { Slider } from "@/components/craft/slider";
import { Switch } from "@/components/craft/switch";

const defaults = { captions: false, music: 70, speech: true, ui: false };

const graphics = [
  { label: "Fast", value: "fast" },
  { label: "Fancy", value: "fancy" },
];

export function SettingsMenuDemo() {
  const [audio, setAudio] = useState(defaults);

  return (
    <SettingsMenu className="max-w-4xl" defaultValue="accessibility">
      <SettingsNav aria-label="Settings">
        <SettingsNavItem value="accessibility">Accessibility</SettingsNavItem>
        <SettingsNavLabel>Controls</SettingsNavLabel>
        <SettingsNavItem value="keyboard">Keyboard & Mouse</SettingsNavItem>
        <SettingsNavItem disabled value="controller">
          Controller
        </SettingsNavItem>
        <SettingsNavLabel>General</SettingsNavLabel>
        <SettingsNavItem value="video">Video</SettingsNavItem>
      </SettingsNav>

      <SettingsPanel value="accessibility">
        <SettingsSection
          action={
            <Button
              onClick={() => setAudio(defaults)}
              size="sm"
              variant="secondary"
            >
              Reset
            </Button>
          }
          description="Adjust how you hear on-screen text"
          title="Text to speech"
        >
          <SettingsRow
            description="Use your device for text to speech"
            label="Text to speech with device settings"
          >
            <Switch
              checked={audio.speech}
              onCheckedChange={(speech) => setAudio({ ...audio, speech })}
            />
          </SettingsRow>
          <SettingsRow
            description="Hear menu options and other interface elements"
            label="Text to speech for UI"
          >
            <Switch
              checked={audio.ui}
              onCheckedChange={(ui) => setAudio({ ...audio, ui })}
            />
          </SettingsRow>
          <SettingsRow label="Music volume" layout="stacked">
            <Slider
              onValueChange={(music) => setAudio({ ...audio, music })}
              showValue
              value={audio.music}
            />
          </SettingsRow>
          <SettingsRow label="Closed captions">
            <Switch
              checked={audio.captions}
              onCheckedChange={(captions) => setAudio({ ...audio, captions })}
            />
          </SettingsRow>
        </SettingsSection>
      </SettingsPanel>

      <SettingsPanel value="keyboard">
        <SettingsSection title="Mouse">
          <SettingsRow
            description="Swap the up and down look"
            label="Invert Y axis"
          >
            <Switch />
          </SettingsRow>
        </SettingsSection>
      </SettingsPanel>

      <SettingsPanel value="video">
        <SettingsSection title="Graphics">
          <SettingsRow label="Graphics mode">
            <Select defaultValue="fancy" items={graphics}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {graphics.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingsRow>
          <SettingsRow label="Fullscreen">
            <Switch defaultChecked />
          </SettingsRow>
        </SettingsSection>
      </SettingsPanel>
    </SettingsMenu>
  );
}
