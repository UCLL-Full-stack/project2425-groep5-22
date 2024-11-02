import { Intensity } from '../../model/intensity';

test('given: valid intensity parameters, when: intensity is created, then: intensity should be created successfully', () => {
  const intensity = new Intensity({
    id: 1,
    intensity: 'High',
    order: 3
  });

  expect(intensity).toBeDefined();
  expect(intensity.getIntensity()).toBe('High');
  expect(intensity.getOrder()).toBe(3);
});

test('given: empty intensity string, when: intensity is created, then: an error should be thrown', () => {
  expect(() => {
    new Intensity({
      id: 1,
      intensity: '',
      order: 3
    });
  }).toThrow('Intensity is required.');
});

test('given: missing order, when: intensity is created, then: an error should be thrown', () => {
  expect(() => {
    new Intensity({
      id: 1,
      intensity: 'High',
      order: undefined as unknown as number
    });
  }).toThrow('Order is required.');
});

test('given: two identical intensities, when: equals method is called, then: should return true', () => {
  const intensity1 = new Intensity({
    intensity: 'High',
    order: 3
  });

  expect(intensity1.equals(intensity1)).toBe(true);
});