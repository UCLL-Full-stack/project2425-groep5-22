import { User } from '../model/user';
import userDb from '../repository/user.db';

const getAllUsers = (): User[] => {
  return userDb.getAllUsers();
}

const getUserById = (id: number): User => {
  const lecturer: User | null = userDb.getUserById({ id: id });
  if (lecturer == null) throw new Error(`User with id ${id} does not exist.`);
  return lecturer;
}

export default {
  getAllUsers,
  getUserById
}