import { type PlayerStats } from "~/services/player-stats";

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
      <h1>Player Stats</h1>
      <div>
        {Object.entries(playerStats.levels).map(([skillHrid, level]) => (
          <div key={skillHrid}>
            {skillHrid}: {level}
            <button
              onClick={() =>
                updatePlayerStats({
                  ...playerStats,
                  levels: {
                    ...playerStats.levels,
                    [skillHrid]: level + 1,
                  },
                })
              }
            >
              +
            </button>
            <button
              onClick={() =>
                updatePlayerStats({
                  ...playerStats,
                  levels: {
                    ...playerStats.levels,
                    [skillHrid]: level - 1,
                  },
                })
              }
            >
              -
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
