import rawGameData from "~/data/init_client_info.json";

interface GameData {
  equipmentTypeDetailMap: Record<string, EquipmentTypeDetail>;
  itemDetailMap: Record<string, ItemDetail>;
  skillDetailMap: Record<string, SkillDetail>;
  actionDetailMap: Record<string, ActionDetail>;
  actionTypeDetailMap: Record<string, ActionTypeDetail>;
}

export interface EquipmentTypeDetail {
  hrid: string;
  name: string;
  itemLocationHrid: string;
  sortIndex: number;
}

export interface ItemDetail {
  hrid: string;
  name: string;
  // TODO: add missing fields
  equipmentDetail: {
    type: string;
    // TODO: add missing fields
  };
  // TODO: add missing fields
  sortIndex: number;
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
