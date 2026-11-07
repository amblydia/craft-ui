"use client";

import { Button } from "@/components/craft/button";
import {
  Screen,
  ScreenBody,
  ScreenHeader,
  ScreenSection,
} from "@/components/craft/screen";
import { Scene } from "@/components/demos/game-art";

export function ScreenDemo() {
  return (
    <Screen background={<Scene name="meadow" />}>
      <ScreenHeader
        actions={
          <Button size="sm" variant="secondary">
            Social (1)
          </Button>
        }
        onBack={() => undefined}
        title="Play"
      />
      <ScreenBody>
        <ScreenSection title="Top games">
          <p className="bg-craft-surface font-craft-body p-(--craft-space) text-sm">
            Over a world picture, a section title sits on a dark box.
          </p>
        </ScreenSection>
        <ScreenSection title="Received invites (1)" tone="warning">
          <p className="bg-craft-surface font-craft-body p-(--craft-space) text-sm">
            With a tone, it's a colored tag with a matching rule.
          </p>
        </ScreenSection>
      </ScreenBody>
    </Screen>
  );
}
