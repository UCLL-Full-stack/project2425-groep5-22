
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