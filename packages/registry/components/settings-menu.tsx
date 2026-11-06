"use client";

import { Field as BaseField } from "@base-ui/react/field";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { type ComponentProps, type ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Ore UI's settings screen: categories in a sidebar, and the chosen category's
 * settings beside it. Where there isn't room for both, such as on a phone, the
 * sidebar sits on top. It depends on the space it's given, not the screen.
 */
export function SettingsMenu({
  className,
  ...props
}: ComponentProps<typeof BaseTabs.Root>) {
  return (
    <BaseTabs.Root
      className={cn(
        "text-craft-text flex w-full flex-wrap items-start gap-4",
        className
      )}
      data-slot="settings-menu"
      orientation="vertical"
      {...props}
    />
  );
}

/** The sidebar of categories. The arrow keys move between them. */
export function SettingsNav({
  activateOnFocus = true,
  className,
  ...props
}: ComponentProps<typeof BaseTabs.List>) {
  return (
    <BaseTabs.List
      activateOnFocus={activateOnFocus}
      className={cn(
        // Beside the settings it keeps its 18rem. Once the settings would be
        // squeezed under 60% of the width, it wraps above them, full width.
        "border-craft-outline bg-craft-sunken flex grow basis-72 flex-col border-(length:--craft-unit) py-(--craft-unit)",
        className
      )}
      data-slot="settings-nav"
      {...props}
    />
  );
}

/**
 * A heading between groups of categories, such as "Controls". It's for sighted
 * players: a tab list may only hold tabs, so screen readers skip it.
 */
export function SettingsNavLabel({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "font-craft-body text-craft-text-muted mt-3 px-(--craft-space) pt-2 pb-[calc(var(--craft-unit)*4)] text-sm shadow-[inset_0_calc(-1*var(--craft-unit))_0_var(--craft-sunken-hi),inset_0_calc(-2*var(--craft-unit))_0_var(--craft-outline)] first:mt-0",
        className
      )}
      data-slot="settings-nav-label"
      {...props}
    />
  );
}

export interface SettingsNavItemProps
  extends ComponentProps<typeof BaseTabs.Tab> {
  /** A small picture before the label. It's decorative. */
  icon?: ReactNode;
}

/** A category. Its `value` matches a `SettingsPanel`. */
export function SettingsNavItem({
  children,
  className,
  icon,
  ...props
}: SettingsNavItemProps) {
  return (
    <BaseTabs.Tab
      className={cn(
        "font-craft-display text-craft-text hover:bg-craft-hover focus-visible:craft-focus flex h-(--craft-control-md) w-full cursor-pointer items-center gap-3 px-(--craft-space) text-left text-(length:--craft-label-size) outline-none select-none focus-visible:-outline-offset-2",
        // The selected category is lifted to the surface, as in Ore UI.
        "data-active:bg-craft-surface data-active:shadow-[inset_0_var(--craft-unit)_0_var(--craft-surface-hi),inset_0_calc(-1*var(--craft-unit))_0_var(--craft-surface-lo)]",
        "data-disabled:text-craft-text-muted data-disabled:cursor-not-allowed data-disabled:hover:bg-transparent",
        "[&_img]:size-6 [&_img]:[image-rendering:pixelated] [&_svg]:size-6 [&_svg]:shrink-0",
        className
      )}
      data-slot="settings-nav-item"
      {...props}
    >
      {icon ? (
        <span aria-hidden="true" className="flex shrink-0">
          {icon}
        </span>
      ) : null}
      {children}
    </BaseTabs.Tab>
  );
}

/** The settings of one category. */
export function SettingsPanel({
  className,
  ...props
}: ComponentProps<typeof BaseTabs.Panel>) {
  return (
    <BaseTabs.Panel
      className={cn(
        "border-craft-outline bg-craft-surface focus-visible:craft-focus flex min-w-[60%] grow-[999] basis-0 flex-col border-(length:--craft-unit) outline-none",
        className
      )}
      data-slot="settings-panel"
      {...props}
    />
  );
}

export interface SettingsSectionProps
  extends Omit<ComponentProps<"section">, "title"> {
  /** Something at the end of the heading, such as a reset button. */
  action?: ReactNode;
  /** A line under the title. */
  description?: ReactNode;
  /** The section's title. Ore UI sets it in capitals. */
  title: ReactNode;
}

/** A titled group of settings, such as "Text to speech". */
export function SettingsSection({
  action,
  children,
  className,
  description,
  title,
  ...props
}: SettingsSectionProps) {
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      className={cn("flex flex-col", className)}
      data-slot="settings-section"
      {...props}
    >
      <div className="flex flex-wrap items-end gap-x-4 gap-y-2 px-(--craft-space) pt-6 pb-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3
            className="font-craft-display leading-tight tracking-wide text-(length:--craft-label-size) uppercase"
            id={id}
          >
            {title}
          </h3>
          {description ? (
            <p className="font-craft-body text-craft-text-muted text-sm">
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export interface SettingsRowProps
  extends Omit<ComponentProps<typeof BaseField.Root>, "children"> {
  /** The control, such as a `Switch`, `Select`, `Slider` or `Button`. */
  children: ReactNode;
  /** A line under the label. It's read with the control too. */
  description?: ReactNode;
  /** Names the control. */
  label: ReactNode;
  /**
   * `inline` puts the control at the end of the row, for switches, selects and
   * buttons. `stacked` puts it under the label at full width, for sliders and
   * rows of choices.
   */
  layout?: "inline" | "stacked";
}

/**
 * One setting: a label and description, and its control. The label and
 * description are joined to a Base UI control inside, such as CraftUI's
 * Switch, Select or Slider.
 */
export function SettingsRow({
  children,
  className,
  description,
  label,
  layout = "inline",
  ...props
}: SettingsRowProps) {
  return (
    <BaseField.Root
      className={cn(
        "flex gap-x-6 gap-y-3 px-(--craft-space) py-3",
        "shadow-[inset_0_var(--craft-unit)_0_var(--craft-surface-hi),inset_0_calc(-1*var(--craft-unit))_0_var(--craft-surface-lo)]",
        layout === "inline"
          ? "flex-wrap items-center justify-between"
          : "flex-col",
        className
      )}
      data-layout={layout}
      data-slot="settings-row"
      {...props}
    >
      <div
        className={cn(
          "flex min-w-0 flex-col gap-1",
          // Room for a few words beside the control, before the control wraps.
          layout === "inline" && "flex-[1_1_8rem]"
        )}
      >
        <BaseField.Label
          className="font-craft-display data-disabled:text-craft-text-muted leading-tight text-(length:--craft-label-size)"
          nativeLabel={false}
          render={<span />}
        >
          {label}
        </BaseField.Label>
        {description ? (
          <BaseField.Description className="font-craft-body text-craft-text-muted text-sm">
            {description}
          </BaseField.Description>
        ) : null}
      </div>
      {children}
    </BaseField.Root>
  );
}
