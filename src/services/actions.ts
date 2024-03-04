import { gameData } from "./data";

export function getActions() {
  return Object.values(gameData.actionDetailMap);
}
