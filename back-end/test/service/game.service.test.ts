import gameService from '../../service/game.service';
import gameDb from '../../repository/game.db';
import userDb from '../../repository/user.db';
import { Game } from '../../model/game';
import { User } from '../../model/user';
import { Intensity } from '../../model/intensity';
import { Tag } from '../../model/tag';
import { GameInput, UserInput, IntensityInput } from '../../types';

// Test data setup
const userInput: UserInput = {
  id: 1,
  username: 'John Doe',
  role: "guest",
  email: 'john@jeugdwerk.org',
  password: 'password123'
};

const user = new User({
  ...userInput
});

const intensityInput: IntensityInput = {
  id: 1,
  intensity: 'Medium',
  order: 2
};

const intensity = new Intensity({
  ...intensityInput
});

const tagInputs = [
  { id: 1, tag: 'outdoor' },
  { id: 2, tag: 'team' }
];

const tags = [
  new Tag({ ...tagInputs[0] }),
  new Tag({ ...tagInputs[1] })
];

const gameInput: GameInput = {
  user: userInput,
  intensity: intensityInput,
  name: 'Capture the Flag',
  groups: true,
  duration: 30,
  explanation: 'Team game where players...',
  tags: ['outdoor', 'team']
};

const game = new Game({
  id: 1,
  user: user,
  intensity: intensity,
  name: 'Capture the Flag',
  groups: true,
  duration: 30,
  explanation: 'Team game where players...',
  tags
});

beforeEach(() => {
  jest.clearAllMocks();
});

test('given: games exist in database, when: getAllGames is called, then: all games are returned', async () => {
  // Given
  jest.spyOn(gameDb, 'getAllGames').mockResolvedValue([game]);

  // When
  const result = await gameService.getAllGames();

  // Then
  expect(result).toEqual([game]);
  expect(gameDb.getAllGames).toHaveBeenCalledTimes(1);
});

test('given: multiple games exist, when: getGamesRandom is called, then: all games are returned in random order', async () => {
  // Given
  const game2: Game = game;
  game2.setName('Game 2')
  const games: Game[] = [game, game2];
  jest.spyOn(gameDb, 'getAllGames').mockResolvedValue(games);

  // When
  const result = await gameService.getGamesRandom();

  // Then
  expect(result).toHaveLength(games.length);
  expect(gameDb.getAllGames).toHaveBeenCalledTimes(1);
});

test('given: filter parameters are provided, when: getFilteredGames is called, then: filtered games are returned', async () => {
  // Given
  jest.spyOn(gameDb, 'getFilteredGames').mockResolvedValue([game]);
  const filters = {
    tags: ['outdoor'],
    intensityId: 1,
    groups: true,
    duration: 30
  };

  // When
  const result = await gameService.getFilteredGames(filters);

  // Then
  expect(gameDb.getFilteredGames).toHaveBeenCalledWith({
    tags: filters.tags,
    intensityId: filters.intensityId,
    groups: filters.groups,
    durationRange: {
      gte: filters.duration * 0.8,
      lte: filters.duration * 1.2
    }
  });
  expect(result).toEqual([game]);
});

test('given: game exists in database, when: getGame is called with valid id, then: game is returned', async () => {
  // Given
  jest.spyOn(gameDb, 'getGameById').mockResolvedValue(game);

  // When
  const result = await gameService.getGame({ id: 1 });

  // Then
  expect(result).toEqual(game);
  expect(gameDb.getGameById).toHaveBeenCalledWith({ id: 1 });
});

test('given: game does not exist, when: getGame is called with invalid id, then: error is thrown', async () => {
  // Given
  jest.spyOn(gameDb, 'getGameById').mockResolvedValue(null);

  // When/Then
  await expect(gameService.getGame({ id: 999 }))
    .rejects.toThrow('Game with id: 999 does not exist.');
});

test('given: valid username with games, when: getUserGames is called, then: user games are returned', async () => {
  // Given
  jest.spyOn(userDb, 'getUserByUsername').mockResolvedValue(user);
  jest.spyOn(gameDb, 'getGamesByUser').mockResolvedValue([game]);

  // When
  const result = await gameService.getUserGames('John Doe');

  // Then
  expect(result).toEqual([game]);
  expect(userDb.getUserByUsername).toHaveBeenCalledWith({ username: 'John Doe' });
  expect(gameDb.getGamesByUser).toHaveBeenCalledWith({ username: 'John Doe' });
});

test('given: username does not exist, when: getUserGames is called, then: error is thrown', async () => {
  // Given
  jest.spyOn(userDb, 'getUserByUsername').mockResolvedValue(null);

  // When/Then
  await expect(gameService.getUserGames('NonexistentUser'))
    .rejects.toThrow('User with username: NonexistentUser does not exist.');
});