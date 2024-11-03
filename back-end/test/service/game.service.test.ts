// game.service.test.ts
import gameService from '../../service/game.service';
import gameDb from '../../repository/game.db';
import userDb from '../../repository/user.db';
import intensityDb from '../../repository/intensity.db';
import tagDb from '../../repository/tag.db';
import { Game } from '../../model/game';
import { User } from '../../model/user';
import { Intensity } from '../../model/intensity';
import { Tag } from '../../model/tag';
import { GameInput, UserInput, IntensityInput } from '../../types';

// Test data setup
const userInput: UserInput = {
  id: 1,
  name: 'John Doe',
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
  user,
  intensity,
  name: 'Capture the Flag',
  groups: true,
  duration: 30,
  explanation: 'Team game where players...',
  tags
});

// Mock setup
let mockGameDbGetAllGames: jest.Mock;
let mockGameDbCreateGame: jest.Mock;
let mockUserDbGetUserById: jest.Mock;
let mockIntensityDbGetIntensityById: jest.Mock;
let mockTagDbGetTagByTag: jest.Mock;
let mockTagDbCreateTag: jest.Mock;

beforeEach(() => {
  mockGameDbGetAllGames = jest.fn();
  mockGameDbCreateGame = jest.fn();
  mockUserDbGetUserById = jest.fn();
  mockIntensityDbGetIntensityById = jest.fn();
  mockTagDbGetTagByTag = jest.fn();
  mockTagDbCreateTag = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

test('given: games exist in database, when: getAllGames is called, then: all games are returned', () => {
  // Given
  gameDb.getAllGames = mockGameDbGetAllGames.mockReturnValue([game]);
  // When
  const result = gameService.getAllGames();
  // Then
  expect(result).toEqual([game]);
  expect(mockGameDbGetAllGames).toHaveBeenCalledTimes(1);
});

test('given: valid game input with existing tags, when: createGame is called, then: game is created', () => {
  // Given
  userDb.getUserById = mockUserDbGetUserById.mockReturnValue(user);
  intensityDb.getIntensityById = mockIntensityDbGetIntensityById.mockReturnValue(intensity);
  tagDb.getTagByTag = mockTagDbGetTagByTag.mockReturnValue(tags[0]);
  gameDb.createGame = mockGameDbCreateGame.mockReturnValue(game);

  // When
  const result = gameService.createGame(gameInput);

  // Then
  expect(result).toEqual(game);
  expect(mockUserDbGetUserById).toHaveBeenCalledWith({ id: 1 });
  expect(mockIntensityDbGetIntensityById).toHaveBeenCalledWith({ id: 1 });
  expect(mockGameDbCreateGame).toHaveBeenCalledTimes(1);
});

test('given: valid game input with new tags, when: createGame is called, then: game is created with new tags', () => {
  // Given
  userDb.getUserById = mockUserDbGetUserById.mockReturnValue(user);
  intensityDb.getIntensityById = mockIntensityDbGetIntensityById.mockReturnValue(intensity);
  tagDb.getTagByTag = mockTagDbGetTagByTag.mockReturnValue(null);
  tagDb.createTag = mockTagDbCreateTag.mockReturnValue(tags[0]);
  gameDb.createGame = mockGameDbCreateGame.mockReturnValue(game);

  // When
  const result = gameService.createGame(gameInput);

  // Then
  expect(result).toEqual(game);
  expect(mockTagDbCreateTag).toHaveBeenCalled();
  expect(mockGameDbCreateGame).toHaveBeenCalledTimes(1);
});

test('given: missing user id, when: createGame is called, then: error is thrown', () => {
  // Given
  const invalidInput = { ...gameInput, user: { id: undefined, name: 'John Doe', email: 'john@jeugdwerk.org', password: 'password123' } };

  // When
  const createGame = () => gameService.createGame(invalidInput);

  // Then
  expect(createGame).toThrow('User id is required.');
});

test('given: non-existent user, when: createGame is called, then: error is thrown', () => {
  // Given
  userDb.getUserById = mockUserDbGetUserById.mockReturnValue(null);

  // When
  const createGame = () => gameService.createGame(gameInput);

  // Then
  expect(createGame).toThrow('User not found with the given ID');
  expect(mockUserDbGetUserById).toHaveBeenCalledTimes(1);
});