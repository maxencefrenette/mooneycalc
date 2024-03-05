"use client";

import { type Settings } from "~/services/settings";
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
import { BidAskSlider } from "./bid-ask-slider";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

export interface SettingsFormProps {
  settings: Settings;
  updateSettings: (settings: Settings) => void;
}

export function SettingsForm({ settings, updateSettings }: SettingsFormProps) {
  return (
    <div>
      <h1 className="pb-4 text-xl">Levels</h1>
      <div className="flex flex-wrap gap-4">
        {skills.map(({ hrid, name }) => {
          const level = settings.levels[hrid]!;

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
      </div>
      <div className="h-12" />
      <h1 className="pb-4 text-xl">Equipment</h1>
      <div className="flex flex-wrap gap-4">
        {equipmentTypes.map(({ hrid, name }) => {
          const equipment = settings.equipment[hrid]!;

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
                  ) : null}
                  {itemsByEquipmentType(hrid).map(
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
      <div className="h-12" />
      <h1 className="pb-4 text-xl">Market</h1>
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
    </div>
  );
}
