"use server";

import { fetchMarket } from "~/services/market";
import { ActionsDataTable } from "../components/actions-table";
import { ClientOnly } from "~/components/client-only";
import { SettingsForm } from "~/components/settings-form";

export default async function HomePage() {
  const currentMarket = await fetchMarket("milkyapi.json");
  const medianMarket = await fetchMarket("medianmarket.json");

  return (
    <main className="flex min-h-screen">
      <div className="container flex flex-col gap-6 py-12">
        <ClientOnly>
          <SettingsForm />
          <ActionsDataTable
            currentMarket={currentMarket}
            medianMarket={medianMarket}
          />
        </ClientOnly>
      </div>
    </main>
  );
}
