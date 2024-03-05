"use server";

import { fetchMarket } from "~/services/market";
import { CalculationPage } from "../components/calculation-page";
import { ClientOnly } from "~/components/client-only";

export default async function HomePage() {
  const market = await fetchMarket();

  return (
    <ClientOnly>
      <CalculationPage market={market} />
    </ClientOnly>
  );
}
