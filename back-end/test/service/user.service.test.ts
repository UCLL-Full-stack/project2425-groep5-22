
// user.service.test.ts
import userService from '../../service/user.service';
import userDb from '../../repository/user.db';
import { User } from '../../model/user';
import bcrypt from 'bcrypt';
import { UserInput } from '../../types';

test('given: valid credentials, when: authenticate is called, then: authentication token is returned', async () => {
  // Given
  const hashedPassword = await bcrypt.hash('password123', 12);
  const user = new User({
    id: 1,
    username: 'John Doe',
    email: 'john@jeugdwerk.org',
    password: hashedPassword,
    role: 'guest'
  });
  jest.spyOn(userDb, 'getUserByEmail').mockResolvedValue(user);

  // When
  const result = await userService.authenticate({
    email: 'john@jeugdwerk.org',
    password: 'password123'
  } as UserInput);

  // Then
  expect(result).toHaveProperty('token');
  expect(result.email).toBe('john@jeugdwerk.org');
  expect(result.role).toBe('guest');
});

test('given: invalid credentials, when: authenticate is called, then: error is thrown', async () => {
  // Given
  jest.spyOn(userDb, 'getUserByEmail').mockResolvedValue(null);

  // When/Then
  await expect(userService.authenticate({
    email: 'wrong@email.com',
    password: 'wrongpass'
  } as UserInput)).rejects.toThrow('Username or password is incorrect.');
});

test('given: valid user data, when: createUser is called, then: user is created successfully', async () => {
  // Given
  const userInput = {
    username: 'johndoe',
    email: 'john@jeugdwerk.org',
    password: 'password123',
    role: 'guest' as const
  };

  jest.spyOn(userDb, 'getUserByEmail').mockResolvedValue(null);
  jest.spyOn(userDb, 'getUserByUsername').mockResolvedValue(null);
  jest.spyOn(userDb, 'createUser').mockImplementation(async (user) => {
    return new User({
      id: 1,
      ...userInput,
      password: user.getPassword() // This will be the hashed password
    });
  });

  // When
  const result = await userService.createUser(userInput);

  // Then
  expect(result.getUsername()).toBe(userInput.username);
  expect(result.getEmail()).toBe(userInput.email);
  expect(result.getRole()).toBe(userInput.role);
  expect(result.getPassword()).not.toBe(userInput.password); // Password should be hashed
  expect(userDb.createUser).toHaveBeenCalled();
});

test('given: username with space, when: createUser is called, then: error is thrown', async () => {
  // Given
  const userInput = {
    username: 'john doe',
    email: 'john@jeugdwerk.org',
    password: 'password123',
    role: 'guest' as const
  };

  // When/Then
  await expect(userService.createUser(userInput))
    .rejects.toThrow("Username can't include spaces and special characters.");
});

test('given: username with special characters, when: createUser is called, then: error is thrown', async () => {
  // Given
  const userInput = {
    username: 'john@doe',
    email: 'john@jeugdwerk.org',
    password: 'password123',
    role: 'guest' as const
  };

  // When/Then
  await expect(userService.createUser(userInput))
    .rejects.toThrow("Username can't include spaces and special characters.");
});

test('given: existing email, when: createUser is called, then: error is thrown', async () => {
  // Given
  const userInput = {
    username: 'johndoe',
    email: 'existing@jeugdwerk.org',
    password: 'password123',
    role: 'guest' as const
  };

  jest.spyOn(userDb, 'getUserByEmail').mockResolvedValue(new User({
    id: 1,
    username: 'existinguser',
    email: 'existing@jeugdwerk.org',
    password: 'hashedpassword',
    role: 'guest'
  }));

  // When/Then
  await expect(userService.createUser(userInput))
    .rejects.toThrow('User with username johndoe already exists.');
});

test('given: existing username, when: createUser is called, then: error is thrown', async () => {
  // Given
  const userInput = {
    username: 'existinguser',
    email: 'john@jeugdwerk.org',
    password: 'password123',
    role: 'guest' as const
  };

  jest.spyOn(userDb, 'getUserByEmail').mockResolvedValue(null);
  jest.spyOn(userDb, 'getUserByUsername').mockResolvedValue(new User({
    id: 1,
    username: 'existinguser',
    email: 'existing@jeugdwerk.org',
    password: 'hashedpassword',
    role: 'guest'
  }));

  // When/Then
  await expect(userService.createUser(userInput))
    .rejects.toThrow('User with username existinguser already exists.');
});