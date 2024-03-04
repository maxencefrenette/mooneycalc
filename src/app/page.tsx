"use client";

import { getActions } from "~/services/actions";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "~/components/data-table";
import { PlayerStatsForm } from "~/components/player-stats-form";
import { initialPlayerStats, type PlayerStats } from "~/services/player-stats";
import { type ActionDetail } from "~/services/data";
import { useState } from "react";

const columnHelper = createColumnHelper<ActionDetail>();

const columns: ColumnDef<ActionDetail>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  columnHelper.display({
    id: "inputs",
    header: "Inputs",
    cell: ({ row }) => {
      const actionDetails = row.original;
      return (
        <>
          {actionDetails.inputItems?.map((input) => (
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
      const actionDetails = row.original;
      return (
        <>
          {actionDetails.outputItems?.map((output) => (
            <div key={output.itemHrid}>
              {output.count} x {output.itemHrid}
            </div>
          ))}
        </>
      );
    },
  }),
];

export default function HomePage() {
  const actions = getActions();
  const [playerStat, updatePlayerStats] =
    useState<PlayerStats>(initialPlayerStats);

  return (
    <main className="flex min-h-screen">
      <div className="container flex flex-col gap-12 py-12">
        <PlayerStatsForm
          playerStats={playerStat}
          updatePlayerStats={updatePlayerStats}
        />
        <DataTable columns={columns} data={actions} />
      </div>
    </main>
  );
}
