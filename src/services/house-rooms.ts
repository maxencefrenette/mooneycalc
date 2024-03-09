import { gameData } from "./data";

export const houseRooms = Object.values(gameData.houseRoomDetailMap).sort(
  (a, b) => a.sortIndex - b.sortIndex,
);
