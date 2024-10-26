import { Game } from "./game";

export class Tag {
  private id?: number;
  private tag: string;
  private games: Game[] = [];
  private createdAt: Date = new Date();
  private updatedAt: Date | null = null;

  constructor(tag: {
    id?: number;
    tag: string;
  }) {
    this.validate(tag);


    this.id = tag.id;
    this.tag = tag.tag;
  }

  validate(tag: {
    id?: number;
    tag: string;
  }) {
    if (!tag.tag || tag.tag == "") throw new Error('Tag is required.');
  }

  getId(): number | undefined {
    return this.id;
  }

  getTag(): string {
    return this.tag;
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

  equals(tag: Tag): boolean {
    return (
      this.tag === tag.getTag() &&
      this.games.every((game, index) => game.equals(tag.getGames()[index])) &&
      this.createdAt === tag.getCreatedAt() &&
      this.updatedAt === tag.getUpdatedAt()
    );
  }
}
