import { Game } from '../model/game';
import gameDb from '../repository/game.db';

const getAllGames = (): Game[] => {
  return gameDb.getAllGames();
}

const getGameById = (id: number): Game => {
  const lecturer: Game | null = gameDb.getGameById({ id: id });
  if (lecturer == null) throw new Error(`Game with id ${id} does not exist.`);
  return lecturer;
}

export default {
  getAllGames,
  getGameById
}