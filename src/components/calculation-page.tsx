"use client";
import { type ComputedAction, getActions } from "~/services/actions";
import { DataTable } from "~/components/ui/data-table";
import { PlayerStatsForm } from "~/components/player-stats-form";
import { initialPlayerStats, type PlayerStats } from "~/services/player-stats";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ui/data-table-column-header";
import { type Market } from "~/services/market";
import { useLocalStorage } from "@uidotdev/usehooks";

const columnHelper = createColumnHelper<ComputedAction>();

export const columns: ColumnDef<ComputedAction>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions/h" />
    ),
    cell: ({ row }) => row.original.actionsPerHour.toFixed(0),
  },
  {
    accessorKey: "profit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Profit/h" />
    ),
    cell: ({ row }) => (
      <div className="max-w-28 text-right">
        {row.original.profit.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}
      </div>
    ),
  },
];

export interface CalculationPageProps {
  market: Market;
}

export function CalculationPage({ market }: CalculationPageProps) {
  const [playerStats, updatePlayerStats] = useLocalStorage<PlayerStats>(
    "player_stats",
    initialPlayerStats,
  );

  const actions = getActions(playerStats, market);

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
