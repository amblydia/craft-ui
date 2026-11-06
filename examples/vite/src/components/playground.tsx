"use client";

import { type ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/craft/button";
import { Checkbox } from "@/components/craft/checkbox";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/craft/dialog";
import { Input } from "@/components/craft/input";
import {
  Panel,
  PanelActions,
  PanelContent,
  PanelDescription,
  PanelFooter,
  PanelHeader,
  PanelTitle,
} from "@/components/craft/panel";
import { Progress } from "@/components/craft/progress";
import { ScrollArea } from "@/components/craft/scroll-area";
import { Separator } from "@/components/craft/separator";
import { Slider } from "@/components/craft/slider";
import { Switch } from "@/components/craft/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/craft/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/craft/tooltip";

const worlds = [
  "Harbor",
  "Old Quarry",
  "Sunken Keep",
  "North Ridge",
  "Marsh Camp",
  "Red Canyon",
  "Frost Hollow",
  "Lantern Bay",
];

/** Every core component together, in the shape of a settings screen. */
export function SettingsPanel({ actions }: { actions?: ReactNode }) {
  const [volume, setVolume] = useState(60);

  return (
    <Panel framed>
      <PanelHeader>
        <PanelTitle>Settings</PanelTitle>
        {actions ? <PanelActions>{actions}</PanelActions> : null}
        <PanelDescription>
          Every CraftUI core component, installed with the shadcn CLI.
        </PanelDescription>
      </PanelHeader>
      <PanelContent className="flex flex-col gap-6">
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger disabled value="locked">
              Locked
            </TabsTrigger>
          </TabsList>
          <TabsContent className="flex flex-col gap-4" value="general">
            <Input aria-label="World name" placeholder="World name" />
            <Checkbox defaultChecked label="Show coordinates" />
            <Checkbox indeterminate label="Some packs enabled" />
          </TabsContent>
          <TabsContent className="flex flex-col gap-4" value="audio">
            <Slider
              label="Volume"
              onValueChange={setVolume}
              showValue
              value={volume}
            />
            <Switch defaultChecked label="Mute in the background" />
          </TabsContent>
        </Tabs>

        <Separator />

        <Progress label="Loading world" showValue value={volume} />
        <Progress aria-label="Connecting" value={null} />

        <ScrollArea className="h-40" label="Saved worlds">
          <ul className="font-craft-display flex flex-col gap-2 p-3 text-(length:--craft-label-size)">
            {worlds.map((world) => (
              <li key={world}>{world}</li>
            ))}
          </ul>
        </ScrollArea>
      </PanelContent>
      <PanelFooter>
        <Dialog>
          <DialogTrigger render={<Button variant="destructive" />}>
            Delete world
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete world?</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <DialogDescription>
                This can't be undone. Your world will be gone for good.
              </DialogDescription>
            </DialogBody>
            <DialogFooter>
              <DialogClose render={<Button variant="secondary" />}>
                Keep it
              </DialogClose>
              <DialogClose render={<Button variant="destructive" />}>
                Delete
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Tooltip>
          <TooltipTrigger render={<Button variant="secondary" />}>
            Help
          </TooltipTrigger>
          <TooltipContent>Opens the manual</TooltipContent>
        </Tooltip>
        <Button>Save</Button>
      </PanelFooter>
    </Panel>
  );
}

/** A whole page for an example app, with its own light and dark switch. */
export function Playground() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <main className="bg-craft-background text-craft-text min-h-screen p-6">
      <SettingsPanel
        actions={
          <Switch checked={dark} label="Dark mode" onCheckedChange={setDark} />
        }
      />
    </main>
  );
}
