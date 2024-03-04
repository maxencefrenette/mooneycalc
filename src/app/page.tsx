"use client";

import { type ActionDetail, getActions } from "~/services/actions";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "~/components/data-table";

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

  return (
    <main className="flex min-h-screen">
      <div className="container py-12">
        <DataTable columns={columns} data={actions} />
      </div>
    </main>
  );
}
