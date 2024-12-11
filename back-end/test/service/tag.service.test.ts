import tagService from '../../service/tag.service';
import tagDb from '../../repository/tag.db';
import { Tag } from '../../model/tag';

const tag = new Tag({
  id: 1,
  tag: 'outdoor'
});

let mockTagDbGetAllTags: jest.Mock;

beforeEach(() => {
  mockTagDbGetAllTags = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

test('given: tags exist in database, when: getAllTags is called, then: all tags are returned', async () => {
  // Given
  tagDb.getAllTags = mockTagDbGetAllTags.mockResolvedValue([tag]);

  // When
  const result = await tagService.getAllTags();

  // Then
  expect(result).toEqual([tag]);
  expect(mockTagDbGetAllTags).toHaveBeenCalledTimes(1);
});
