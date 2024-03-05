import { gameData } from "./data";

export const equipmentTypes = Object.values(
  gameData.equipmentTypeDetailMap,
).sort((a, b) => a.sortIndex - b.sortIndex);

export function equipmentTypeName(hrid: string) {
  return gameData.equipmentTypeDetailMap[hrid]?.name ?? hrid;
}
