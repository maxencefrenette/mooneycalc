import { communityBuffs } from "./community-buffs";
import { type ActionDetail, gameData, type ItemCount } from "./data";
import { houseRooms } from "./house-rooms";
import { itemName } from "./items";
import { type Market } from "./market-fetch";
import { type Settings } from "./settings";

const sortedActions = Object.values(gameData.actionDetailMap).sort(
  (a, b) =>
    1000 * gameData.actionTypeDetailMap[a.type]!.sortIndex +
    a.sortIndex -
    (1000 * gameData.actionTypeDetailMap[b.type]!.sortIndex + b.sortIndex),
);

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

function getToolBonuses(skillHrid: string, settings: Settings) {
  let speed = 0;
  let efficiency = 0;

  for (const equipmentHrid of Object.values(settings.equipment)) {
    if (equipmentHrid === null) continue;

    const equipment = gameData.itemDetailMap[equipmentHrid]!;
    const stats = equipment.equipmentDetail.noncombatStats;

    if (!stats) debugger;

    if (skillHrid === "/skills/milking") {
      speed += stats.milkingSpeed;
      efficiency += stats.milkingEfficiency;
    }
    if (skillHrid === "/skills/foraging") {
      speed += stats.foragingSpeed;
      efficiency += stats.foragingEfficiency;
    }
    if (skillHrid === "/skills/woodcutting") {
      speed += stats.woodcuttingSpeed;
      efficiency += stats.woodcuttingEfficiency;
    }
    if (skillHrid === "/skills/cheesesmithing") {
      speed += stats.cheesesmithingSpeed;
      efficiency += stats.cheesesmithingEfficiency;
    }
    if (skillHrid === "/skills/crafting") {
      speed += stats.craftingSpeed;
      efficiency += stats.craftingEfficiency;
    }
    if (skillHrid === "/skills/tailoring") {
      speed += stats.tailoringSpeed;
      efficiency += stats.tailoringEfficiency;
    }
    if (skillHrid === "/skills/cooking") {
      speed += stats.cookingSpeed;
      efficiency += stats.cookingEfficiency;
    }
    if (skillHrid === "/skills/brewing") {
      speed += stats.brewingSpeed;
      efficiency += stats.brewingEfficiency;
    }
    if (skillHrid === "/skills/enhancing") {
      speed += stats.enhancingSpeed;
      efficiency += stats.enhancingSuccess;
    }
    speed += stats.taskSpeed;
    efficiency += stats.skillingEfficiency;
  }

  return { speed, efficiency };
}

function getHouseBonuses(actionType: string, settings: Settings) {
  let efficiency = 0;
  let speed = 0;

  for (const houseRoom of houseRooms) {
    const level = settings.houseRooms[houseRoom.hrid]!;

    if (level === 0) continue;
    if (houseRoom.usableInActionTypeMap[actionType] !== true) continue;

    for (const buff of [...houseRoom.actionBuffs, ...houseRoom.globalBuffs]) {
      if (buff.typeHrid === "/buff_types/efficiency") {
        efficiency += buff.flatBoost + buff.flatBoostLevelBonus * (level - 1);
      }
      if (buff.typeHrid === "/buff_types/speed") {
        speed += buff.flatBoost + buff.flatBoostLevelBonus * (level - 1);
      }
    }
  }

  return { efficiency, speed };
}

function getCommunityBuffBonuses(actionType: string, settings: Settings) {
  let efficiency = 0;

  for (const buff of communityBuffs) {
    const level = settings.communityBuffs[buff.hrid]!;

    if (level === 0) continue;
    if (buff.usableInActionTypeMap[actionType] !== true) continue;

    const buffValue =
      buff.buff.flatBoost + buff.buff.flatBoostLevelBonus * (level - 1);

    if (buff.buff.typeHrid === "/buff_types/efficiency") {
      efficiency += buffValue;
    }
  }

  return { efficiency };
}

function computeSingleAction(
  action: ActionDetail,
  settings: Settings,
  market: Market,
): ComputedAction {
  const inputs = action.inputItems?.slice() ?? [];
  if (action.upgradeItemHrid) {
    inputs.push({ itemHrid: action.upgradeItemHrid, count: 1 });
  }

  let outputs = action.outputItems ?? [];
  if (action.dropTable) {
    const dropTableOutputs = action.dropTable.map((e) => ({
      itemHrid: e.itemHrid,
      count: e.dropRate * 0.5 * (e.minCount + e.maxCount),
    }));
    outputs = [...outputs, ...dropTableOutputs];
  }

  // Compute tool bonuses
  const { speed: toolSpeed, efficiency: toolEfficiency } = getToolBonuses(
    action.levelRequirement.skillHrid,
    settings,
  );

  // Compute house bonuses
  const { speed: houseSpeed, efficiency: houseEfficiency } = getHouseBonuses(
    action.type,
    settings,
  );

  // Compute community buff bonuses
  const { efficiency: communityEfficiency } = getCommunityBuffBonuses(
    action.type,
    settings,
  );

  // Compute level efficiency
  const level = settings.levels[action.levelRequirement.skillHrid]!;
  const levelsAboveRequirement = Math.max(
    0,
    level - action.levelRequirement.level,
  );
  const levelEfficiency = 0.01 * levelsAboveRequirement;

  // Compute actions per hour
  const baseActionsPerHour = 3600_000_000_000 / action.baseTimeCost;
  const speed = 1 + toolSpeed + houseSpeed;
  const efficiency =
    1 +
    toolEfficiency +
    houseEfficiency +
    communityEfficiency +
    levelEfficiency;
  const actionsPerHour = baseActionsPerHour * speed * efficiency;

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

export function getActions(settings: Settings, market: Market) {
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
