"use client";

import { createContext, useContext } from "react";
import { useSettingsStore } from "./settings";
import { type MarketEntry, type Market } from "./market-fetch";
import { createDbWorker } from "sql.js-httpvfs";
import { useQuery } from "@tanstack/react-query";
import { items } from "./items";
import percentile from "percentile";

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

export async function loadMarketDb() {
  const workerUrl = new URL(
    "sql.js-httpvfs/dist/sqlite.worker.js",
    import.meta.url,
  );
  const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

  const worker = await createDbWorker(
    [
      {
        from: "inline",
        config: {
          serverMode: "full",
          url: "https://holychikenz.github.io/MWIApi/market.db",
          requestChunkSize: 4096,
        },
      },
    ],
    workerUrl.toString(),
    wasmUrl.toString(),
  );

  return worker;
}

export function computePercentileMarket3Days(
  ask: Record<string, number>[],
  bid: Record<string, number>[],
  p: number,
) {
  const market: Record<string, MarketEntry> = {};

  for (const item of items) {
    const askPrices = ask.map((entry) => {
      const price = entry[item.name]!;

      if (price == -1) {
        return Number.POSITIVE_INFINITY;
      }

      return price;
    });
    const bidPrices = bid.map((entry) => {
      const price = entry[item.name]!;

      if (price == -1) {
        return 0;
      }

      return price;
    });

    market[item.name] = {
      ask: percentile(p, askPrices) as number,
      bid: percentile(p, bidPrices) as number,
    };
  }

  const time = ask.map((entry) => entry.time!).reduce((a, b) => Math.max(a, b));

  return {
    time,
    market,
  };
}

export function usePercentileMarket3Days() {
  return useQuery({
    queryKey: ["market-percentile-3-days"],
    queryFn: async () => {
      const worker = await loadMarketDb();

      // Select everything from ask and bid tables for the last 3 days
      // the column time is a unix timestamp in seconds
      const askData = await worker.db.query(
        `SELECT * FROM ask WHERE time > strftime('%s', 'now', '-3 days')`,
      );
      const bidData = await worker.db.query(
        `SELECT * FROM bid WHERE time > strftime('%s', 'now', '-3 days')`,
      );

      // @ts-expect-error assuming the data returned from sqlite it typed correctly
      const p10 = computePercentileMarket3Days(askData, bidData, 10);
      // @ts-expect-error assuming the data returned from sqlite it typed correctly
      const p90 = computePercentileMarket3Days(askData, bidData, 90);

      return {
        p10,
        p90,
      };
    },
  });
}
