import intensityService from '../../service/intensity.service';
import intensityDb from '../../repository/intensity.db';
import { Intensity } from '../../model/intensity';

const intensity = new Intensity({
  id: 1,
  intensity: 'High',
  order: 3
});

let mockIntensityDbGetAllIntensities: jest.Mock;

beforeEach(() => {
  mockIntensityDbGetAllIntensities = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

test('given: intensities exist in database, when: getAllIntensities is called, then: all intensities are returned', async () => {
  // Given
  intensityDb.getAllIntensities = mockIntensityDbGetAllIntensities.mockResolvedValue([intensity]);

  // When
  const result = await intensityService.getAllIntensities();

  // Then
  expect(result).toEqual([intensity]);
  expect(mockIntensityDbGetAllIntensities).toHaveBeenCalledTimes(1);
});
