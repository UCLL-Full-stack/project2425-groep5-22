import { Tag } from '../model/tag';
import tagDb from '../repository/tag.db';

const getAllTags = async (): Promise<Tag[]> => {
  return tagDb.getAllTags();
}

export default {
  getAllTags
}