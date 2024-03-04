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

  // Compute actions per hour
  const level = playerStats.levels[action.levelRequirement.skillHrid]!;
  const levelsAboveRequirement = Math.max(
    0,
    level - action.levelRequirement.level,
  );
  const actionTime = action.baseTimeCost / (1 + 0.01 * levelsAboveRequirement);
  const actionsPerHour = 3600_000_000_000 / actionTime;

  // Compute profits
  const revenue = outputs.reduce((sum, output) => {
    let { bid, ask } = market.market[itemName(output.itemHrid)] ?? {
      bid: -1,
      ask: -1,
    };
    if (bid === -1) bid = 0;
    if (ask === -1) ask = bid;

    return sum + bid * output.count * actionsPerHour;
  }, 0);
  const cost = inputs.reduce((sum, input) => {
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
