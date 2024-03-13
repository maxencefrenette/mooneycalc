import { gameData } from "./data";

export const actions = Object.values(gameData.actionDetailMap).sort(
  (a, b) =>
    1000 * gameData.actionTypeDetailMap[a.type]!.sortIndex +
    a.sortIndex -
    (1000 * gameData.actionTypeDetailMap[b.type]!.sortIndex + b.sortIndex),
);

export const actionTypes = Object.keys(gameData.actionTypeDetailMap);
