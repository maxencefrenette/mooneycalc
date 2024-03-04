import rawGameData from "~/data/init_client_info.json";

interface GameData {
  actionDetailMap: Record<string, ActionDetail>;
}

interface ActionDetail {
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
  inputItem: ItemCount[];
  outputItem: ItemCount[];
  monsterSpawnInfo: unknown;
  sortIndex: number;
}

interface ItemCount {
  itemHrid: string;
  count: number;
}

// There is probably a cleaner way to type this
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
const gameData: GameData = rawGameData as any;

export function getActions() {
  return Object.values(gameData.actionDetailMap);
}
