import { items } from "./items";

export const TEA_PER_HOUR = 12;
export const teas = items
  .filter((item) => item.categoryHrid === "/item_categories/drink")
  .sort((a, b) => a.sortIndex - b.sortIndex);

// TODO: add wisdom tea
// TODO: add processing tea
export const teaLoadoutByActionType: Record<string, string[][]> = {
  "/action_types/milking": [
    [],
    ["/items/milking_tea"],
    ["/items/super_milking_tea"],
    ["/items/gathering_tea"],
    ["/items/efficiency_tea"],
  ],
  "/action_types/foraging": [
    [],
    ["/items/foraging_tea"],
    ["/items/super_foraging_tea"],
    ["/items/gathering_tea"],
    ["/items/efficiency_tea"],
  ],
  "/action_types/woodcutting": [
    [],
    ["/items/woodcutting_tea"],
    ["/items/super_woodcutting_tea"],
    ["/items/gathering_tea"],
    ["/items/efficiency_tea"],
  ],
  "/action_types/cheesesmithing": [
    [],
    ["/items/cheesesmithing_tea"],
    ["/items/super_cheesesmithing_tea"],
    ["/items/efficiency_tea"],
    ["/items/gourmet_tea"],
    ["/items/artisan_tea"],
  ],
  "/action_types/crafting": [
    [],
    ["/items/crafting_tea"],
    ["/items/super_crafting_tea"],
    ["/items/efficiency_tea"],
    ["/items/gourmet_tea"],
    ["/items/artisan_tea"],
  ],
  "/action_types/tailoring": [
    [],
    ["/items/tailoring_tea"],
    ["/items/super_tailoring_tea"],
    ["/items/efficiency_tea"],
    ["/items/gourmet_tea"],
    ["/items/artisan_tea"],
  ],
  "/action_types/cooking": [
    [],
    ["/items/cooking_tea"],
    ["/items/super_cooking_tea"],
    ["/items/efficiency_tea"],
    ["/items/gourmet_tea"],
    ["/items/artisan_tea"],
  ],
  "/action_types/brewing": [
    [],
    ["/items/brewing_tea"],
    ["/items/super_brewing_tea"],
    ["/items/efficiency_tea"],
    ["/items/gourmet_tea"],
    ["/items/artisan_tea"],
  ],
};
