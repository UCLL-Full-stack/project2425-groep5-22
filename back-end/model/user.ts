import { Game } from "./game";

export class User {
  private id?: number;
  private name: string;
  private email: string;
  private password: string;
  private games: Game[] = [];
  private createdAt: Date = new Date();
  private updatedAt: Date | null = null;

  constructor(user: {
    id?: number;
    name: string;
    email: string;
    password: string;
  }) {
    this.validate(user);


    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
  }

  validate(user: {
    id?: number;
    name: string;
    email: string;
    password: string;
  }) {
    if (!user.name || user.name == "") throw new Error('Name is required.');
    if (!user.email || user.name == "") throw new Error('Email is required.');
    if (!user.password) throw new Error('Password is required.');
  }

  getId(): number | undefined {
    return this.id;
  }

  getName(): string {
    return this.name;
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

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date | null {
    return this.updatedAt;
  }

  equals(user: User): boolean {
    return (
      this.name === user.getName() &&
      this.email === user.getEmail() &&
      this.password === user.getPassword() &&
      this.games.every((game, index) => game.equals(user.getGames()[index])) &&
      this.createdAt === user.getCreatedAt() &&
      this.updatedAt === user.getUpdatedAt()
    );
  }
}
