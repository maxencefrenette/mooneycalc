"use server";

import { fetchMarket } from "~/services/market";
import { CalculationPage } from "../components/calculation-page";

export default async function HomePage() {
  const market = await fetchMarket();
  return <CalculationPage market={market} />;
}
