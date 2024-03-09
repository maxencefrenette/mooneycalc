"use server";

import { fetchMarket } from "~/services/market-fetch";
import ActionsPage from "~/components/actions-page";
import { ClientOnly } from "~/components/client-only";

export default async function HomePage() {
  const market = {
    current: await fetchMarket("milkyapi.json"),
    median: await fetchMarket("medianmarket.json"),
  };

  return (
    <main className="flex min-h-screen">
      <div className="container flex flex-col gap-6 py-12">
        <ClientOnly>
          <ActionsPage markets={market} />
        </ClientOnly>
      </div>
    </main>
  );
}
