"use client";

import { type Settings } from "~/services/settings";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { skills } from "~/services/skills";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { equipmentTypes } from "~/services/equipment-types";
import {
  isSkillingEquipment,
  itemName,
  itemsByEquipmentType,
} from "~/services/items";
import { BidAskSlider } from "./bid-ask-slider";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { gameData } from "~/services/data";

export interface SettingsFormProps {
  settings: Settings;
  updateSettings: (settings: Settings) => void;
}

export function SettingsForm({ settings, updateSettings }: SettingsFormProps) {
  // Filter out combat skills
  const combatSkillsHrids = [
    "/skills/stamina",
    "/skills/intelligence",
    "/skills/attack",
    "/skills/power",
    "/skills/defense",
    "/skills/ranged",
    "/skills/magic",
  ];
  const skillingSkills = skills.filter(
    ({ hrid }) => !combatSkillsHrids.includes(hrid),
  );

  return (
    <Tabs defaultValue="levels">
      <TabsList>
        <TabsTrigger value="levels">Levels</TabsTrigger>
        <TabsTrigger value="skilling-equipment">Skilling Equipment</TabsTrigger>
        <TabsTrigger value="house">House</TabsTrigger>
        <TabsTrigger value="community-buffs">Community Buffs</TabsTrigger>
        <TabsTrigger value="market">Market</TabsTrigger>
        <TabsTrigger value="filters">Filters</TabsTrigger>
      </TabsList>
      <div className="h-4"></div>
      <TabsContent value="levels">
        <Card>
          <CardHeader>
            <CardTitle>Levels</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-flow-row grid-cols-[repeat(auto-fit,minmax(160px,_1fr))] gap-4">
            {skillingSkills.map(({ hrid, name }) => {
              const level = settings.levels[hrid]!;

              return (
                <div key={hrid} className="grid items-center gap-1.5">
                  <Label htmlFor={hrid}>{name}</Label>
                  <Input
                    type="number"
                    id={hrid}
                    value={level}
                    onChange={(e) =>
                      updateSettings({
                        ...settings,
                        levels: {
                          ...settings.levels,
                          [hrid]: parseInt(e.target.value, 10),
                        },
                      })
                    }
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="skilling-equipment">
        <Card>
          <CardHeader>
            <CardTitle>Skilling Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-flow-row grid-cols-[repeat(auto-fit,minmax(160px,_1fr))] gap-4">
              {equipmentTypes.map(({ hrid, name }) => {
                const selectedEquipment = settings.equipment[hrid]!;

                // Filter out items that provide no non-combat bonuses
                const equipmentOptions =
                  itemsByEquipmentType(hrid).filter(isSkillingEquipment);

                return (
                  <div key={hrid} className="grid items-center gap-1.5">
                    <Label htmlFor={hrid}>{name}</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Input
                          type="text"
                          id={hrid}
                          value={itemName(selectedEquipment) ?? ""}
                          readOnly
                          className="cursor-pointer"
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() =>
                            updateSettings({
                              ...settings,
                              equipment: {
                                ...settings.equipment,
                                [hrid]: null,
                              },
                            })
                          }
                        >
                          None
                        </DropdownMenuItem>
                        {equipmentOptions.map(
                          ({ hrid: itemHrid, name: itemName }) => (
                            <DropdownMenuItem
                              key={itemHrid}
                              onClick={() =>
                                updateSettings({
                                  ...settings,
                                  equipment: {
                                    ...settings.equipment,
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
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="house">
        <Card>
          <CardHeader>
            <CardTitle>House</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-flow-row grid-cols-[repeat(auto-fit,minmax(160px,_1fr))] gap-4">
              {Object.values(gameData.houseRoomDetailMap).map((houseRoom) => {
                const selectedLevel = settings.houseRooms[houseRoom.hrid]!;

                return (
                  <div
                    key={houseRoom.hrid}
                    className="grid items-center gap-1.5"
                  >
                    <Label htmlFor={houseRoom.hrid}>{houseRoom.name}</Label>
                    <Input
                      type="number"
                      id={houseRoom.hrid}
                      min={0}
                      max={8}
                      value={selectedLevel}
                      onChange={(e) =>
                        updateSettings({
                          ...settings,
                          houseRooms: {
                            ...settings.houseRooms,
                            [houseRoom.hrid]: parseInt(e.target.value, 10),
                          },
                        })
                      }
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="community-buffs">
        <Card>
          <CardHeader>
            <CardTitle>Community Buffs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-flow-row grid-cols-[repeat(auto-fit,minmax(160px,_1fr))] gap-4">
              {Object.values(gameData.communityBuffTypeDetailMap).map(
                (communityBuffType) => {
                  const selectedLevel =
                    settings.communityBuffs[communityBuffType.hrid]!;

                  return (
                    <div
                      key={communityBuffType.hrid}
                      className="grid items-center gap-1.5"
                    >
                      <Label htmlFor={communityBuffType.hrid}>
                        {communityBuffType.name}
                      </Label>
                      <Input
                        type="number"
                        id={communityBuffType.hrid}
                        min={0}
                        max={20}
                        value={selectedLevel}
                        onChange={(e) =>
                          updateSettings({
                            ...settings,
                            communityBuffs: {
                              ...settings.communityBuffs,
                              [communityBuffType.hrid]: parseInt(
                                e.target.value,
                                10,
                              ),
                            },
                          })
                        }
                      />
                    </div>
                  );
                },
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="market">
        <Card>
          <CardHeader>
            <CardTitle>Market</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around">
              <BidAskSlider
                label="Input Item Prices"
                inverted={true}
                value={settings.market.inputBidAskProportion}
                updateValue={(value) =>
                  updateSettings({
                    ...settings,
                    market: {
                      ...settings.market,
                      inputBidAskProportion: value,
                    },
                  })
                }
              />
              <BidAskSlider
                label="Output Item Prices"
                inverted={false}
                value={settings.market.outputBidAskProportion}
                updateValue={(value) =>
                  updateSettings({
                    ...settings,
                    market: {
                      ...settings.market,
                      outputBidAskProportion: value,
                    },
                  })
                }
              />
              <RadioGroup
                value={settings.market.pricePeriod}
                onValueChange={(value) => {
                  if (value !== "latest" && value !== "median") {
                    return;
                  }

                  return updateSettings({
                    ...settings,
                    market: {
                      ...settings.market,
                      pricePeriod: value,
                    },
                  });
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="latest" id="latest" />
                  <Label htmlFor="latest">Latest Prices</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="median" id="median" />
                  <Label htmlFor="median">24h Median Prices</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="filters">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hide-unmet-level-requirements"
                checked={settings?.filters?.hideUnmetLevelRequirements ?? true}
                onCheckedChange={(checked) => {
                  if (checked === "indeterminate") {
                    return;
                  }

                  return updateSettings({
                    ...settings,
                    filters: {
                      ...settings.filters,
                      hideUnmetLevelRequirements: checked,
                    },
                  });
                }}
              />
              <Label
                htmlFor="hide-unmet-level-requirements"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Hide actions with unmet level requirements
              </Label>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
