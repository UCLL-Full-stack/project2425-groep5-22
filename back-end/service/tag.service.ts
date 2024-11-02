import { Tag } from '../model/tag';
import tagDb from '../repository/tag.db';

const getAllTags = (): Tag[] => {
  return tagDb.getAllTags();
}

export default {
  getAllTags
}