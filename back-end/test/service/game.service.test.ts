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
  username: 'John Doe',
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

// Mocks
let mockUserDbGetUserById: jest.Mock;
let mockIntensityDbGetIntensityById: jest.Mock;
let mockTagDbGetTagByTag: jest.Mock;
let mockTagDbCreateTag: jest.Mock;
let mockGameDbGetAllGames: jest.Mock;
let mockGameDbCreateGame: jest.Mock;

beforeEach(() => {
  mockUserDbGetUserById = jest.fn();
  mockIntensityDbGetIntensityById = jest.fn();
  mockTagDbGetTagByTag = jest.fn();
  mockTagDbCreateTag = jest.fn();
  mockGameDbGetAllGames = jest.fn();
  mockGameDbCreateGame = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

// Tests
test('given: games exist in database, when: getAllGames is called, then: all games are returned', async () => {
  // Given
  gameDb.getAllGames = mockGameDbGetAllGames.mockResolvedValue([game]);

  // When
  const result = await gameService.getAllGames();

  // Then
  expect(result).toEqual([game]);
  expect(mockGameDbGetAllGames).toHaveBeenCalledTimes(1);
});

test('given: user and intensity are valid, when: createGame is called, then: the game is created successfully', async () => {
  // Given
  userDb.getUserById = mockUserDbGetUserById.mockResolvedValue(user);
  intensityDb.getIntensityById = mockIntensityDbGetIntensityById.mockResolvedValue(intensity);
  tagDb.getTagByTag = mockTagDbGetTagByTag.mockResolvedValue(null); // simulate tag not found
  tagDb.createTag = mockTagDbCreateTag.mockResolvedValue(tags[0]);

  gameDb.createGame = mockGameDbCreateGame.mockResolvedValue(game);

  // When
  const result = await gameService.createGame(gameInput);

  // Then
  expect(result).toEqual(game);
  expect(mockUserDbGetUserById).toHaveBeenCalledTimes(1);
  expect(mockIntensityDbGetIntensityById).toHaveBeenCalledTimes(1);
  expect(mockTagDbGetTagByTag).toHaveBeenCalledTimes(2); // For both tags
  expect(mockTagDbCreateTag).toHaveBeenCalledTimes(2); // Tags are created if not found
  expect(mockGameDbCreateGame).toHaveBeenCalledTimes(1);
});

test('given: user id is missing, when: createGame is called, then: throw an error', async () => {
  // Given
  const invalidGameInput = { ...gameInput, user: { ...userInput, id: undefined } };

  // When / Then
  await expect(gameService.createGame(invalidGameInput)).rejects.toThrow('User id is required.');
});

test('given: intensity id is missing, when: createGame is called, then: throw an error', async () => {
  // Given
  const invalidGameInput = { ...gameInput, intensity: { ...intensityInput, id: undefined } };

  // When / Then
  await expect(gameService.createGame(invalidGameInput)).rejects.toThrow('Intensity id is required.');
});

test('given: user or intensity not found, when: createGame is called, then: throw an error', async () => {
  // Given
  userDb.getUserById = mockUserDbGetUserById.mockResolvedValue(null); // User not found
  intensityDb.getIntensityById = mockIntensityDbGetIntensityById.mockResolvedValue(intensity);

  // When / Then
  await expect(gameService.createGame(gameInput)).rejects.toThrow('User not found with the given ID');
});

test('given: tags not found, when: createGame is called, then: create and associate tags', async () => {
  // Given
  userDb.getUserById = mockUserDbGetUserById.mockResolvedValue(user);
  intensityDb.getIntensityById = mockIntensityDbGetIntensityById.mockResolvedValue(intensity);
  tagDb.getTagByTag = mockTagDbGetTagByTag.mockResolvedValue(null); // Tags not found
  tagDb.createTag = mockTagDbCreateTag.mockResolvedValue(tags[0]);

  gameDb.createGame = mockGameDbCreateGame.mockResolvedValue(game);

  // When
  const result = await gameService.createGame(gameInput);

  // Then
  expect(mockTagDbCreateTag).toHaveBeenCalledTimes(2); // Both tags should be created
  expect(result).toEqual(game);
});
