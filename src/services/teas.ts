import { items } from "./items";

export const TEA_PER_HOUR = 12;
export const teas = items
  .filter((item) => item.categoryHrid === "/item_categories/drink")
  .sort((a, b) => a.sortIndex - b.sortIndex);

/**
 * Returns all combinations of up to n elements from arr.
 */
function chooseUpTo<T>(n: number, arr: T[]): T[][] {
  if (arr.length == 0) return [[]];
  if (n === 0) return [[]];

  const first = arr[0]!;
  return [
    ...chooseUpTo(n - 1, arr.slice(1)).map((rest) => [first, ...rest]),
    ...chooseUpTo(n, arr.slice(1)),
  ];
}

console.log(chooseUpTo(3, [1, 2, 3]));

// TODO: add wisdom tea
// TODO: add processing tea
export const teaLoadoutByActionType: Record<string, string[][]> = {
  "/action_types/milking": chooseUpTo(3, [
    "/items/milking_tea",
    "/items/super_milking_tea",
    "/items/efficiency_tea",
    "/items/artisan_tea",
  ]),
  "/action_types/foraging": chooseUpTo(3, [
    "/items/foraging_tea",
    "/items/super_foraging_tea",
    "/items/efficiency_tea",
    "/items/artisan_tea",
  ]),
  "/action_types/woodcutting": chooseUpTo(3, [
    "/items/woodcutting_tea",
    "/items/super_woodcutting_tea",
    "/items/efficiency_tea",
    "/items/artisan_tea",
  ]),
  "/action_types/cheesesmithing": chooseUpTo(3, [
    "/items/cheesesmithing_tea",
    "/items/super_cheesesmithing_tea",
    "/items/efficiency_tea",
    "/items/artisan_tea",
  ]),
  "/action_types/crafting": chooseUpTo(3, [
    "/items/crafting_tea",
    "/items/super_crafting_tea",
    "/items/efficiency_tea",
    "/items/artisan_tea",
  ]),
  "/action_types/tailoring": chooseUpTo(3, [
    "/items/tailoring_tea",
    "/items/super_tailoring_tea",
    "/items/efficiency_tea",
    "/items/artisan_tea",
  ]),
  "/action_types/cooking": chooseUpTo(3, [
    "/items/cooking_tea",
    "/items/super_cooking_tea",
    "/items/efficiency_tea",
    "/items/gourmet_tea",
    "/items/artisan_tea",
  ]),
  "/action_types/brewing": chooseUpTo(3, [
    "/items/brewing_tea",
    "/items/super_brewing_tea",
    "/items/efficiency_tea",
    "/items/gourmet_tea",
    "/items/artisan_tea",
  ]),
};

console.log(teaLoadoutByActionType["/action_types/brewing"]);
