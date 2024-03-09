import { gameData } from "./data";

export interface Settings {
  levels: Record<string, number>;
  equipment: Record<string, string | null>;
  market: {
    inputBidAskProportion: number;
    outputBidAskProportion: number;
    pricePeriod: "latest" | "median";
  };
  filters: {
    hideUnmetLevelRequirements: boolean;
  };
}

export const initialSettings: Settings = {
  levels: Object.values(gameData.skillDetailMap).reduce(
    (acc, skill) => ({ ...acc, [skill.hrid]: 1 }),
    {},
  ),
  equipment: Object.values(gameData.equipmentTypeDetailMap).reduce(
    (acc, equipmentType) => ({ ...acc, [equipmentType.hrid]: null }),
    {},
  ),
  market: {
    inputBidAskProportion: 0.0,
    outputBidAskProportion: 1.0,
    pricePeriod: "latest",
  },
  filters: {
    hideUnmetLevelRequirements: true,
  },
};
