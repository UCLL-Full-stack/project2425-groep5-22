import { Role } from "../types";
import { Game } from "./game";
import {
  User as UserPrisma
} from "@prisma/client"

export class User {
  private id?: number;
  private username: string;
  private role: Role;
  private email: string;
  private password: string;
  private games: Game[];
  private createdAt?: Date;
  private updatedAt?: Date | null;

  constructor(user: {
    id?: number;
    username: string;
    role: Role;
    email: string;
    password: string;
    games?: Game[];
    createdAt?: Date;
    updatedAt?: Date | null
  }) {
    this.validate(user);

    this.id = user.id;
    this.username = user.username;
    this.role = user.role;
    this.email = user.email;
    this.password = user.password;
    this.games = user.games ?? [];
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt
  }

  validate(user: {
    id?: number;
    username: string;
    email: string;
    password: string;
  }) {
    if (!user.username || user.username == "") throw new Error('Username is required.');
    if (user.username.includes(" ") || /[^a-zA-Z0-9_-]/.test(user.username)) {
      throw new Error("Username can't include spaces and special characters.");
    }
    if (!user.email || user.email == "") throw new Error('Email is required.');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for validating email
    if (!emailRegex.test(user.email)) {
      throw new Error('Invalid email format.');
    }
    if (!user.password) throw new Error('Password is required.');
  }

  static from({
    id,
    username,
    role,
    email,
    password,
    createdAt,
    updatedAt
  }: UserPrisma
  ): User {
    return new User({
      id,
      username,
      role: role as Role,
      email,
      password,
      createdAt,
      updatedAt
    });
  }

  getId(): number | undefined {
    return this.id;
  }

  getUsername(): string {
    return this.username;
  }

  getRole(): Role {
    return this.role;
  }


  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  getGames(): Game[] {
    return this.games;
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  getUpdatedAt(): Date | null | undefined {
    return this.updatedAt;
  }

  equals(user: User): boolean {
    return (
      this.username === user.getUsername() &&
      this.role === user.getRole() &&
      this.email === user.getEmail() &&
      this.password === user.getPassword() &&
      this.games.every((game, index) => game.equals(user.getGames()[index])) &&
      this.createdAt === user.getCreatedAt() &&
      this.updatedAt === user.getUpdatedAt()
    );
  }
}
