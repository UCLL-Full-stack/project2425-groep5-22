import { Tag } from "../model/tag";

const testTag = new Tag({ tag: "Everywhere" });

test("given: valid tag details, when: creating a tag, then: tag is created with correct values", () => {
  const tag = new Tag({ tag: "Outside" });
  expect(tag.getTag()).toBe("Outside");
});

test("given: incomplete tag details, when: creating a tag, then: error is thrown for missing fields", () => {
  expect(() => new Tag({ tag: "" })).toThrow("Tag is required.");
});

test("given: identical tags, when: comparing tags, then: tags are equal", () => {
  expect(testTag.equals(testTag)).toBe(true);
});

test("given: different tags, when: comparing tags, then: tags are not equal", () => {
  const differentTag = new Tag({ tag: "Inside" });
  expect(testTag.equals(differentTag)).toBe(false);
});
