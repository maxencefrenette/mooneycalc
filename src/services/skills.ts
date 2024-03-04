import { gameData } from "./data";

export const sortedSkills = Object.values(gameData.skillDetailMap).sort(
  (a, b) => a.sortIndex - b.sortIndex,
);

export function skillName(skillHrid: string) {
  return gameData.skillDetailMap[skillHrid]?.name ?? skillHrid;
}
