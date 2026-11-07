"use client";

import type { ComponentProps, ReactNode } from "react";
import { Badge } from "@/components/craft/badge";
import { Button } from "@/components/craft/button";
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/components/craft/panel";
import { Progress } from "@/components/craft/progress";
import {
  Screen,
  ScreenBody,
  ScreenHeader,
  ScreenSection,
} from "@/components/craft/screen";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/craft/select";
import { Slider } from "@/components/craft/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/craft/table";
import { cn } from "@/lib/utils";

export interface DashboardStat {
  /** Something smaller beside the value, such as a change. */
  detail?: ReactNode;
  label: string;
  value: ReactNode;
}

export interface DashboardMeter {
  label: string;
  max?: number;
  tone?: "primary" | "info" | "warning" | "destructive";
  value: number;
}

export interface DashboardEvent {
  id: string;
  message: ReactNode;
  player?: string;
  /** When it happened, already formatted, such as "12:04". */
  time: string;
}

export interface GameDashboardProps
  extends Omit<ComponentProps<"div">, "children" | "title"> {
  /** Buttons for the whole world, such as Restart and Stop. */
  actions?: ReactNode;
  /** Fills the screen behind the content. */
  background?: ReactNode;
  /** The latest events, newest first. */
  events?: DashboardEvent[];
  /** The hour of the day in the world, from 0 to 23. */
  hour: number;
  /** Bars for resources, such as memory and storage. */
  meters?: DashboardMeter[];
  /** Called by the back arrow. Without it, there is no back arrow. */
  onBack?: () => void;
  /** Called with the new hour as the time slider moves. */
  onHourChange: (hour: number) => void;
  /** Called with the new weather. */
  onWeatherChange: (weather: string) => void;
  /** Numbers at the top, such as players online. */
  stats?: DashboardStat[];
  /** Whether the world is running. */
  status: "online" | "starting" | "offline";
  /** The screen's name, in the bar along the top. */
  title?: string;
  /** The current weather, one of `weatherOptions`. */
  weather: string;
  /** The weather to choose from. */
  weatherOptions?: { label: string; value: string }[];
  /** The world's name, at the top of the content. */
  worldName: string;
}

const statusTag = {
  offline: { label: "Offline", variant: "destructive" },
  online: { label: "Online", variant: "primary" },
  starting: { label: "Starting", variant: "warning" },
} as const;

const defaultWeather = [
  { label: "Clear", value: "clear" },
  { label: "Rain", value: "rain" },
  { label: "Thunder", value: "thunder" },
];

/**
 * A live dashboard for a world or server, in the style of Ore UI's forms:
 * its status and numbers, resource bars, controls for the weather and time,
 * and the latest events.
 */
export function GameDashboard({
  actions,
  background,
  className,
  events = [],
  hour,
  meters = [],
  onBack,
  onHourChange,
  onWeatherChange,
  stats = [],
  status,
  title = "Dashboard",
  weather,
  weatherOptions = defaultWeather,
  worldName,
  ...props
}: GameDashboardProps) {
  const tag = statusTag[status];

  return (
    <Screen
      background={background}
      className={cn("min-h-[40rem]", className)}
      data-slot="game-dashboard"
      {...props}
    >
      <ScreenHeader onBack={onBack} title={title} />
      <ScreenBody>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-craft-display bg-craft-overlay px-3 py-1 leading-tight text-(length:--craft-label-size)">
            {worldName}
          </h2>
          <Badge variant={tag.variant}>{tag.label}</Badge>
          {actions ? (
            <div className="ml-auto flex flex-wrap gap-2">{actions}</div>
          ) : null}
        </div>

        {stats.length > 0 ? (
          <dl className="bg-craft-outline border-craft-outline grid grid-cols-[repeat(auto-fit,minmax(min(100%,11rem),1fr))] gap-(--craft-unit) border-(length:--craft-unit)">
            {stats.map((stat) => (
              <div
                className="bg-craft-surface flex flex-col gap-1 p-(--craft-space) shadow-[inset_0_var(--craft-unit)_0_var(--craft-surface-hi)]"
                key={stat.label}
              >
                <dt className="font-craft-body text-craft-text-muted text-sm">
                  {stat.label}
                </dt>
                <dd className="font-craft-display flex items-baseline gap-2 leading-tight text-(length:--craft-label-size) tabular-nums">
                  {stat.value}
                  {stat.detail ? (
                    <span className="text-craft-text-muted text-sm">
                      {stat.detail}
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="grid items-start gap-6 @3xl/screen:grid-cols-2">
          <Panel framed>
            <PanelHeader>
              <PanelTitle>World controls</PanelTitle>
            </PanelHeader>
            <PanelContent className="flex flex-col gap-6">
              <Select
                items={weatherOptions}
                onValueChange={(value) => onWeatherChange(String(value))}
                value={weather}
              >
                <SelectLabel>Weather</SelectLabel>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {weatherOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Slider
                format={{ minimumIntegerDigits: 2 }}
                label="Hour of day"
                max={23}
                min={0}
                onValueChange={(value) => onHourChange(value as number)}
                showValue
                value={hour}
              />
            </PanelContent>
          </Panel>
          {meters.length > 0 ? (
            <Panel framed>
              <PanelHeader>
                <PanelTitle>Resources</PanelTitle>
              </PanelHeader>
              <PanelContent className="flex flex-col gap-5">
                {meters.map((meter) => (
                  <Progress
                    key={meter.label}
                    label={meter.label}
                    max={meter.max}
                    showValue
                    size="md"
                    tone={meter.tone ?? "primary"}
                    value={meter.value}
                  />
                ))}
              </PanelContent>
            </Panel>
          ) : null}
        </div>

        <ScreenSection title="Latest events">
          <Table aria-label="Latest events">
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Time</TableHead>
                <TableHead className="w-40">Player</TableHead>
                <TableHead>Event</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length > 0 ? (
                events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="tabular-nums">{event.time}</TableCell>
                    <TableCell>{event.player ?? "World"}</TableCell>
                    <TableCell>{event.message}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableEmpty colSpan={3}>Nothing has happened yet.</TableEmpty>
              )}
            </TableBody>
          </Table>
        </ScreenSection>
      </ScreenBody>
    </Screen>
  );
}

export function GameDashboardAction(props: ComponentProps<typeof Button>) {
  return <Button size="sm" variant="secondary" {...props} />;
}
