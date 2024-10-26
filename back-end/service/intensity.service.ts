import { Intensity } from '../model/intensity';
import intensityDb from '../repository/intensity.db';

const getAllIntensities = (): Intensity[] => {
  return intensityDb.getAllIntensities({ order: "asc" });
}

const getIntensityById = (id: number): Intensity => {
  const lecturer: Intensity | null = intensityDb.getIntensityById({ id: id });
  if (lecturer == null) throw new Error(`Intensity with id ${id} does not exist.`);
  return lecturer;
}

export default {
  getAllIntensities,
  getIntensityById
}