import { gameData } from "./data";
import { type Mutate, type StoreApi, create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from "zod";

const SettingsSchema = z.object({
  levels: z.record(z.number()),
  equipment: z.record(z.union([z.string(), z.null()])),
  market: z.object({
    inputBidAskProportion: z.number(),
    outputBidAskProportion: z.number(),
    pricePeriod: z.union([z.literal("latest"), z.literal("median")]),
  }),
  filters: z.object({
    hideUnmetLevelRequirements: z.boolean(),
  }),
});

export type Settings = z.infer<typeof SettingsSchema>;

const PersistedStateSchema = z.object({
  settings: SettingsSchema,
});
type PersistedState = z.infer<typeof PersistedStateSchema>;

const DeepPartialPersistedStateSchema = PersistedStateSchema.deepPartial();
type DeepPartialPersistedState = z.infer<
  typeof DeepPartialPersistedStateSchema
>;

export interface SettingsState extends PersistedState {
  updateSettings: (newSettings: Settings) => void;
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
    outputBidAskProportion: 0.0,
    pricePeriod: "latest",
  },
  filters: {
    hideUnmetLevelRequirements: true,
  },
};

function strictMergeRecords<T>(
  a: Record<string, T>,
  b: Record<string, T>,
): Record<string, T> {
  const result: Record<string, T> = {};
  for (const key of Object.keys(a)) {
    if (b[key] === undefined) {
      result[key] = a[key]!;
    } else {
      result[key] = b[key]!;
    }
  }
  return result;
}

function mergeStates(
  currentState: SettingsState,
  persistedState: DeepPartialPersistedState,
): SettingsState {
  return {
    ...currentState,
    settings: {
      levels: strictMergeRecords(
        currentState.settings.levels,
        persistedState.settings?.levels ?? {},
      ),
      equipment: strictMergeRecords(
        currentState.settings.equipment,
        persistedState.settings?.equipment ?? {},
      ),
      market: {
        inputBidAskProportion:
          persistedState.settings?.market?.inputBidAskProportion ??
          currentState.settings.market.inputBidAskProportion,
        outputBidAskProportion:
          persistedState.settings?.market?.outputBidAskProportion ??
          currentState.settings.market.outputBidAskProportion,
        pricePeriod:
          persistedState.settings?.market?.pricePeriod ??
          currentState.settings.market.pricePeriod,
      },
      filters: {
        hideUnmetLevelRequirements:
          persistedState.settings?.filters?.hideUnmetLevelRequirements ??
          currentState.settings.filters.hideUnmetLevelRequirements,
      },
    },
  };
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: initialSettings,
      updateSettings: (newSettings) => set({ settings: newSettings }),
    }),
    {
      name: "settings",
      merge: (rawPersistedState, currentState) => {
        const result =
          DeepPartialPersistedStateSchema.safeParse(rawPersistedState);
        if (!result.success) {
          console.error("Failed to parse persisted settings", result.error);
          return currentState;
        }

        const persistedState = result.data;
        return mergeStates(currentState, persistedState);
      },
      partialize: (state) => {
        return PersistedStateSchema.parse(state);
      },
    },
  ),
);

// Rehydrate on storage event
// See https://docs.pmnd.rs/zustand/integrations/persisting-store-data#how-can-i-rehydrate-on-storage-event
type StoreWithPersist = Mutate<
  StoreApi<SettingsState>,
  [["zustand/persist", unknown]]
>;

const withStorageDOMEvents = (store: StoreWithPersist) => {
  const storageEventCallback = (e: StorageEvent) => {
    if (e.key === store.persist.getOptions().name && e.newValue) {
      void store.persist.rehydrate();
    }
  };

  window.addEventListener("storage", storageEventCallback);

  return () => {
    window.removeEventListener("storage", storageEventCallback);
  };
};

withStorageDOMEvents(useSettingsStore as StoreWithPersist);
