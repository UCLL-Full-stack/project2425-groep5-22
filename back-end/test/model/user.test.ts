import { User } from '../../model/user';

test('given: valid user parameters, when: user is created, then: user should be created successfully', () => {
  const user = new User({
    id: 1,
    name: 'John Doe',
    email: 'john@jeugdwerk.org',
    password: 'password123'
  });

  expect(user).toBeDefined();
  expect(user.getId()).toBe(1);
  expect(user.getName()).toBe('John Doe');
  expect(user.getEmail()).toBe('john@jeugdwerk.org');
  expect(user.getPassword()).toBe('password123');
  expect(user.getGames()).toEqual([]);
});

test('given: empty name, when: user is created, then: an error should be thrown', () => {
  expect(() => {
    new User({
      id: 1,
      name: '',
      email: 'john@jeugdwerk.org',
      password: 'password123'
    });
  }).toThrow('Name is required.');
});

test('given: empty email, when: user is created, then: an error should be thrown', () => {
  expect(() => {
    new User({
      id: 1,
      name: 'John Doe',
      email: '',
      password: 'password123'
    });
  }).toThrow('Email is required.');
});

test('given: missing password, when: user is created, then: an error should be thrown', () => {
  expect(() => {
    new User({
      id: 1,
      name: 'John Doe',
      email: 'john@jeugdwerk.org',
      password: ''
    });
  }).toThrow('Password is required.');
});

test('given: two identical users, when: equals method is called, then: should return true', () => {
  const user1 = new User({
    id: 1,
    name: 'John Doe',
    email: 'john@jeugdwerk.org',
    password: 'password123'
  });

  expect(user1.equals(user1)).toBe(true);
});