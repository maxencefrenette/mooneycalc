"use client";

import { type PlayerStats } from "~/services/player-stats";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { skills } from "~/services/skills";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { equipmentTypes } from "~/services/equipment-types";
import { itemsByEquipmentType } from "~/services/items";

export interface PlayerStatsFormProps {
  playerStats: PlayerStats;
  updatePlayerStats: (playerStats: PlayerStats) => void;
}

export function PlayerStatsForm({
  playerStats,
  updatePlayerStats,
}: PlayerStatsFormProps) {
  return (
    <div>
      <h1 className="pb-4 text-xl">Levels</h1>
      <div className="flex flex-wrap gap-4">
        {skills.map(({ hrid, name }) => {
          const level = playerStats.levels[hrid]!;

          return (
            <div
              key={hrid}
              className="grid w-full max-w-xs items-center gap-1.5"
            >
              <Label htmlFor={hrid}>{name}</Label>
              <Input
                type="number"
                id={hrid}
                value={level}
                onChange={(e) =>
                  updatePlayerStats({
                    ...playerStats,
                    levels: {
                      ...playerStats.levels,
                      [hrid]: parseInt(e.target.value, 10),
                    },
                  })
                }
              />
            </div>
          );
        })}
      </div>
      <div className="h-12" />
      <h1 className="pb-4 text-xl">Equipment</h1>
      <div className="flex flex-wrap gap-4">
        {equipmentTypes.map(({ hrid, name }) => {
          const equipment = playerStats.equipment[hrid]!;

          return (
            <div
              key={hrid}
              className="grid w-full max-w-xs items-center gap-1.5"
            >
              <Label htmlFor={hrid}>{name}</Label>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Input
                    type="text"
                    id={hrid}
                    value={equipment ?? ""}
                    readOnly
                    className="cursor-pointer"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Select {name}</DropdownMenuLabel>
                  {equipment ? (
                    <DropdownMenuItem
                      onClick={() =>
                        updatePlayerStats({
                          ...playerStats,
                          equipment: {
                            ...playerStats.equipment,
                            [hrid]: null,
                          },
                        })
                      }
                    >
                      None
                    </DropdownMenuItem>
                  ) : null}
                  {itemsByEquipmentType(hrid).map(
                    ({ hrid: itemHrid, name: itemName }) => (
                      <DropdownMenuItem
                        key={itemHrid}
                        onClick={() =>
                          updatePlayerStats({
                            ...playerStats,
                            equipment: {
                              ...playerStats.equipment,
                              [hrid]: itemHrid,
                            },
                          })
                        }
                      >
                        {itemName}
                      </DropdownMenuItem>
                    ),
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </div>
    </div>
  );
}
