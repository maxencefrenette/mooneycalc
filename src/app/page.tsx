"use client";

import { type ComputedAction, getActions } from "~/services/actions";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "~/components/data-table";
import { PlayerStatsForm } from "~/components/player-stats-form";
import { initialPlayerStats, type PlayerStats } from "~/services/player-stats";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "~/components/ui/button";

const columnHelper = createColumnHelper<ComputedAction>();

const columns: ColumnDef<ComputedAction>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  columnHelper.display({
    id: "inputs",
    header: "Inputs",
    cell: ({ row }) => {
      const action = row.original;
      return (
        <>
          {action.inputs.map((input) => (
            <div key={input.itemHrid}>
              {input.count} x {input.itemHrid}
            </div>
          ))}
        </>
      );
    },
  }),
  columnHelper.display({
    id: "outputs",
    header: "Outputs",
    cell: ({ row }) => {
      const action = row.original;
      return (
        <>
          {action.outputs.map((output) => (
            <div key={output.itemHrid}>
              {output.count} x {output.itemHrid}
            </div>
          ))}
        </>
      );
    },
  }),
  {
    accessorKey: "actionsPerHour",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Actions/h
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.actionsPerHour.toFixed(0),
  },
];

export default function HomePage() {
  const [playerStats, updatePlayerStats] =
    useState<PlayerStats>(initialPlayerStats);

  const actions = getActions(playerStats);

  return (
    <main className="flex min-h-screen">
      <div className="container flex flex-col gap-12 py-12">
        <PlayerStatsForm
          playerStats={playerStats}
          updatePlayerStats={updatePlayerStats}
        />
        <DataTable columns={columns} data={actions} />
      </div>
    </main>
  );
}
