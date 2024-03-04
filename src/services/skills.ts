import { gameData } from "./data";

export function skillName(skillHrid: string) {
  return gameData.skillDetailMap[skillHrid]?.name ?? skillHrid;
}
