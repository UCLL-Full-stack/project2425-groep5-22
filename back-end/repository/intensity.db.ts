import { Intensity } from "../model/intensity";

const intensities: Intensity[] = [
  new Intensity({
    id: 1,
    intensity: "Rustig",
    order: 1
  }),
  new Intensity({
    id: 2,
    intensity: "Matig",
    order: 2
  }),
  new Intensity({
    id: 3,
    intensity: "Zwaar",
    order: 3
  }),
  new Intensity({
    id: 4,
    intensity: "Hevig",
    order: 4
  }),
  new Intensity({
    id: 5,
    intensity: "Extreem",
    order: 5
  })
]

const getAllIntensities = ({ order = "asc" }: { order: "asc" | "desc" }): Intensity[] => {
  return intensities.sort((a, b) => {
    if (order === "desc") return a.getOrder() - b.getOrder();
    return b.getOrder() - a.getOrder();
  });
};

const getIntensityById = ({ id }: { id: number }): Intensity | null => {
  return intensities.find(intensity => intensity.getId() === id) ?? null;
};

const createIntensity = ({ intensity }: { intensity: Intensity }): Intensity => {
  intensities.push(intensity);
  return intensity;
}

export default {
  getAllIntensities,
  getIntensityById,
  createIntensity
};
