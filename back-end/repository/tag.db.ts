import { Tag } from "../model/tag";

let currentId: number = 5;
const tags: Tag[] = [
  new Tag({
    id: 1,
    tag: "Rustig"
  }),
  new Tag({
    id: 2,
    tag: "Matig"
  }),
  new Tag({
    id: 3,
    tag: "Zwaar"
  }),
  new Tag({
    id: 4,
    tag: "Hevig"
  }),
  new Tag({
    id: 5,
    tag: "Extreem"
  })
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
