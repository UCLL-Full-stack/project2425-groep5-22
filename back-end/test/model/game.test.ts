import { Game } from '../../model/game';
import { User } from '../../model/user';
import { Intensity } from '../../model/intensity';
import { Tag } from '../../model/tag';
import { Role } from '../../types';

let validUser: User;
let validIntensity: Intensity;
let validTags: Tag[];

beforeEach(() => {
  validUser = new User({
    id: 1,
    username: 'JohnD',
    role: "guest",
    email: 'john@jeugdwerk.org',
    password: 'password123'
  });

  validIntensity = new Intensity({
    id: 1,
    intensity: 'Medium',
    order: 2
  });

  validTags = [
    new Tag({ id: 1, tag: 'outdoor' }),
    new Tag({ id: 2, tag: 'team' })
  ];
});

test('given: valid game parameters, when: game is created, then: game should be created successfully', () => {
  const game = new Game({
    user: validUser,
    intensity: validIntensity,
    name: 'Capture the Flag',
    groups: true,
    duration: 30,
    explanation: 'Team game where players...',
    tags: validTags
  });

  expect(game).toBeDefined();
  expect(game.getName()).toBe('Capture the Flag');
  expect(game.getUser()).toBe(validUser);
  expect(game.getIntensity()).toBe(validIntensity);
  expect(game.getGroups()).toBe(true);
  expect(game.getDuration()).toBe(30);
  expect(game.getTags()).toEqual(validTags);
});

test('given: missing user, when: game is created, then: an error should be thrown', () => {
  expect(() => {
    new Game({
      user: undefined as unknown as User,
      intensity: validIntensity,
      name: 'Capture the Flag',
      groups: true,
      duration: 30,
      explanation: 'Team game where players...',
      tags: validTags
    });
  }).toThrow('User is required.');
});

test('given: missing intensity, when: game is created, then: an error should be thrown', () => {
  expect(() => {
    new Game({
      user: validUser,
      intensity: undefined as unknown as Intensity,
      name: 'Capture the Flag',
      groups: true,
      duration: 30,
      explanation: 'Team game where players...',
      tags: validTags
    });
  }).toThrow('Intensity is required.');
});

test('given: empty name, when: game is created, then: an error should be thrown', () => {
  expect(() => {
    new Game({
      user: validUser,
      intensity: validIntensity,
      name: '',
      groups: true,
      duration: 30,
      explanation: 'Team game where players...',
      tags: validTags
    });
  }).toThrow('Name is required.');
});

test('given: empty explanation, when: game is created, then: an error should be thrown', () => {
  expect(() => {
    new Game({
      user: validUser,
      intensity: validIntensity,
      name: 'Capture the Flag',
      groups: true,
      duration: 30,
      explanation: '',
      tags: validTags
    });
  }).toThrow('Explanation is required.');
});

test('given: two identical games, when: equals method is called, then: should return true', () => {
  const game1 = new Game({
    user: validUser,
    intensity: validIntensity,
    name: 'Capture the Flag',
    groups: true,
    duration: 30,
    explanation: 'Team game where players...',
    tags: validTags
  });

  expect(game1.equals(game1)).toBe(true);
});