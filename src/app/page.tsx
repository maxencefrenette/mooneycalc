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
    <main className="flex min-h-screen">
      <div className="container py-12">
        <DataTable columns={columns} data={actions} />
      </div>
    </main>
  );
}
