import { Tag } from "../model/tag";

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

const getTagByName = ({ name }: { name: string }): Tag | null => {
  return tags.find(tag => tag.getTag() === name) ?? null;
};

export default {
  getAllTags,
  getTagById,
  getTagByName
};
