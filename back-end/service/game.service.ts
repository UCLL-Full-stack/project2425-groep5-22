import { UnauthorizedError } from 'express-jwt';
import { Game } from '../model/game';
import { Intensity } from '../model/intensity';
import { Tag } from '../model/tag';
import { User } from '../model/user';
import gameDb from '../repository/game.db';
import intensityDb from '../repository/intensity.db';
import tagDb from '../repository/tag.db';
import userDb from '../repository/user.db';
import { GameInput, Role } from '../types';

const getAllGames = async (): Promise<Game[]> => {
  return await gameDb.getAllGames();
};

const getGamesRandom = async (): Promise<Game[]> => {
  const games = await gameDb.getAllGames();
  for (let i = games.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [games[i], games[j]] = [games[j], games[i]]; // Swap elements
  }
  return games;
};


export const getFilteredGames = async (filters: {
  tags?: string[];
  intensityId?: number;
  groups?: boolean;
  duration?: number;
}): Promise<Game[]> => {
  const durationRange = filters.duration
    ? {
      gte: filters.duration * 0.8, // 20% less
      lte: filters.duration * 1.2, // 20% more
    }
    : undefined;

  return await gameDb.getFilteredGames({
    tags: filters.tags,
    intensityId: filters.intensityId,
    groups: filters.groups,
    durationRange,
  });
};

const getGame = async ({ id }: { id: number }): Promise<Game> => {
  const game = await gameDb.getGameById({ id });

  if (!game) {
    throw new Error(`Game with id: ${id} does not exist.`);
  }

  return game;
};

const getUserGames = async (username: string) => {
  const userFound: User | null = await userDb.getUserByUsername({ username });
  if (!userFound) {
    throw new Error(`User with username: ${username} does not exist.`);
  }

  try {
    const games = await gameDb.getGamesByUser({ username });

    return games;
  } catch (error) {
    console.error('Error in GameService:', error);
    throw new Error('Failed to fetch games for the user');
  }
};

const createGame = async ({
  user,
  intensity,
  name,
  groups,
  duration,
  explanation,
  tags,
}: GameInput): Promise<Game> => {
  if (!user.id) {
    throw new Error('User id is required.');
  }

  if (!intensity.id) {
    throw new Error('Intensity id is required.');
  }

  const userFound: User | null = await userDb.getUserById({ id: user.id });
  if (!userFound) {
    throw new Error('User not found with the given ID');
  }

  const intensityFound: Intensity | null = await intensityDb.getIntensityById({ id: intensity.id });
  if (!intensityFound) {
    throw new Error('Intensity not found with the given ID');
  }

  const allTags: Tag[] = [];
  for (const tag of tags) {
    let tagFound = await tagDb.getTagByTag({ tag });
    if (!tagFound) {
      const createTag = new Tag({ tag });
      tagFound = await tagDb.createTag({ tag: createTag });
    }
    allTags.push(tagFound);
  }

  const game = new Game({
    user: userFound,
    intensity: intensityFound,
    name,
    groups,
    duration,
    explanation,
    tags: allTags,
  });

  return await gameDb.createGame({ game });
};

const updateGame = async ({
  gameId,
  user,
  intensity,
  name,
  groups,
  duration,
  explanation,
  tags,
  email,
  role,
}: GameInput & { gameId: number; email: string; role: Role }): Promise<Game> => {
  const gameFound: Game | null = await gameDb.getGameById({ id: gameId });
  if (!gameFound) {
    throw new Error(`Game with id: ${gameId} does not exist.`);
  }

  if (!user.id) {
    throw new Error('User id is required.');
  }

  if (!intensity.id) {
    throw new Error('Intensity id is required.');
  }

  const userByEmail: User | null = await userDb.getUserByEmail({ email });
  if (!userByEmail) {
    throw new Error(`User with email: ${email} does not exist.`);
  }

  const userById: User | null = await userDb.getUserById({ id: user.id });
  if (!userById) {
    throw new Error(`User with id: ${user.id} does not exist.`);
  }

  if (
    userByEmail.getId() !== userById.getId() &&
    role !== 'admin' &&
    role !== 'superadmin'
  ) {
    throw new UnauthorizedError('credentials_required', {
      message: 'You are not authorized to access this resource.',
    });
  }

  const intensityFound: Intensity | null = await intensityDb.getIntensityById({ id: intensity.id });
  if (!intensityFound) {
    throw new Error(`Intensity with id: ${intensity.id} does not exist.`);
  }

  const allTags: Tag[] = [];
  for (const tag of tags) {
    let tagFound = await tagDb.getTagByTag({ tag: tag });
    if (!tagFound) {
      const createTag = new Tag({ tag });
      tagFound = await tagDb.createTag({ tag: createTag });
    }
    allTags.push(tagFound);
  }

  gameFound.setIntensity(intensityFound);
  gameFound.setName(name);
  gameFound.setGroups(groups);
  gameFound.setDuration(duration);
  gameFound.setExplanation(explanation);
  gameFound.setTags(allTags);

  return await gameDb.updateGame({ game: gameFound });
};

const deleteGame = async ({ gameId, email, role }: { gameId: number; email: string; role: Role }): Promise<void> => {
  // Check if the game exists
  const gameFound: Game | null = await gameDb.getGameById({ id: gameId });
  if (gameFound == null) throw new Error(`Game with id: ${gameId} does not exist.`);

  const userByEmail: User | null = await userDb.getUserByEmail({ email });
  if (!userByEmail) {
    throw new Error(`User with email: ${email} does not exist.`);
  }

  const userById: User | null = await userDb.getUserById({ id: gameFound.getUser().getId() as number });
  if (!userById) {
    throw new Error(`User with id: ${gameFound.getUser().getId()} does not exist.`);
  }

  if (
    userByEmail.getId() !== userById.getId() &&
    role !== 'admin' &&
    role !== 'superadmin'
  ) {
    throw new UnauthorizedError('credentials_required', {
      message: 'You are not authorized to access this resource.',
    });
  }

  // Delete the game
  await gameDb.deleteGame({ id: gameId });
  await tagDb.cleanUpTags();
};


export default {
  getAllGames,
  getGame,
  createGame,
  updateGame,
  deleteGame,
  getGamesRandom,
  getFilteredGames,
  getUserGames
};
