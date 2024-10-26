import { Game } from "./game";

export class Intensity {
  private id?: number;
  private intensity: string;
  private order: number;
  private games: Game[] = [];
  private createdAt: Date = new Date();
  private updatedAt: Date | null = null;

  constructor(intensity: {
    id?: number;
    intensity: string;
    order: number;
  }) {
    this.validate(intensity);


    this.id = intensity.id;
    this.intensity = intensity.intensity;
    this.order = intensity.order;
  }

  validate(intensity: {
    id?: number;
    intensity: string;
    order: number;
  }) {
    if (!intensity.intensity || intensity.intensity == "") throw new Error('Intensity is required.');
    if (!intensity.order) throw new Error('Order is required.');
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

  getGames(): Game[] {
    return this.games;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date | null {
    return this.updatedAt;
  }

  updateUpdateAt(): void {
    this.updatedAt = new Date()
  }

  equals(intensity: Intensity): boolean {
    return (
      this.intensity === intensity.getIntensity() &&
      this.order === intensity.getOrder() &&
      this.games.every((game, index) => game.equals(intensity.getGames()[index])) &&
      this.createdAt === intensity.getCreatedAt() &&
      this.updatedAt === intensity.getUpdatedAt()
    );
  }
}
