import { gameData } from "./data";

export interface PlayerStats {
  levels: Record<string, number>;
  equipment: Record<string, string | null>;
}

export const initialPlayerStats: PlayerStats = {
  levels: Object.values(gameData.skillDetailMap).reduce(
    (acc, skill) => ({ ...acc, [skill.hrid]: 1 }),
    {},
  ),
  equipment: Object.values(gameData.equipmentTypeDetailMap).reduce(
    (acc, equipmentType) => ({ ...acc, [equipmentType.hrid]: null }),
    {},
  ),
};
