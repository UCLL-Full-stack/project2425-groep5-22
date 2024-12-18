import { Game } from '../model/game';
import { Intensity } from '../model/intensity';
import { Tag } from '../model/tag';
import { User } from '../model/user';
import gameDb from '../repository/game.db';
import intensityDb from '../repository/intensity.db';
import tagDb from '../repository/tag.db';
import userDb from '../repository/user.db';
import { GameInput } from '../types';

const getAllGames = async (): Promise<Game[]> => {
  return gameDb.getAllGames();
}

const getGame = async ({ id }: { id: number }): Promise<Game> => {
  const game = await gameDb.getGameById({ id });
  if (!game) {
    throw new Error(`Game with id: ${game} does not exist.`);
  }

  return game;
}

const createGame = async ({ user, intensity, name, groups, duration, explanation, tags }: GameInput): Promise<Game> => {
  // Check if the course and the lecturer have an id
  if (user.id == undefined) throw new Error('User id is required.');
  if (intensity.id == undefined) throw new Error('Intensity id is required.');

  // Check if the course and lecturer exist
  const userFound: User | null = await userDb.getUserById({ id: user.id });
  if (userFound == null) throw new Error('User not found with the given ID');
  const intensityFound: Intensity | null = await intensityDb.getIntensityById({ id: intensity.id });
  if (intensityFound == null) throw new Error('Intensity not found with the given ID');

  // Check if the tags exist and create if not
  const allTags: Tag[] = [];
  for (const tag of tags) {
    let tagFound = await tagDb.getTagByTag({ tag: tag });
    if (tagFound == null) {
      const createTag = new Tag({ tag: tag });
      tagFound = await tagDb.createTag({ tag: createTag });
    }
    allTags.push(tagFound);
  }

  // Create the game
  const game = new Game({
    user: userFound,
    intensity: intensityFound,
    name: name,
    groups: groups,
    duration: duration,
    explanation: explanation,
    tags: allTags,
  });

  return gameDb.createGame({ game: game });
};

export default {
  getAllGames,
  createGame,
  getGame
}