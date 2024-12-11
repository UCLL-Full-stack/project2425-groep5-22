import { Intensity } from "../model/intensity";
import database from "./database";

const getAllIntensities = async ({ order }: { order: "asc" | "desc" }): Promise<Intensity[]> => {
  try {
    const result = await database.intensity.findMany({
      orderBy: {
        order: order, // Ordering by the "order" field
      },
    });
    return result.map((intensity) => Intensity.from(intensity));
  } catch (e) {
    console.error('Database Error', e);
    throw new Error('Database Error, see server logs for more details.');
  }
};

const getIntensityById = async ({ id }: { id: number }): Promise<Intensity | null> => {
  try {
    const result = await database.intensity.findUnique({
      where: { id: id },
    });
    return result ? Intensity.from(result) : null;
  } catch (e) {
    console.error('Database Error', e);
    throw new Error('Database Error, see server logs for more details.');
  }
};

const createIntensity = async ({ intensity }: { intensity: Intensity }): Promise<Intensity> => {
  try {
    const result = await database.intensity.create({
      data: {
        intensity: intensity.getIntensity(),
        order: intensity.getOrder(),
      },
    });
    return Intensity.from(result);
  } catch (e) {
    console.error('Database Error', e);
    throw new Error('Failed to create intensity, see server logs for more details.');
  }
};

export default {
  getAllIntensities,
  getIntensityById,
  createIntensity,
};
