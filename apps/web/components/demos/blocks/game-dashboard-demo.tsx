"use client";

import { useState } from "react";
import {
  GameDashboard,
  GameDashboardAction,
} from "@/components/craft/blocks/game-dashboard";
import { Scene } from "@/components/demos/game-art";

export function GameDashboardDemo() {
  const [weather, setWeather] = useState("clear");
  const [hour, setHour] = useState(12);
  const [status, setStatus] = useState<"online" | "starting" | "offline">(
    "online"
  );

  return (
    <GameDashboard
      actions={
        <>
          <GameDashboardAction onClick={() => setStatus("starting")}>
            Restart
          </GameDashboardAction>
          <GameDashboardAction
            onClick={() => setStatus("offline")}
            variant="destructive"
          >
            Stop
          </GameDashboardAction>
        </>
      }
      background={<Scene name="night" />}
      events={[
        {
          id: "3",
          message: "found a sea gem",
          player: "Pebble",
          time: "12:04",
        },
        {
          id: "2",
          message: "joined the world",
          player: "Pebble",
          time: "11:58",
        },
        { id: "1", message: "Backed up the world", time: "11:30" },
      ]}
      hour={hour}
      meters={[
        { label: "Memory", tone: "info", value: 62 },
        { label: "Storage", tone: "warning", value: 81 },
        { label: "Tick rate", value: 98 },
      ]}
      onHourChange={setHour}
      onWeatherChange={setWeather}
      stats={[
        { detail: "of 20", label: "Players online", value: "4" },
        { label: "Uptime", value: "3d 4h" },
        { detail: "+12 today", label: "Chunks loaded", value: "1,284" },
      ]}
      status={status}
      weather={weather}
      worldName="Riverside"
    />
  );
}
