import { Intensity } from "./intensity";
import {
  Game as GamePrisma,
  User as UserPrisma,
  Intensity as IntensityPrisma,
  Tag as TagPrisma,
  Media as MediaPrisma,
} from "@prisma/client"
import { User } from "./user";
import { Tag } from "./tag";
import { Media } from "./media";

export class Game {
  private id?: number;
  private user: User;
  private intensity: Intensity;
  private name: string;
  private groups: boolean;
  private duration: number;
  private explanation: string;
  private tags: Tag[];
  private medias: Media[];
  private createdAt?: Date;
  private updatedAt?: Date | null;

  constructor(game: {
    id?: number;
    user: User;
    intensity: Intensity;
    name: string;
    groups: boolean;
    duration: number;
    explanation: string;
    tags: Tag[];
    medias?: Media[]
    createdAt?: Date;
    updatedAt?: Date | null
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
    this.medias = game.medias ?? [];
    this.createdAt = game.createdAt;
    this.updatedAt = game.updatedAt;
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
    if (game.groups == null)
      throw new Error('Groups is required.');
    if (!game.duration)
      throw new Error('Duration is required.');
    if (!game.explanation && game.name !== "")
      throw new Error('Explanation is required.');
    if (!game.tags)
      throw new Error('Tags is required.');
  }

  static from({
    id,
    name,
    groups,
    duration,
    explanation,
    user,
    tags,
    medias,
    intensity,
    createdAt,
    updatedAt
  }: GamePrisma & {
    user: UserPrisma,
    tags: TagPrisma[],
    intensity: IntensityPrisma,
    medias: MediaPrisma[]
  }): Game {
    return new Game({
      id,
      user: User.from(user),
      name,
      groups,
      duration,
      explanation,
      tags: tags.map((tag) => Tag.from(tag)),
      medias: medias.map((media) => Media.from(media)),
      intensity: Intensity.from(intensity),
      createdAt,
      updatedAt
    });
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

  getMedias(): Media[] {
    return this.medias;
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  getUpdatedAt(): Date | null | undefined {
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
      this.medias.every((media, index) => media.equals(game.getMedias()[index])) &&
      this.createdAt === game.getCreatedAt() &&
      this.updatedAt === game.getUpdatedAt()
    );
  }
}
