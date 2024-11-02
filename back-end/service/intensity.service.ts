import { Intensity } from '../model/intensity';
import intensityDb from '../repository/intensity.db';

const getAllIntensities = (): Intensity[] => {
  return intensityDb.getAllIntensities({ order: "asc" });
}

export default {
  getAllIntensities
}