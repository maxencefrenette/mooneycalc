import { gameData } from "./data";

export function itemName(itemHrid: string) {
  return gameData.itemDetailMap[itemHrid]?.name ?? itemHrid;
}
