import { User } from "../model/user";

const users: User[] = []

const getAllUsers = (): User[] => {
  return users;
};

const getUserById = ({ id }: { id: number }): User | null => {
  return users.find(user => user.getId() === id) ?? null;
};

export default {
  getAllUsers,
  getUserById
};
