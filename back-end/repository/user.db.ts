import { User } from "../model/user";
import database from "./database";

const getAllUsers = async (): Promise<User[]> => {
  try {
    const result = await database.user.findMany({
      include: { games: true },
    });
    return result.map((user) => User.from(user));
  } catch (e) {
    console.error('Database Error', e)
    throw new Error('Database Error, see server logs for more details.')
  }
};

const getUserById = async ({ id }: { id: number }): Promise<User | null> => {
  // return users.find(user => user.getId() === id) ?? null;
  try {
    const result = await database.user.findUnique({
      where: { id: id },
      include: { games: true },
    });
    return result ? User.from(result) : null;
  } catch (e) {
    console.error('Database Error', e)
    throw new Error('Database Error, see server logs for more details.')
  }
};

const createUser = async ({ user }: { user: User }): Promise<User> => {
  try {
    const result = await database.user.create({
      data: {
        username: user.getUsername(),
        email: user.getEmail(),
        password: user.getPassword()
      }
    });
    return User.from(result);
  } catch (e) {
    console.error('Database Error', e)
    throw new Error('Failed to create user, see server logs for more details.')
  }
}

export default {
  getAllUsers,
  getUserById,
  createUser
};
