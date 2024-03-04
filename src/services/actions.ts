import { type ActionDetail, gameData, type ItemCount } from "./data";
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
}

function computeSingleAction(
  action: ActionDetail,
  playerStats: PlayerStats,
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

  return {
    id: action.hrid,
    name: action.name,
    inputs,
    outputs,
    actionsPerHour,
  };
}

export function getActions(playerStats: PlayerStats) {
  return Object.values(sortedActions).map((a) =>
    computeSingleAction(a, playerStats),
  );
}
