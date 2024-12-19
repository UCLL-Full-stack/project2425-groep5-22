import { User } from '../model/user';
import userDB from '../repository/user.db';
import { AuthenticationResponse, Role, UserInput, UserSimple } from '../types';
import bcrypt from 'bcrypt';
import jwt from '../util/jwt'

const getAllUsers = async (): Promise<User[]> => userDB.getAllUsers();

const getUserByEmail = async ({ email }: { email: string }): Promise<User> => {
  const user = await userDB.getUserByEmail({ email });
  if (!user) {
    throw new Error(`User with email: ${email} does not exist.`);
  }
  return user;
};

const getUserByUsername = async ({ username, role = "guest" }: { username: string, role?: Role }): Promise<User | UserSimple> => {
  const user = await userDB.getUserByUsername({ username });
  if (!user) {
    throw new Error(`User with id: ${username} does not exist.`);
  }

  if (role === "admin" || role === "superadmin") {
    return user;
  }

  return {
    id: user.getId(),
    email: user.getEmail(),
    username: user.getUsername()
  } as UserSimple;
};

const createUser = async ({
  username,
  email,
  password,
  role
}: UserInput): Promise<User> => {
  if (username.includes(" ") || /[^a-zA-Z0-9_-]/.test(username)) {
    throw new Error("Username can't include spaces and special characters.");
  }

  const existingUserByEmail: User | null = await userDB.getUserByEmail({ email });
  if (existingUserByEmail) {
    throw new Error('User with username ' + username + ' already exists.');
  }
  const existingUserByUsername: User | null = await userDB.getUserByUsername({ username });
  if (existingUserByUsername) {
    throw new Error('User with username ' + username + ' already exists.');
  }

  const hashedPassword: string = await bcrypt.hash(password, 12);
  const user: User = new User({
    username: username,
    email: email,
    password: hashedPassword,
    role: role
  })

  return await userDB.createUser(user);
}

const authenticate = async ({ email, password }: UserInput): Promise<AuthenticationResponse> => {
  const user: User | null = await userDB.getUserByEmail({ email });
  if (!user)
    throw new Error('Username or password is incorrect.');

  const validPassword = await bcrypt.compare(password, user.getPassword())
  if (!validPassword)
    throw new Error('Username or password is incorrect.');

  return {
    token: jwt.generateJWTtoken({
      email: email,
      role: user.getRole()
    }),
    email: email,
    role: user.getRole()
  }
}

export default { getUserByEmail, getUserByUsername, getAllUsers, createUser, authenticate };
