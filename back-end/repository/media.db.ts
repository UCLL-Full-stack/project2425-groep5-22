import { Media } from "../model/media";

const media: Media[] = []

const getAllMedia = (): Media[] => {
  return media;
};

const getMediaById = ({ id }: { id: number }): Media | null => {
  return media.find(media => media.getId() === id) ?? null;
};

export default {
  getAllMedia,
  getMediaById
};
