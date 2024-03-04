"use client";

import { type ActionDetail, getActions } from "~/services/actions";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/data-table";

const columns: ColumnDef<ActionDetail>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
];

export default function HomePage() {
  const actions = getActions();

  return (
    <main>
      <DataTable columns={columns} data={actions} />
    </main>
  );
}
