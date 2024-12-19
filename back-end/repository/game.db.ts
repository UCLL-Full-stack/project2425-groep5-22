import { Game } from "../model/game";
import database from "../util/database"; // This should import your Prisma database client

const getAllGames = async (): Promise<Game[]> => {
  try {
    const result = await database.game.findMany({
      include: {
        user: true,
        intensity: true,
        tags: true,
      },
    });
    return result.map((game) =>
      Game.from({
        ...game,
        user: game.user,
        intensity: game.intensity,
        tags: game.tags,
      })
    );
  } catch (e) {
    console.error('Database Error', e);
    throw new Error('Database Error, see server logs for more details.');
  }
};

const getFilteredGames = async (filters: {
  tags?: string[];
  intensityId?: number;
  groups?: boolean;
  durationRange?: { gte: number; lte: number };
}): Promise<Game[]> => {
  try {
    // Build the `where` condition object dynamically
    const whereConditions: any = {};

    if (filters.tags && filters.tags.length > 0) {
      whereConditions.tags = { some: { tag: { in: filters.tags } } };
    }

    if (filters.intensityId && filters.intensityId !== null) {
      whereConditions.intensityId = filters.intensityId;
    }

    if (filters.groups !== undefined && filters.groups !== null) {
      whereConditions.groups = filters.groups;
    }

    if (filters.durationRange) {
      whereConditions.duration = {
        gte: filters.durationRange.gte,
        lte: filters.durationRange.lte,
      };
    }

    const result = await database.game.findMany({
      where: whereConditions,
      include: {
        user: true,
        intensity: true,
        tags: true,
      },
    });

    // Map result to Game model
    return result.map((game) =>
      Game.from({
        ...game,
        user: game.user,
        intensity: game.intensity,
        tags: game.tags,
      })
    );
  } catch (e) {
    console.error('Database Error', e);
    throw new Error('Database Error, see server logs for more details.');
  }
};

export const getGamesByUser = async ({ username }: { username: string }) => {
  try {
    const result = await database.game.findMany({
      where: {
        user: {
          username: username
        }
      },
      include: {
        user: true,
        intensity: true,
        tags: true,
      },
    });

    return result.map((game) =>
      Game.from({
        ...game,
        user: game.user,
        intensity: game.intensity,
        tags: game.tags,
      })
    );
  } catch (e) {
    console.error('Database Error', e);
    throw new Error('Database Error, see server logs for more details.');
  }
};

const getGameById = async ({ id }: { id: number }): Promise<Game | null> => {
  try {
    const result = await database.game.findUnique({
      where: { id: id },
      include: {
        user: true,
        intensity: true,
        tags: true,
      },
    });
    return result ? Game.from({
      ...result,
      user: result.user,
      intensity: result.intensity,
      tags: result.tags,
    }) : null;
  } catch (e) {
    console.error('Database Error', e);
    throw new Error('Database Error, see server logs for more details.');
  }
};

const createGame = async ({ game }: { game: Game }): Promise<Game> => {
  try {
    const result = await database.game.create({
      data: {
        user: {
          connect: {
            id: game.getUser().getId(),
          },
        },
        intensity: {
          connect: {
            id: game.getIntensity().getId(),
          },
        },
        name: game.getName(),
        groups: game.getGroups(),
        duration: game.getDuration(),
        explanation: game.getExplanation(),
        tags: {
          connect: game.getTags().map((tag) => ({ id: tag.getId() })),
        },
      },
      include: {
        user: true,
        intensity: true,
        tags: true,
      },
    });

    return Game.from({
      ...result,
      user: result.user,
      intensity: result.intensity,
      tags: result.tags,
    });
  } catch (e) {
    console.error('Database Error', e);
    throw new Error('Failed to create game, see server logs for more details.');
  }
};

const updateGame = async ({ game }: { game: Game }): Promise<Game> => {
  try {
    // Update the game data in the database
    const result = await database.game.update({
      where: {
        id: game.getId(),
      },
      data: {
        user: {
          connect: {
            id: game.getUser().getId(),
          },
        },
        intensity: {
          connect: {
            id: game.getIntensity().getId(),
          },
        },
        name: game.getName(),
        groups: game.getGroups(),
        duration: game.getDuration(),
        explanation: game.getExplanation(),
        tags: {
          set: [], // Clear existing tags
          connect: game.getTags().map((tag) => ({ id: tag.getId() })), // Add new tags
        }
      },
      include: {
        user: true,
        intensity: true,
        tags: true,
      },
    });

    return Game.from({
      ...result,
      user: result.user,
      intensity: result.intensity,
      tags: result.tags,
    });
  } catch (e) {
    console.error('Database Error', e);
    throw new Error('Failed to update game, see server logs for more details.');
  }
};

const deleteGame = async ({ id }: { id: number }): Promise<void> => {
  try {
    await database.game.delete({
      where: {
        id: id,
      },
    });
  } catch (e) {
    console.error('Database Error', e);
    throw new Error('Failed to delete game, see server logs for more details.');
  }
};


export default {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  getFilteredGames,
  getGamesByUser
};
