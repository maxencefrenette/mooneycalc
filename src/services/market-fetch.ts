import { z } from "zod";

const MarketEntrySchema = z.object({
  bid: z.number(),
  ask: z.number(),
});
export type MarketEntry = z.infer<typeof MarketEntrySchema>;

const MarketSchema = z.object({
  market: z.record(MarketEntrySchema),
  time: z.number(),
});
export type Market = z.infer<typeof MarketSchema>;

export async function fetchMarket(name: string): Promise<Market> {
  const response = await fetch(
    `https://raw.githubusercontent.com/holychikenz/MWIApi/main/${name}`,
    { next: { revalidate: 60 } },
  );

  const data: unknown = await response.json();
  return MarketSchema.parse(data);
}
