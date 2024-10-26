import { Intensity } from "../model/intensity";

test("given: valid intensity details, when: creating an intensity, then: intensity is created with correct values", () => {
  const intensity = new Intensity({ intensity: "High", order: 2 });
  expect(intensity.getIntensity()).toBe("High");
  expect(intensity.getOrder()).toBe(2);
});

test("given: incomplete intensity details, when: creating an intensity, then: error is thrown for missing fields", () => {
  expect(() => new Intensity({ intensity: "", order: 1 })).toThrow("Intensity is required.");
});