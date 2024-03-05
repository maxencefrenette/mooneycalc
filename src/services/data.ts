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
  description: string;
  categoryHrid: string;
  sellPrice: number;
  isTradeable: boolean;
  isOpenable: boolean;
  itemLevel: number;
  enhancementCosts: unknown; // TODO
  protectionItemHrids: unknown; // TODO
  equipmentDetail: {
    type: string;
    combatStats: unknown; // TODO
    noncombatStats: {
      milkingSpeed: number;
      foragingSpeed: number;
      woodcuttingSpeed: number;
      cheesesmithingSpeed: number;
      craftingSpeed: number;
      tailoringSpeed: number;
      cookingSpeed: number;
      brewingSpeed: number;
      enhancingSpeed: number;
      taskSpeed: number;
      milkingEfficiency: number;
      foragingEfficiency: number;
      woodcuttingEfficiency: number;
      cheesesmithingEfficiency: number;
      craftingEfficiency: number;
      tailoringEfficiency: number;
      cookingEfficiency: number;
      brewingEfficiency: number;
      skillingEfficiency: number;
      enhancingSuccess: number;
      gatheringQuantity: number;
      skillingRareFind: number;
      skillingExperience: number;
    };
  };
  consumableDetail: unknown; // TODO
  abilityBookDetail: unknown; // TODO
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
