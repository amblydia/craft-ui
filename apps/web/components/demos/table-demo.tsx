"use client";

import { useState } from "react";
import { Badge } from "@/components/craft/badge";
import { Checkbox } from "@/components/craft/checkbox";
import {
  type SortDirection,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/craft/table";

const servers = [
  { name: "Lifeboat", online: true, players: 1824 },
  { name: "Mineville", online: true, players: 952 },
  { name: "Galaxite", online: false, players: 0 },
  { name: "The Hive", online: true, players: 3120 },
];

export function TableDemo() {
  const [direction, setDirection] = useState<SortDirection>("descending");
  const [selected, setSelected] = useState<string[]>(["The Hive"]);

  const rows = [...servers].sort((a, b) =>
    direction === "ascending" ? a.players - b.players : b.players - a.players
  );

  function toggle(name: string, checked: boolean) {
    setSelected((current) =>
      checked ? [...current, name] : current.filter((item) => item !== name)
    );
  }

  return (
    <Table className="min-w-md">
      <TableCaption>
        {selected.length} of {servers.length} servers selected
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              aria-label="Select every server"
              checked={selected.length === servers.length}
              indeterminate={
                selected.length > 0 && selected.length < servers.length
              }
              onCheckedChange={(checked) =>
                setSelected(checked ? servers.map((server) => server.name) : [])
              }
            />
          </TableHead>
          <TableHead>Server</TableHead>
          <TableHead>Status</TableHead>
          <TableHead
            className="w-44"
            onSort={() =>
              setDirection(
                direction === "ascending" ? "descending" : "ascending"
              )
            }
            sortDirection={direction}
          >
            Players
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((server) => (
          <TableRow key={server.name} selected={selected.includes(server.name)}>
            <TableCell>
              <Checkbox
                aria-label={`Select ${server.name}`}
                checked={selected.includes(server.name)}
                onCheckedChange={(checked) => toggle(server.name, checked)}
              />
            </TableCell>
            <TableCell className="font-craft-display text-(length:--craft-label-size)">
              {server.name}
            </TableCell>
            <TableCell>
              <Badge size="sm" variant={server.online ? "primary" : "neutral"}>
                {server.online ? "Online" : "Offline"}
              </Badge>
            </TableCell>
            <TableCell>{server.players.toLocaleString("en-US")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
