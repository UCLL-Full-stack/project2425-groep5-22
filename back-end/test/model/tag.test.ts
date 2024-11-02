import { Tag } from '../../model/tag';

test('given: valid tag parameters, when: tag is created, then: tag should be created successfully', () => {
  const tag = new Tag({
    id: 1,
    tag: 'outdoor'
  });

  expect(tag).toBeDefined();
  expect(tag.getTag()).toBe('outdoor');
});

test('given: empty tag string, when: tag is created, then: an error should be thrown', () => {
  expect(() => {
    new Tag({
      id: 1,
      tag: ''
    });
  }).toThrow('Tag is required.');
});

test('given: two identical tags, when: equals method is called, then: should return true', () => {
  const tag1 = new Tag({
    tag: 'outdoor'
  });

  expect(tag1.equals(tag1)).toBe(true);
});