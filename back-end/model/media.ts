import { Game } from "./game";

export class Media {
  private id?: number;
  private game: Game;
  private name: string;
  private file: string;
  private filetype: string;
  private createdAt: Date = new Date();
  private updatedAt: Date | null = null;

  constructor(media: {
    id?: number;
    game: Game;
    name: string;
    file: string;
    filetype: string;
  }) {
    this.validate(media);

    this.id = media.id;
    this.game = media.game;
    this.name = media.name;
    this.file = media.file;
    this.filetype = media.filetype;
  }

  validate(media: {
    id?: number;
    game: Game;
    name: string;
    file: string;
    filetype: string;
  }) {
    if (!media.game) throw new Error('Game is required.');
    if (!media.name || media.name == "") throw new Error('Name is required.');
    if (!media.file || media.file == "") throw new Error('File is required.');
    if (!media.filetype || media.filetype == "") throw new Error('Filetype is required.');
  }

  getId(): number | undefined {
    return this.id;
  }

  getGame(): Game {
    return this.game;
  }

  getName(): string {
    return this.name;
  }

  getFile(): string {
    return this.file;
  }

  getFiletype(): string {
    return this.filetype;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date | null {
    return this.updatedAt;
  }

  equals(media: Media): boolean {
    return (
      this.game.equals(media.getGame()) &&
      this.name === media.getName() &&
      this.file === media.getFile() &&
      this.filetype === media.getFiletype() &&
      this.createdAt === media.getCreatedAt() &&
      this.updatedAt === media.getUpdatedAt()
    );
  }
}
