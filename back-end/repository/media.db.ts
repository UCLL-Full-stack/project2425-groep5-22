import { Media } from "../model/media";

const medias: Media[] = []

const getAllMedia = (): Media[] => {
  return medias;
};

const getMediaById = ({ id }: { id: number }): Media | null => {
  return medias.find(media => media.getId() === id) ?? null;
};

const createMedia = ({ media }: { media: Media }): Media => {
  medias.push(media);
  return media;
}

export default {
  getAllMedia,
  getMediaById,
  createMedia
};
