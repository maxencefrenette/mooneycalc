import { sortedActions } from "./actions";
import {
  BUFF_TYPE_EFFICIENCY,
  BUFF_TYPE_ENHANCING_SUCCESS,
  BUFF_TYPE_GATHERING,
  BUFF_TYPE_ACTION_SPEED,
  addBonuses,
  zeroBonuses,
  BUFF_TYPE_TASK_SPEED,
  BUFF_TYPE_WISDOM,
  BUFF_TYPE_RARE_FIND,
} from "./buffs";
import { communityBuffs } from "./community-buffs";
import { type ActionDetail, gameData, type ItemCount } from "./data";
import { houseRooms } from "./house-rooms";
import { itemName } from "./items";
import { type Market } from "./market-fetch";
import { type Settings } from "./settings";

export interface ComputedAction {
  id: string;
  name: string;
  skillHrid: string;
  levelRequired: number;
  inputs: ItemCount[];
  inputsPrice: number;
  outputs: ItemCount[];
  outputsPrice: number;
  outputMaxBidAskSpread: number;
  actionsPerHour: number;
  profit: number;
}

function lerp(a: number, b: number, t: number) {
  // This is needed to support cases where a or b is infinity
  if (t <= 0) return a;
  if (t >= 1) return b;

  return a + (b - a) * t;
}

function getEquipmentBonuses(actionType: string, settings: Settings) {
  const bonuses = zeroBonuses();

  for (const equipmentHrid of Object.values(settings.equipment)) {
    if (equipmentHrid === null) continue;

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
  }

  return bonuses;
}

function getHouseBonuses(actionType: string, settings: Settings) {
  const buffEffects = zeroBonuses();

  for (const houseRoom of houseRooms) {
    const level = settings.houseRooms[houseRoom.hrid]!;

    if (level === 0) continue;
    if (houseRoom.usableInActionTypeMap[actionType] !== true) continue;

    for (const buff of [...houseRoom.actionBuffs, ...houseRoom.globalBuffs]) {
      buffEffects[buff.typeHrid] +=
        buff.flatBoost + buff.flatBoostLevelBonus * (level - 1);
    }
  }

  return buffEffects;
}

function getCommunityBuffBonuses(actionType: string, settings: Settings) {
  const buffEffects = zeroBonuses();

  for (const buff of communityBuffs) {
    const level = settings.communityBuffs[buff.hrid]!;

    if (level === 0) continue;
    if (buff.usableInActionTypeMap[actionType] !== true) continue;

    buffEffects[buff.buff.typeHrid] +=
      buff.buff.flatBoost + buff.buff.flatBoostLevelBonus * (level - 1);
  }

  return buffEffects;
}

function computeSingleAction(
  action: ActionDetail,
  settings: Settings,
  market: Market,
): ComputedAction {
  // Compute bonuses
  const equipmentBonuses = getEquipmentBonuses(action.type, settings);
  const houseBonuses = getHouseBonuses(action.type, settings);
  const communityBonuses = getCommunityBuffBonuses(action.type, settings);
  const bonuses = addBonuses(equipmentBonuses, houseBonuses, communityBonuses);

  // Compute level efficiency
  const level = settings.levels[action.levelRequirement.skillHrid]!;
  const levelsAboveRequirement = Math.max(
    0,
    level - action.levelRequirement.level,
  );
  const levelEfficiency = 0.01 * levelsAboveRequirement;

  // Compute actions per hour
  const baseActionsPerHour = 3600_000_000_000 / action.baseTimeCost;
  const speed = 1 + bonuses[BUFF_TYPE_ACTION_SPEED]!;
  const efficiency = 1 + bonuses[BUFF_TYPE_EFFICIENCY]! + levelEfficiency;
  const actionsPerHour = baseActionsPerHour * speed * efficiency;

  // Compute inputs and outputs
  const inputs = action.inputItems?.slice() ?? [];
  if (action.upgradeItemHrid) {
    inputs.push({ itemHrid: action.upgradeItemHrid, count: 1 });
  }

  const gatheringBonus = 1 + bonuses[BUFF_TYPE_GATHERING]!;
  let outputs = action.outputItems ?? [];
  if (action.dropTable) {
    const dropTableOutputs = action.dropTable.map((e) => ({
      itemHrid: e.itemHrid,
      count: e.dropRate * 0.5 * (e.minCount + e.maxCount) * gatheringBonus,
    }));
    outputs = [...outputs, ...dropTableOutputs];
  }

  // Compute stats per action
  const revenue = outputs.reduce((sum, output) => {
    if (output.itemHrid === "/items/coin")
      return sum + output.count * actionsPerHour;

    let { bid, ask } = market.market[itemName(output.itemHrid)] ?? {
      bid: -1,
      ask: -1,
    };
    if (bid === -1) bid = 0;
    if (ask === -1) ask = bid;

    const p = settings.market.outputBidAskProportion;
    let price = lerp(bid, ask, p);

    // TODO: set price to sell price if it's higher than market price
    price = Math.max(price, gameData.itemDetailMap[output.itemHrid]!.sellPrice);

    return sum + price * output.count;
  }, 0);

  const outputBidAskSpreads = outputs.map((output) => {
    const { bid, ask } = market.market[itemName(output.itemHrid)] ?? {
      bid: -1,
      ask: -1,
    };
    if (ask === -1 || bid === -1) return 1;

    return (ask - bid) / ask;
  });
  const outputMaxBidAskSpread = Math.max(...outputBidAskSpreads);

  const cost = inputs.reduce((sum, input) => {
    if (input.itemHrid === "/items/coin")
      return sum + input.count * actionsPerHour;

    let { bid, ask } = market.market[itemName(input.itemHrid)] ?? {
      bid: -1,
      ask: -1,
    };
    if (ask === -1) ask = Number.POSITIVE_INFINITY;
    if (bid === -1) bid = ask;

    const p = settings.market.inputBidAskProportion;
    const price = lerp(ask, bid, p);

    return sum + price * input.count;
  }, 0);
  const profit = (revenue - cost) * actionsPerHour;

  return {
    id: action.hrid,
    skillHrid: action.levelRequirement.skillHrid,
    levelRequired: action.levelRequirement.level,
    name: action.name,
    inputs,
    inputsPrice: cost,
    outputs,
    outputsPrice: revenue,
    outputMaxBidAskSpread,
    actionsPerHour,
    profit,
  };
}

export function computeActions(settings: Settings, market: Market) {
  let actions = Object.values(sortedActions);

  // Filter out combat and enhancement actions
  actions = actions.filter(
    (a) =>
      a.type !== "/action_types/combat" && a.type !== "/action_types/enhancing",
  );

  // Filter out actions that involve untradable items
  actions = actions.filter((a) => {
    if (a.inputItems) {
      for (const input of a.inputItems) {
        if (gameData.itemDetailMap[input.itemHrid]!.isTradable === false) {
          return false;
        }
      }
    }
    if (a.outputItems) {
      for (const output of a.outputItems) {
        if (gameData.itemDetailMap[output.itemHrid]!.isTradable === false) {
          return false;
        }
      }
    }
    return true;
  });

  // Filter out actions with unmet level requirements
  if (settings.filters.hideUnmetLevelRequirements) {
    actions = actions.filter((a) => {
      const level = settings.levels[a.levelRequirement.skillHrid]!;
      return level >= a.levelRequirement.level;
    });
  }

  const computedActions = actions.map((a) =>
    computeSingleAction(a, settings, market),
  );
  return computedActions;
}
