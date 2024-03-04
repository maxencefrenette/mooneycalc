import { gameData } from "./data";

export const skills = Object.values(gameData.skillDetailMap)
  .filter((s) => s.hrid != "/skills/total_level")
  .sort((a, b) => a.sortIndex - b.sortIndex);

export function skillName(skillHrid: string) {
  return gameData.skillDetailMap[skillHrid]?.name ?? skillHrid;
}
