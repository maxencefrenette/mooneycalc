import { createContext, useContext } from "react";
import { useSettingsStore } from "./settings";
import { type Market } from "./market-fetch";

export interface Markets {
  current: Market;
  median: Market;
}

export const MarketContext = createContext<Markets | null>(null);

export function useMarket() {
  const markets = useContext(MarketContext);
  const pricePeriod = useSettingsStore(
    (state) => state.settings.market.pricePeriod,
  );

  if (!markets) {
    throw new Error("Market context not found");
  }

  return pricePeriod === "latest" ? markets.current : markets.median;
}
