import { gameData } from "./data";

export function itemName(itemHrid: string) {
  return gameData.itemDetailMap[itemHrid]?.name ?? itemHrid;
}

export function itemsByEquipmentType(equipmentTypeHrid: string) {
  return Object.values(gameData.itemDetailMap)
    .filter((item) => item.equipmentDetail.type === equipmentTypeHrid)
    .sort((a, b) => a.sortIndex - b.sortIndex);
}
