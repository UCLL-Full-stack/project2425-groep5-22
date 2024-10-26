import { Game } from "../model/game";

const games: Game[] = []

const getAllGames = (): Game[] => {
  return games;
};

const getGameById = ({ id }: { id: number }): Game | null => {
  return games.find(game => game.getId() === id) ?? null;
};

export default {
  getAllGames,
  getGameById
};
