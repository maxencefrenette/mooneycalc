import { gameData } from "./data";

export const communityBuffs = Object.values(
  gameData.communityBuffTypeDetailMap,
).sort((a, b) => a.sortIndex - b.sortIndex);
