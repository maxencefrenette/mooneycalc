import { type ActionDetail, gameData, type ItemCount } from "./data";
import { itemName } from "./items";
import { type Market } from "./market";
import { type Settings } from "./settings";

const sortedActions = Object.values(gameData.actionDetailMap).sort(
  (a, b) =>
    1000 * gameData.actionTypeDetailMap[a.type]!.sortIndex +
    a.sortIndex -
    (1000 * gameData.actionTypeDetailMap[b.type]!.sortIndex + b.sortIndex),
);

export interface ComputedAction {
  id: string;
  name: string;
  skillHrid: string;
  levelRequired: number;
  inputs: ItemCount[];
  inputsPrice: number;
  outputs: ItemCount[];
  outputsPrice: number;
  actionsPerHour: number;
  profit: number;
}

function getToolBonuses(skillHrid: string, settings: Settings) {
  let speed = 0;
  let efficiency = 0;

  for (const equipmentHrid of Object.values(settings.equipment)) {
    if (equipmentHrid === null) continue;

    const equipment = gameData.itemDetailMap[equipmentHrid]!;
    const stats = equipment.equipmentDetail.noncombatStats;

    if (!stats) debugger;

    if (skillHrid === "/skills/milking") {
      speed += stats.milkingSpeed;
      efficiency += stats.milkingEfficiency;
    }
    if (skillHrid === "/skills/foraging") {
      speed += stats.foragingSpeed;
      efficiency += stats.foragingEfficiency;
    }
    if (skillHrid === "/skills/woodcutting") {
      speed += stats.woodcuttingSpeed;
      efficiency += stats.woodcuttingEfficiency;
    }
    if (skillHrid === "/skills/cheesesmithing") {
      speed += stats.cheesesmithingSpeed;
      efficiency += stats.cheesesmithingEfficiency;
    }
    if (skillHrid === "/skills/crafting") {
      speed += stats.craftingSpeed;
      efficiency += stats.craftingEfficiency;
    }
    if (skillHrid === "/skills/tailoring") {
      speed += stats.tailoringSpeed;
      efficiency += stats.tailoringEfficiency;
    }
    if (skillHrid === "/skills/cooking") {
      speed += stats.cookingSpeed;
      efficiency += stats.cookingEfficiency;
    }
    if (skillHrid === "/skills/brewing") {
      speed += stats.brewingSpeed;
      efficiency += stats.brewingEfficiency;
    }
    if (skillHrid === "/skills/enhancing") {
      speed += stats.enhancingSpeed;
      efficiency += stats.enhancingSuccess;
    }
    speed += stats.taskSpeed;
    efficiency += stats.skillingEfficiency;
  }

  return { speed, efficiency };
}

function computeSingleAction(
  action: ActionDetail,
  settings: Settings,
  market: Market,
): ComputedAction {
  const inputs = action.inputItems?.slice() ?? [];
  if (action.upgradeItemHrid) {
    inputs.push({ itemHrid: action.upgradeItemHrid, count: 1 });
  }

  let outputs = action.outputItems ?? [];
  if (action.dropTable) {
    const dropTableOutputs = action.dropTable.map((e) => ({
      itemHrid: e.itemHrid,
      count: e.dropRate * 0.5 * (e.minCount + e.maxCount),
    }));
    outputs = [...outputs, ...dropTableOutputs];
  }

  // Compute tool bonuses
  const { speed: toolSpeed, efficiency: toolEfficiency } = getToolBonuses(
    action.levelRequirement.skillHrid,
    settings,
  );

  // Compute level efficiency
  const level = settings.levels[action.levelRequirement.skillHrid]!;
  const levelsAboveRequirement = Math.max(
    0,
    level - action.levelRequirement.level,
  );
  const levelEfficiency = 0.01 * levelsAboveRequirement;

  // Compute actions per hour
  const baseActionsPerHour = 3600_000_000_000 / action.baseTimeCost;
  const speed = 1 + toolSpeed;
  const efficiency = 1 + toolEfficiency + levelEfficiency;
  const actionsPerHour = baseActionsPerHour * speed * efficiency;

  // Compute profits
  const revenue = outputs.reduce((sum, output) => {
    if (output.itemHrid === "/items/coin")
      return sum + output.count * actionsPerHour;

    let { bid, ask } = market.market[itemName(output.itemHrid)] ?? {
      bid: -1,
      ask: -1,
    };
    if (bid === -1) bid = 0;
    if (ask === -1) ask = bid;

    const p = settings.market.outputBidAskProportion;
    let price = (1 - p) * bid + p * ask;

    // TODO: set price to sell price if it's higher than market price
    price = Math.max(price, gameData.itemDetailMap[output.itemHrid]!.sellPrice);

    return sum + price * output.count;
  }, 0);
  const cost = inputs.reduce((sum, input) => {
    if (input.itemHrid === "/items/coin")
      return sum + input.count * actionsPerHour;

    let { bid, ask } = market.market[itemName(input.itemHrid)] ?? {
      bid: -1,
      ask: -1,
    };
    if (ask === -1) ask = 1e9;
    if (bid === -1) bid = ask;

    const p = settings.market.inputBidAskProportion;
    const price = (1 - p) * ask + p * bid;

    return sum + price * input.count;
  }, 0);
  const profit = (revenue - cost) * actionsPerHour;

  return {
    id: action.hrid,
    skillHrid: action.levelRequirement.skillHrid,
    levelRequired: action.levelRequirement.level,
    name: action.name,
    inputs,
    inputsPrice: cost,
    outputs,
    outputsPrice: revenue,
    actionsPerHour,
    profit,
  };
}

export function getActions(settings: Settings, market: Market) {
  let actions = Object.values(sortedActions);

  // Filter out actions with unmet level requirements
  if (settings.filters.hideUnmetLevelRequirements) {
    actions = actions.filter((a) => {
      const level = settings.levels[a.levelRequirement.skillHrid]!;
      return level >= a.levelRequirement.level;
    });
  }

  const computedActions = actions.map((a) =>
    computeSingleAction(a, settings, market),
  );
  return computedActions;
}
