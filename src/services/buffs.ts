import { gameData } from "./data";

export const buffTypes = Object.values(gameData.buffTypeDetailMap).sort(
  (a, b) => a.sortIndex - b.sortIndex,
);
export const BUFF_TYPE_ACTION_SPEED = "/buff_types/action_speed";
export const BUFF_TYPE_EFFICIENCY = "/buff_types/efficiency";
export const BUFF_TYPE_ENHANCING_SUCCESS = "/buff_types/enhancing_success";
export const BUFF_TYPE_GATHERING = "/buff_types/gathering";
export const BUFF_TYPE_TASK_SPEED = "/buff_types/task_speed";
export const BUFF_TYPE_RARE_FIND = "/buff_types/rare_find";
export const BUFF_TYPE_WISDOM = "/buff_types/wisdom";

export type Bonuses = Record<string, number>;

export function zeroBonuses(): Bonuses {
  return Object.fromEntries(buffTypes.map((buffType) => [buffType.hrid, 0]));
}

export function addBonuses(...effects: Bonuses[]) {
  const result: Bonuses = zeroBonuses();
  for (const effect of effects) {
    for (const [key, value] of Object.entries(effect)) {
      result[key] += value;
    }
  }
  return result;
}
