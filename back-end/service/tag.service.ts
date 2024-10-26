import { Tag } from '../model/tag';
import tagDb from '../repository/tag.db';

const getAllTags = (): Tag[] => {
  return tagDb.getAllTags();
}

const getTagById = (id: number): Tag => {
  const lecturer: Tag | null = tagDb.getTagById({ id: id });
  if (lecturer == null) throw new Error(`Tag with id ${id} does not exist.`);
  return lecturer;
}

export default {
  getAllTags,
  getTagById
}