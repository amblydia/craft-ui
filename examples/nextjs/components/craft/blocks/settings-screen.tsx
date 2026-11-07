"use client";

import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/craft/button";
import { Screen, ScreenBody, ScreenHeader } from "@/components/craft/screen";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/craft/tabs";
import { cn } from "@/lib/utils";

interface BaseSetting {
  description?: ReactNode;
  disabled?: boolean;
  /** The key of its value in `values`. */
  id: string;
  label: ReactNode;
}

interface Option {
  label: string;
  value: string;
}

/** One setting, by the control it uses. */
export type Setting =
  | (BaseSetting & { type: "switch" })
  | (BaseSetting & {
      max?: number;
      min?: number;
      step?: number;
      type: "slider";
    })
  | (BaseSetting & { options: Option[]; type: "select" })
  /** A row of choices, as Ore UI's toggle buttons. */
  | (BaseSetting & { options: Option[]; type: "choice" })
  | (BaseSetting & {
      actionLabel: string;
      onAction: () => void;
      type: "button";
    });

export interface SettingsCategory {
  /** The group label it sits under in the sidebar, such as "Controls". */
  group?: string;
  /** A small picture before its name. It's decorative. */
  icon?: ReactNode;
  id: string;
  label: string;
  sections: {
    description?: ReactNode;
    settings: Setting[];
    title: ReactNode;
  }[];
}

export type SettingValue = boolean | number | string;

export interface SettingsScreenProps
  extends Omit<
    ComponentProps<"div">,
    "children" | "defaultValue" | "onReset" | "title"
  > {
  /** Fills the screen behind the content. */
  background?: ReactNode;
  /** The categories, in sidebar order, with their settings. */
  categories: SettingsCategory[];
  /** The category shown first. */
  defaultCategory?: string;
  /** Called by the back arrow. Without it, there is no back arrow. */
  onBack?: () => void;
  /**
   * Called by each category's Reset button, with the category. Without it,
   * there are no reset buttons.
   */
  onReset?: (category: SettingsCategory) => void;
  /** Called with a setting's id and its new value. */
  onValueChange: (id: string, value: SettingValue) => void;
  /** The screen's name, in the bar along the top. */
  title?: string;
  /** The current value of every setting, by id. */
  values: Record<string, SettingValue>;
}

/**
 * Ore UI's settings screen, built from a list of categories and settings:
 * switches, sliders, dropdowns, rows of choices and buttons.
 */
export function SettingsScreen({
  background,
  categories,
  className,
  defaultCategory,
  onBack,
  onReset,
  onValueChange,
  title = "Settings",
  values,
  ...props
}: SettingsScreenProps) {
  return (
    <Screen
      background={background}
      className={cn("min-h-[40rem]", className)}
      data-slot="settings-screen"
      {...props}
    >
      <ScreenHeader onBack={onBack} title={title} />
      <ScreenBody>
        <SettingsMenu defaultValue={defaultCategory ?? categories[0]?.id}>
          <SettingsNav aria-label={title}>
            {categories.map((category, index) => (
              <SidebarEntry
                category={category}
                key={category.id}
                previousGroup={categories[index - 1]?.group}
              />
            ))}
          </SettingsNav>
          {categories.map((category) => (
            <SettingsPanel key={category.id} value={category.id}>
              {category.sections.map((section, index) => (
                <SettingsSection
                  action={
                    onReset && index === 0 ? (
                      <Button
                        onClick={() => onReset(category)}
                        size="sm"
                        variant="secondary"
                      >
                        Reset
                      </Button>
                    ) : undefined
                  }
                  description={section.description}
                  // Sections have no ids of their own.
                  // biome-ignore lint/suspicious/noArrayIndexKey: their order is fixed.
                  key={index}
                  title={section.title}
                >
                  {section.settings.map((setting) => (
                    <SettingControl
                      key={setting.id}
                      onValueChange={onValueChange}
                      setting={setting}
                      value={values[setting.id]}
                    />
                  ))}
                </SettingsSection>
              ))}
            </SettingsPanel>
          ))}
        </SettingsMenu>
      </ScreenBody>
    </Screen>
  );
}

function SidebarEntry({
  category,
  previousGroup,
}: {
  category: SettingsCategory;
  previousGroup?: string;
}) {
  return (
    <>
      {category.group && category.group !== previousGroup ? (
        <SettingsNavLabel>{category.group}</SettingsNavLabel>
      ) : null}
      <SettingsNavItem icon={category.icon} value={category.id}>
        {category.label}
      </SettingsNavItem>
    </>
  );
}

function SettingControl({
  onValueChange,
  setting,
  value,
}: {
  onValueChange: (id: string, value: SettingValue) => void;
  setting: Setting;
  value: SettingValue | undefined;
}) {
  const change = (next: SettingValue) => onValueChange(setting.id, next);
  const row = {
    description: setting.description,
    disabled: setting.disabled,
    label: setting.label,
  };

  switch (setting.type) {
    case "switch":
      return (
        <SettingsRow {...row}>
          <Switch
            checked={Boolean(value)}
            disabled={setting.disabled}
            onCheckedChange={change}
          />
        </SettingsRow>
      );
    case "slider":
      return (
        <SettingsRow {...row} layout="stacked">
          <Slider
            disabled={setting.disabled}
            max={setting.max}
            min={setting.min}
            onValueChange={(next) => change(next as number)}
            showValue
            step={setting.step}
            value={Number(value ?? setting.min ?? 0)}
          />
        </SettingsRow>
      );
    case "select":
      return (
        <SettingsRow {...row}>
          <Select
            disabled={setting.disabled}
            items={setting.options}
            onValueChange={(next) => change(String(next))}
            value={String(value ?? "")}
          >
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {setting.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsRow>
      );
    case "choice":
      return (
        <SettingsRow {...row} layout="stacked">
          <Tabs
            onValueChange={(next) => change(String(next))}
            value={String(value ?? "")}
          >
            <TabsList activateOnFocus variant="segmented">
              {setting.options.map((option) => (
                <TabsTrigger
                  disabled={setting.disabled}
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </SettingsRow>
      );
    case "button":
      return (
        <SettingsRow {...row}>
          <Button
            disabled={setting.disabled}
            onClick={setting.onAction}
            size="sm"
            variant="secondary"
          >
            {setting.actionLabel}
          </Button>
        </SettingsRow>
      );
    default:
      return null;
  }
}
