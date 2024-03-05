"use server";

import { fetchMarket } from "~/services/market";
import { CalculationPage } from "../components/calculation-page";
import { ClientOnly } from "~/components/client-only";

export default async function HomePage() {
  const currentMarket = await fetchMarket("milkyapi.json");
  const medianMarket = await fetchMarket("medianmarket.json");

  return (
    <ClientOnly>
      <CalculationPage
        currentMarket={currentMarket}
        medianMarket={medianMarket}
      />
    </ClientOnly>
  );
}
