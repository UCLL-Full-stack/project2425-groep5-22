import { Tag } from "../model/tag";
import database from "./database";

const getAllTags = async (): Promise<Tag[]> => {
  try {
    const result = await database.tag.findMany();
    return result.map((tag) => Tag.from(tag));
  } catch (e) {
    console.error('Database Error', e);
    throw new Error('Database Error, see server logs for more details.');
  }
};

const getTagById = async ({ id }: { id: number }): Promise<Tag | null> => {
  try {
    const result = await database.tag.findUnique({
      where: { id: id },
    });
    return result ? Tag.from(result) : null;
  } catch (e) {
    console.error('Database Error', e);
    throw new Error('Database Error, see server logs for more details.');
  }
};

const getTagByTag = async ({ tag }: { tag: string }): Promise<Tag | null> => {
  try {
    const result = await database.tag.findUnique({
      where: { tag: tag },
    });
    return result ? Tag.from(result) : null;
  } catch (e) {
    console.error('Database Error', e);
    throw new Error('Database Error, see server logs for more details.');
  }
};

const createTag = async ({ tag }: { tag: Tag }): Promise<Tag> => {
  try {
    const result = await database.tag.create({
      data: {
        tag: tag.getTag(),
      },
    });
    return Tag.from(result);
  } catch (e) {
    console.error('Database Error', e);
    throw new Error('Failed to create tag, see server logs for more details.');
  }
};

export default {
  getAllTags,
  getTagById,
  getTagByTag,
  createTag,
};
