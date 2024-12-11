import { Game } from "./game";
import {
  Game as GamePrisma,
  Media as MediaPrisma,
} from "@prisma/client"

export class Media {
  private id?: number;
  private name: string;
  private file: string;
  private filetype: string;
  private createdAt?: Date;
  private updatedAt?: Date | null;

  constructor(media: {
    id?: number;
    name: string;
    file: string;
    filetype: string;
    createdAt?: Date;
    updatedAt?: Date | null
  }) {
    this.validate(media);

    this.id = media.id;
    this.name = media.name;
    this.file = media.file;
    this.filetype = media.filetype;
    this.createdAt = media.createdAt;
    this.updatedAt = media.updatedAt;
  }

  validate(media: {
    id?: number;
    name: string;
    file: string;
    filetype: string;
  }) {
    if (!media.name || media.name == "") throw new Error('Name is required.');
    if (!media.file || media.file == "") throw new Error('File is required.');
    if (!media.filetype || media.filetype == "") throw new Error('Filetype is required.');
  }

  static from({
    id,
    name,
    file,
    filetype,
    createdAt,
    updatedAt
  }: MediaPrisma): Media {
    return new Media({
      id,
      name,
      file,
      filetype,
      createdAt,
      updatedAt
    });
  }

  getId(): number | undefined {
    return this.id;
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

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  getUpdatedAt(): Date | null | undefined {
    return this.updatedAt;
  }
  equals(media: Media): boolean {
    return (
      this.name === media.getName() &&
      this.file === media.getFile() &&
      this.filetype === media.getFiletype() &&
      this.createdAt === media.getCreatedAt() &&
      this.updatedAt === media.getUpdatedAt()
    );
  }
}
