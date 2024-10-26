import { Media } from "../model/media";
import { Game } from "../model/game";
import { Intensity } from "../model/intensity";
import { Tag } from "../model/tag";
import { User } from "../model/user";

const testUser = new User({ name: "John Doe", email: "john.doe@jeugdwerk.org", password: "john123" });
const testIntensity = new Intensity({ intensity: "Moderate", order: 1 });
const testTag = new Tag({ tag: "Everywhere" });
const testGame = new Game({
  user: testUser,
  intensity: testIntensity,
  name: "Hide and Seek",
  groups: true,
  duration: 30,
  explanation: "The will be one seeker, all the rest has to hide and the seeker has to find the others.",
  tags: [testTag]
});

test("given: valid media details, when: creating media, then: media is created with correct values", () => {
  const media = new Media({ game: testGame, name: "Game Image", file: "image.png", filetype: "png" });
  expect(media.getGame()).toEqual(testGame);
  expect(media.getName()).toBe("Game Image");
  expect(media.getFile()).toBe("image.png");
  expect(media.getFiletype()).toBe("png");
});

test("given: incomplete media details, when: creating media, then: error is thrown for missing fields", () => {
  expect(() => new Media({ game: testGame, name: "", file: "file", filetype: "png" })).toThrow("Name is required.");
  expect(() => new Media({ game: testGame, name: "Media", file: "", filetype: "png" })).toThrow("File is required.");
  expect(() => new Media({ game: testGame, name: "Media", file: "file", filetype: "" })).toThrow("Filetype is required.");
});
