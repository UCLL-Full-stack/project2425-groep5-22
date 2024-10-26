import { Media } from '../model/media';
import mediaDb from '../repository/media.db';

const getAllMedia = (): Media[] => {
  return mediaDb.getAllMedia();
}

const getMediaById = (id: number): Media => {
  const lecturer: Media | null = mediaDb.getMediaById({ id: id });
  if (lecturer == null) throw new Error(`Media with id ${id} does not exist.`);
  return lecturer;
}

export default {
  getAllMedia,
  getMediaById
}