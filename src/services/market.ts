export interface Market {
  market: Record<string, MarketEntry>;
  time: number;
}
export interface MarketEntry {
  bid: number;
  ask: number;
}

export async function fetchMarket(): Promise<Market> {
  const response = await fetch(
    "https://raw.githubusercontent.com/holychikenz/MWIApi/main/milkyapi.json",
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return (await response.json()) as Market;
}