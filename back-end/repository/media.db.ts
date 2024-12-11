import { Game } from "../model/game";
import { Media } from "../model/media";
import database from "./database";

const getAllMedia = async (): Promise<Media[]> => {
  try {
    const result = await database.media.findMany();
    return result.map((media) => Media.from(media));
  } catch (e) {
    console.error('Database Error', e);
    throw new Error('Database Error, see server logs for more details.');
  }
};

const getMediaById = async ({ id }: { id: number }): Promise<Media | null> => {
  try {
    const result = await database.media.findUnique({
      where: { id: id },
    });
    return result ? Media.from(result) : null;
  } catch (e) {
    console.error('Database Error', e);
    throw new Error('Database Error, see server logs for more details.');
  }
};

const createMedia = async ({ media, gameId }: { media: Media, gameId: number }): Promise<Media> => {
  try {
    const result = await database.media.create({
      data: {
        name: media.getName(),
        file: media.getFile(),
        filetype: media.getFiletype(),
        gameId: gameId,
      }
    });
    return Media.from(result);
  } catch (e) {
    console.error('Database Error', e);
    throw new Error('Failed to create media, see server logs for more details.');
  }
};

export default {
  getAllMedia,
  getMediaById,
  createMedia,
};
