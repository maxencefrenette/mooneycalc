import { type ActionDetail, gameData, type ItemCount } from "./data";

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
}

function computeSingleAction(action: ActionDetail): ComputedAction {
  const inputs = action.inputItems?.slice() ?? [];
  if (action.upgradeItemHrid) {
    inputs.push({ itemHrid: action.upgradeItemHrid, count: 1 });
  }

  const outputs = action.outputItems ?? [];

  return {
    id: action.hrid,
    name: action.name,
    inputs,
    outputs,
  };
}

export function getActions() {
  return Object.values(sortedActions).map(computeSingleAction);
}
