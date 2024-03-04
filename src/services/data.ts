import rawGameData from "~/data/init_client_info.json";

interface GameData {
  skillDetailMap: Record<string, SkillDetail>;
  actionDetailMap: Record<string, ActionDetail>;
  actionTypeDetailMap: Record<string, ActionTypeDetail>;
}

export interface SkillDetail {
  hrid: string;
  name: string;
  sortIndex: number;
}

export interface ActionDetail {
  hrid: string;
  function: string;
  type: string;
  category: string;
  name: string;
  levelRequirement: {
    skillHrid: string;
    level: number;
  };
  baseTimeCost: number;
  experienceGain: {
    skillHrid: string;
    value: number;
  };
  dropTable: unknown;
  rareDropTable: unknown;
  upgradeItemHrid: string;
  inputItems: ItemCount[] | null;
  outputItems: ItemCount[] | null;
  monsterSpawnInfo: unknown;
  sortIndex: number;
}

export interface ItemCount {
  itemHrid: string;
  count: number;
}

export interface ActionTypeDetail {
  hrid: string;
  name: string;
  sortIndex: number;
}

// There is probably a cleaner way to type this
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
export const gameData: GameData = rawGameData as any;
