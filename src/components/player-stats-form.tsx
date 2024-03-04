import { type PlayerStats } from "~/services/player-stats";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { gameData } from "~/services/data";
import { sortedSkills } from "~/services/skills";

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
      <h1 className="pb-4 text-xl">Player Stats</h1>
      <div className="flex flex-wrap gap-4">
        {sortedSkills.map(({ hrid, name }) => {
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
    </div>
  );
}
