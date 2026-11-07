"use client";

import { useState } from "react";
import {
  type SettingsCategory,
  SettingsScreen,
  type SettingValue,
} from "@/components/craft/blocks/settings-screen";

const defaults: Record<string, SettingValue> = {
  captions: false,
  fov: 70,
  graphics: "fancy",
  invertY: false,
  music: 80,
  sensitivity: 50,
  speech: true,
  updates: "wifi",
};

export function SettingsScreenDemo() {
  const [values, setValues] = useState(defaults);
  const [status, setStatus] = useState("");

  const categories: SettingsCategory[] = [
    {
      id: "accessibility",
      label: "Accessibility",
      sections: [
        {
          description: "Adjust how you hear on-screen text",
          settings: [
            {
              description: "Use your device for text to speech",
              id: "speech",
              label: "Text to speech",
              type: "switch",
            },
            { id: "captions", label: "Closed captions", type: "switch" },
          ],
          title: "Text to speech",
        },
      ],
    },
    {
      group: "Controls",
      id: "mouse",
      label: "Keyboard & Mouse",
      sections: [
        {
          settings: [
            { id: "sensitivity", label: "Mouse sensitivity", type: "slider" },
            {
              description: "Swap the up and down look",
              id: "invertY",
              label: "Invert Y axis",
              type: "switch",
            },
          ],
          title: "Mouse",
        },
      ],
    },
    {
      group: "General",
      id: "video",
      label: "Video",
      sections: [
        {
          settings: [
            {
              id: "graphics",
              label: "Graphics",
              options: [
                { label: "Fast", value: "fast" },
                { label: "Fancy", value: "fancy" },
              ],
              type: "select",
            },
            {
              id: "fov",
              label: "Field of view",
              max: 110,
              min: 30,
              type: "slider",
            },
          ],
          title: "Display",
        },
      ],
    },
    {
      group: "General",
      id: "general",
      label: "General",
      sections: [
        {
          settings: [
            { id: "music", label: "Music volume", type: "slider" },
            {
              id: "updates",
              label: "Auto update packs",
              options: [
                { label: "Wi-Fi or data", value: "any" },
                { label: "Wi-Fi only", value: "wifi" },
                { label: "Off", value: "off" },
              ],
              type: "choice",
            },
            {
              actionLabel: "Restart",
              description: "See the tutorial again from the start",
              id: "tutorial",
              label: "Restart tutorial",
              onAction: () => setStatus("Tutorial restarted"),
              type: "button",
            },
          ],
          title: "General",
        },
      ],
    },
  ];

  return (
    <>
      <SettingsScreen
        categories={categories}
        onBack={() => setStatus("Going back")}
        onReset={(category) => {
          const ids = category.sections.flatMap((section) =>
            section.settings.map((setting) => setting.id)
          );
          setValues((current) => ({
            ...current,
            ...Object.fromEntries(
              ids
                .filter((id) => id in defaults)
                .map((id) => [id, defaults[id] as SettingValue])
            ),
          }));
        }}
        onValueChange={(id, value) =>
          setValues((current) => ({ ...current, [id]: value }))
        }
        values={values}
      />
      <output className="sr-only">{status}</output>
    </>
  );
}
