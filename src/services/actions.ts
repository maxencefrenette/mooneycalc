import { type ActionDetail, gameData, type ItemCount } from "./data";
import { itemName } from "./items";
import { type Market } from "./market";
import { type PlayerStats } from "./player-stats";

const sortedActions = Object.values(gameData.actionDetailMap).sort(
  (a, b) =>
    1000 * gameData.actionTypeDetailMap[a.type]!.sortIndex +
    a.sortIndex -
    (1000 * gameData.actionTypeDetailMap[b.type]!.sortIndex + b.sortIndex),
);

export interface ComputedAction {
  id: string;
  name: string;
  inputs: ItemCount[];
  outputs: ItemCount[];
  actionsPerHour: number;
  profit: number;
}

function getToolBonuses(skillHrid: string, playerStats: PlayerStats) {
  let speed = 0;
  let efficiency = 0;

  for (const equipmentHrid of Object.values(playerStats.equipment)) {
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

function computeSingleAction(
  action: ActionDetail,
  playerStats: PlayerStats,
  market: Market,
): ComputedAction {
  const inputs = action.inputItems?.slice() ?? [];
  if (action.upgradeItemHrid) {
    inputs.push({ itemHrid: action.upgradeItemHrid, count: 1 });
  }

  const outputs = action.outputItems ?? [];
  // TODO: take into account drop tables

  // Compute tool bonuses
  const { speed: toolSpeed, efficiency: toolEfficiency } = getToolBonuses(
    action.levelRequirement.skillHrid,
    playerStats,
  );

  // Compute level efficiency
  const level = playerStats.levels[action.levelRequirement.skillHrid]!;
  const levelsAboveRequirement = Math.max(
    0,
    level - action.levelRequirement.level,
  );
  const levelEfficiency = 0.01 * levelsAboveRequirement;

  // Compute actions per hour
  const baseActionsPerHour = 3600_000_000_000 / action.baseTimeCost;
  const speed = 1 + toolSpeed;
  const efficiency = 1 + toolEfficiency + levelEfficiency;
  const actionsPerHour = baseActionsPerHour * speed * efficiency;

  // Compute profits
  const revenue = outputs.reduce((sum, output) => {
    if (output.itemHrid === "/items/coin")
      return sum + output.count * actionsPerHour;

    let { bid, ask } = market.market[itemName(output.itemHrid)] ?? {
      bid: -1,
      ask: -1,
    };
    if (bid === -1) bid = 0;
    if (ask === -1) ask = bid;

    return sum + bid * output.count * actionsPerHour;
  }, 0);
  const cost = inputs.reduce((sum, input) => {
    if (input.itemHrid === "/items/coin")
      return sum + input.count * actionsPerHour;

    let { bid, ask } = market.market[itemName(input.itemHrid)] ?? {
      bid: -1,
      ask: -1,
    };
    if (ask === -1) ask = 1e9;
    if (bid === -1) bid = ask;

    return sum + ask * input.count * actionsPerHour;
  }, 0);
  const profit = revenue - cost;

  return {
    id: action.hrid,
    name: action.name,
    inputs,
    outputs,
    actionsPerHour,
    profit,
  };
}

export function getActions(playerStats: PlayerStats, market: Market) {
  return Object.values(sortedActions).map((a) =>
    computeSingleAction(a, playerStats, market),
  );
}
