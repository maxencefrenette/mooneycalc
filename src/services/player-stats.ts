import { gameData } from "./data";

export interface PlayerStats {
  levels: Record<string, number>;
}

export const initialPlayerStats: PlayerStats = {
  levels: Object.values(gameData.skillDetailMap).reduce(
    (acc, skill) => ({ ...acc, [skill.hrid]: 1 }),
    {} as Record<string, number>,
  ),
};
