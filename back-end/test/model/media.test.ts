import { Media } from '../../model/media';
import { Game } from '../../model/game';
import { User } from '../../model/user';
import { Intensity } from '../../model/intensity';

let validGame: Game;

beforeEach(() => {
  const validUser = new User({
    id: 1,
    name: 'John Doe',
    email: 'john@jeugdwerk.org',
    password: 'password123'
  });

  validGame = new Game({
    user: validUser,
    intensity: new Intensity({ id: 1, intensity: 'Medium', order: 2 }),
    name: 'Capture the Flag',
    groups: true,
    duration: 30,
    explanation: 'Team game where players...',
    tags: []
  });
});

test('given: valid media parameters, when: media is created, then: media should be created successfully', () => {
  const media = new Media({
    id: 1,
    game: validGame,
    name: 'Game Photo',
    file: 'photo.jpg',
    filetype: 'image/jpeg'
  });

  expect(media).toBeDefined();
  expect(media.getId()).toBe(1);
  expect(media.getGame()).toBe(validGame);
  expect(media.getName()).toBe('Game Photo');
  expect(media.getFile()).toBe('photo.jpg');
  expect(media.getFiletype()).toBe('image/jpeg');
});

test('given: missing game, when: media is created, then: an error should be thrown', () => {
  expect(() => {
    new Media({
      id: 1,
      game: undefined as unknown as Game,
      name: 'Game Photo',
      file: 'photo.jpg',
      filetype: 'image/jpeg'
    });
  }).toThrow('Game is required.');
});

test('given: empty name, when: media is created, then: an error should be thrown', () => {
  expect(() => {
    new Media({
      id: 1,
      game: validGame,
      name: '',
      file: 'photo.jpg',
      filetype: 'image/jpeg'
    });
  }).toThrow('Name is required.');
});

test('given: empty file, when: media is created, then: an error should be thrown', () => {
  expect(() => {
    new Media({
      id: 1,
      game: validGame,
      name: 'Game Photo',
      file: '',
      filetype: 'image/jpeg'
    });
  }).toThrow('File is required.');
});

test('given: empty filetype, when: media is created, then: an error should be thrown', () => {
  expect(() => {
    new Media({
      id: 1,
      game: validGame,
      name: 'Game Photo',
      file: 'photo.jpg',
      filetype: ''
    });
  }).toThrow('Filetype is required.');
});

test('given: two identical media items, when: equals method is called, then: should return true', () => {
  const media1 = new Media({
    id: 1,
    game: validGame,
    name: 'Game Photo',
    file: 'photo.jpg',
    filetype: 'image/jpeg'
  });

  expect(media1.equals(media1)).toBe(true);
});