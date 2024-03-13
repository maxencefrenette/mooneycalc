import {
  BUFF_TYPE_ACTION_SPEED,
  BUFF_TYPE_EFFICIENCY,
  BUFF_TYPE_ENHANCING_SUCCESS,
  BUFF_TYPE_GATHERING,
  BUFF_TYPE_RARE_FIND,
  BUFF_TYPE_TASK_SPEED,
  BUFF_TYPE_WISDOM,
  zeroBonuses,
} from "./buffs";
import { gameData } from "./data";

export const equipmentTypes = Object.values(
  gameData.equipmentTypeDetailMap,
).sort((a, b) => a.sortIndex - b.sortIndex);

export function equipmentTypeName(hrid: string) {
  return gameData.equipmentTypeDetailMap[hrid]?.name ?? hrid;
}

export function getEquipmentBonuses(
  actionType: string,
  equipmentType: string,
  equipmentHrid: string | null,
  equipmentLevel: number,
) {
  if (equipmentHrid === null) return zeroBonuses;

  const bonuses = { ...zeroBonuses };
  const equipment = gameData.itemDetailMap[equipmentHrid]!;

  const stats = equipment.equipmentDetail.noncombatStats;

  bonuses[BUFF_TYPE_TASK_SPEED] += stats.taskSpeed;
  bonuses[BUFF_TYPE_EFFICIENCY] += stats.skillingEfficiency;
  bonuses[BUFF_TYPE_ENHANCING_SUCCESS] += stats.enhancingSuccess;
  bonuses[BUFF_TYPE_GATHERING] += stats.gatheringQuantity;
  bonuses[BUFF_TYPE_RARE_FIND] += stats.skillingRareFind;
  bonuses[BUFF_TYPE_WISDOM] += stats.skillingExperience;

  if (actionType === "/action_types/milking") {
    bonuses[BUFF_TYPE_ACTION_SPEED] += stats.milkingSpeed;
    bonuses[BUFF_TYPE_EFFICIENCY] += stats.milkingEfficiency;
  }
  if (actionType === "/action_types/foraging") {
    bonuses[BUFF_TYPE_ACTION_SPEED] += stats.foragingSpeed;
    bonuses[BUFF_TYPE_EFFICIENCY] += stats.foragingEfficiency;
  }
  if (actionType === "/action_types/woodcutting") {
    bonuses[BUFF_TYPE_ACTION_SPEED] += stats.woodcuttingSpeed;
    bonuses[BUFF_TYPE_EFFICIENCY] += stats.woodcuttingEfficiency;
  }
  if (actionType === "/action_types/cheesesmithing") {
    bonuses[BUFF_TYPE_ACTION_SPEED] += stats.cheesesmithingSpeed;
    bonuses[BUFF_TYPE_EFFICIENCY] += stats.cheesesmithingEfficiency;
  }
  if (actionType === "/action_types/crafting") {
    bonuses[BUFF_TYPE_ACTION_SPEED] += stats.craftingSpeed;
    bonuses[BUFF_TYPE_EFFICIENCY] += stats.craftingEfficiency;
  }
  if (actionType === "/action_types/tailoring") {
    bonuses[BUFF_TYPE_ACTION_SPEED] += stats.tailoringSpeed;
    bonuses[BUFF_TYPE_EFFICIENCY] += stats.tailoringEfficiency;
  }
  if (actionType === "/action_types/cooking") {
    bonuses[BUFF_TYPE_ACTION_SPEED] += stats.cookingSpeed;
    bonuses[BUFF_TYPE_EFFICIENCY] += stats.cookingEfficiency;
  }
  if (actionType === "/action_types/brewing") {
    bonuses[BUFF_TYPE_ACTION_SPEED] += stats.brewingSpeed;
    bonuses[BUFF_TYPE_EFFICIENCY] += stats.brewingEfficiency;
  }
  if (actionType === "/action_types/enhancing") {
    bonuses[BUFF_TYPE_ACTION_SPEED] += stats.enhancingSpeed;
    bonuses[BUFF_TYPE_EFFICIENCY] += stats.enhancingSuccess;
  }

  const isJewelry = [
    "/equipment_types/earrings",
    "/equipment_types/rings",
    "/equipment_types/necklaces",
  ].includes(equipmentType);
  const jewelryMultiplier = isJewelry ? 5 : 1;

  const multiplier =
    1 +
    0.01 *
      jewelryMultiplier *
      gameData.enhancementLevelTotalBonusMultiplierTable[equipmentLevel]!;

  for (const key of Object.keys(bonuses)) {
    bonuses[key] *= multiplier;
  }

  return bonuses;
}
