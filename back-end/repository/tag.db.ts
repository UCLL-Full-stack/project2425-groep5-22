import { Tag } from "../model/tag";

const tags: Tag[] = [
  new Tag({
    id: 1,
    tag: "Buiten"
  }),
  new Tag({
    id: 2,
    tag: "Binnen"
  }),
  new Tag({
    id: 3,
    tag: "Op een plein"
  }),
  new Tag({
    id: 4,
    tag: "9-10 jaar"
  }),
]

const getAllTags = (): Tag[] => {
  return tags;
};

const getTagById = ({ id }: { id: number }): Tag | null => {
  return tags.find(tag => tag.getId() === id) ?? null;
};

const getTagByTag = ({ tag }: { tag: string }): Tag | null => {
  return tags.find(currTag => currTag.getTag() === tag) ?? null;
};

const createTag = ({ tag }: { tag: Tag }): Tag => {
  tags.push(tag);
  return tag;
}

export default {
  getAllTags,
  getTagById,
  getTagByTag,
  createTag
};
