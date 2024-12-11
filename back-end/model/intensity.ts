import { Game } from "./game";
import {
  Intensity as IntensityPrisma,
  Game as GamePrisma
} from "@prisma/client"

export class Intensity {
  private id?: number;
  private intensity: string;
  private order: number;
  private createdAt?: Date;
  private updatedAt?: Date | null;

  constructor(intensity: {
    id?: number;
    intensity: string;
    order: number;
    createdAt?: Date;
    updatedAt?: Date | null
  }) {
    this.validate(intensity);


    this.id = intensity.id;
    this.intensity = intensity.intensity;
    this.order = intensity.order;
    this.createdAt = intensity.createdAt;
    this.updatedAt = intensity.updatedAt;
  }

  validate(intensity: {
    id?: number;
    intensity: string;
    order: number;
  }) {
    if (!intensity.intensity || intensity.intensity == "") throw new Error('Intensity is required.');
    if (!intensity.order) throw new Error('Order is required.');
  }

  static from({
    id,
    intensity,
    order,
    // games,
    createdAt,
    updatedAt
  }: IntensityPrisma
    // & { games: GamePrisma[] }
  ): Intensity {
    return new Intensity({
      id,
      intensity,
      order,
      // games: games.map((game) => Game.from(game)),
      createdAt,
      updatedAt
    });
  }

  getId(): number | undefined {
    return this.id;
  }

  getIntensity(): string {
    return this.intensity;
  }

  getOrder(): number {
    return this.order;
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  getUpdatedAt(): Date | null | undefined {
    return this.updatedAt;
  }

  equals(intensity: Intensity): boolean {
    return (
      this.intensity === intensity.getIntensity() &&
      this.order === intensity.getOrder() &&
      this.createdAt === intensity.getCreatedAt() &&
      this.updatedAt === intensity.getUpdatedAt()
    );
  }
}
