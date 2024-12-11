import { Game } from "../model/game";
import database from "./database"; // This should import your Prisma database client

const getAllGames = async (): Promise<Game[]> => {
  try {
    const result = await database.game.findMany({
      include: {
        user: true,
        intensity: true,
        tags: true,
        medias: true,
      },
    });
    return result.map((game) =>
      Game.from({
        ...game,
        user: game.user,
        intensity: game.intensity,
        tags: game.tags,
        medias: game.medias,
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
      where: { id },
      include: {
        user: true,
        intensity: true,
        tags: true,
        medias: true,
      },
    });
    return result ? Game.from({
      ...result,
      user: result.user,
      intensity: result.intensity,
      tags: result.tags,
      medias: result.medias,
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
        medias: {
          create: game.getMedias().map((media) => ({
            name: media.getName(),
            file: media.getFile(),
            filetype: media.getFiletype(),
          })),
        },
      },
      include: {
        user: true,
        intensity: true,
        tags: true,
        medias: true,
      },
    });

    return Game.from({
      ...result,
      user: result.user,
      intensity: result.intensity,
      tags: result.tags,
      medias: result.medias,
    });
  } catch (e) {
    console.error('Database Error', e);
    throw new Error('Failed to create game, see server logs for more details.');
  }
};

export default {
  getAllGames,
  getGameById,
  createGame,
};
