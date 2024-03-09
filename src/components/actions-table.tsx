"use client";
import { type ComputedAction, getActions } from "~/services/actions";
import { DataTable } from "~/components/ui/data-table";
import { useSettingsStore } from "~/services/settings";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ui/data-table-column-header";
import { type Market } from "~/services/market";
import { itemName } from "~/services/items";
import { skillName } from "~/services/skills";

const columnHelper = createColumnHelper<ComputedAction>();

export const columns: ColumnDef<ComputedAction>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
  },
  {
    accessorKey: "skillHrid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Skill" />
    ),
    cell: ({ row }) => <div>{skillName(row.original.skillHrid)}</div>,
  },
  {
    accessorKey: "levelRequired",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Level" />
    ),
    cell: ({ row }) => row.original.levelRequired,
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
              {input.count.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}{" "}
              x {itemName(input.itemHrid)}
            </div>
          ))}
        </>
      );
    },
  }),
  {
    accessorKey: "inputsPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inputs price" />
    ),
    cell: ({ row }) => (
      <div className="max-w-28 text-right">
        {row.original.inputsPrice.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}
      </div>
    ),
  },
  columnHelper.display({
    id: "outputs",
    header: "Outputs",
    cell: ({ row }) => {
      const action = row.original;
      return (
        <>
          {action.outputs.map((output) => (
            <div key={output.itemHrid}>
              {output.count.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}{" "}
              x {itemName(output.itemHrid)}
            </div>
          ))}
        </>
      );
    },
  }),
  {
    accessorKey: "outputsPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Outputs price" />
    ),
    cell: ({ row }) => (
      <div className="max-w-28 text-right">
        {row.original.outputsPrice.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}
      </div>
    ),
  },
  {
    accessorKey: "outputMaxBidAskSpread",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Output spread" />
    ),
    cell: ({ row }) => (
      <div className="max-w-28 text-right">
        {(row.original.outputMaxBidAskSpread * 100).toLocaleString(undefined, {
          maximumSignificantDigits: 2,
        }) + "%"}
      </div>
    ),
  },
  {
    accessorKey: "actionsPerHour",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions/h" />
    ),
    cell: ({ row }) => (
      <div className="text-right">{row.original.actionsPerHour.toFixed(0)}</div>
    ),
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
  currentMarket: Market;
  medianMarket: Market;
}

export function ActionsDataTable({
  currentMarket,
  medianMarket,
}: CalculationPageProps) {
  const settings = useSettingsStore((state) => state.settings);
  const market =
    settings.market.pricePeriod === "latest" ? currentMarket : medianMarket;

  const actions = getActions(settings, market);

  return (
    <DataTable
      columns={columns}
      data={actions}
      initialSorting={[{ id: "profit", desc: true }]}
    />
  );
}
