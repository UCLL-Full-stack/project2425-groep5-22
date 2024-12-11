import { Game } from "./game";
import {
  Tag as TagPrisma,
  Game as GamePrisma
} from "@prisma/client"

export class Tag {
  private id?: number;
  private tag: string;
  private createdAt?: Date;
  private updatedAt?: Date | null;

  constructor(tag: {
    id?: number;
    tag: string;
    createdAt?: Date;
    updatedAt?: Date | null
  }) {
    this.validate(tag);

    this.id = tag.id;
    this.tag = tag.tag;
    this.createdAt = tag.createdAt;
    this.updatedAt = tag.updatedAt;
  }

  validate(tag: {
    id?: number;
    tag: string;
  }) {
    if (!tag.tag || tag.tag == "") throw new Error('Tag is required.');
  }

  static from({
    id,
    tag,
    // games,
    createdAt,
    updatedAt
  }: TagPrisma
    //  & { games: GamePrisma[] }
  ): Tag {
    return new Tag({
      id,
      tag,
      // games: games.map((game) => Game.from(game)),
      createdAt,
      updatedAt
    });
  }

  getId(): number | undefined {
    return this.id;
  }

  getTag(): string {
    return this.tag;
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  getUpdatedAt(): Date | null | undefined {
    return this.updatedAt;
  }

  equals(tag: Tag): boolean {
    return (
      this.tag === tag.getTag() &&
      this.createdAt === tag.getCreatedAt() &&
      this.updatedAt === tag.getUpdatedAt()
    );
  }
}
