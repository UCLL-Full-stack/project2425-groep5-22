import { Intensity } from "./intensity";
import { Tag } from "./tag";
import { User } from "./user";

export class Game {
  private id?: number;
  private user: User;
  private intensity: Intensity;
  private name: string;
  private groups: boolean;
  private duration: number;
  private explanation: string;
  private tags: Tag[];
  private createdAt: Date = new Date();
  private updatedAt: Date | null = null;

  constructor(game: {
    id?: number;
    user: User;
    intensity: Intensity;
    name: string;
    groups: boolean;
    duration: number;
    explanation: string;
    tags: Tag[];
  }) {
    this.validate(game);

    this.id = game.id;
    this.user = game.user;
    this.intensity = game.intensity
    this.name = game.name
    this.groups = game.groups
    this.duration = game.duration
    this.explanation = game.explanation;
    this.tags = game.tags;
  }

  validate(game: {
    id?: number;
    user: User;
    intensity: Intensity;
    name: string;
    groups: boolean;
    duration: number;
    explanation: string;
    tags: Tag[];
  }) {
    if (!game.user)
      throw new Error('User is required.');
    if (!game.intensity)
      throw new Error('Intensity is required.');
    if (!game.name || game.name == "")
      throw new Error('Name is required.');
    if (!game.groups)
      throw new Error('Groups is required.');
    if (!game.duration)
      throw new Error('Duration is required.');
    if (!game.explanation && game.name !== "")
      throw new Error('Explanation is required.');
    if (!game.tags)
      throw new Error('Tags is required.');
  }

  getId(): number | undefined {
    return this.id;
  }

  getUser(): User {
    return this.user;
  }

  getIntensity(): Intensity {
    return this.intensity;
  }

  getName(): string {
    return this.name;
  }

  getGroups(): boolean {
    return this.groups;
  }

  getDuration(): number {
    return this.duration;
  }

  getExplanation(): string {
    return this.explanation;
  }

  getTags(): Tag[] {
    return this.tags;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date | null {
    return this.updatedAt;
  }

  equals(game: Game): boolean {
    return (
      this.user.equals(game.getUser()) &&
      this.intensity.equals(game.getIntensity()) &&
      this.name === game.getName() &&
      this.groups === game.getGroups() &&
      this.duration === game.getDuration() &&
      this.explanation === game.getExplanation() &&
      this.tags.every((tag, index) => tag.equals(game.getTags()[index])) &&
      this.createdAt === game.getCreatedAt() &&
      this.updatedAt === game.getUpdatedAt()
    );
  }
}
