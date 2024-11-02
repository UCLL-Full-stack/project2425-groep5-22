import { User } from "../model/user";

const users: User[] = [
  new User({
    id: 1,
    name: "John Doe",
    email: "john@jeugdwerk.org",
    password: "password123"
  })
]

const getAllUsers = (): User[] => {
  return users;
};

const getUserById = ({ id }: { id: number }): User | null => {
  return users.find(user => user.getId() === id) ?? null;
};

const createUser = ({ user }: { user: User }): User => {
  users.push(user);
  return user;
}

export default {
  getAllUsers,
  getUserById,
  createUser
};
