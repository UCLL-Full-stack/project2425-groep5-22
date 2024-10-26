import { Game } from "../model/game";
import { Intensity } from "../model/intensity";
import { Tag } from "../model/tag";
import { User } from "../model/user";

const testUser = new User({ name: "John Doe", email: "john.doe@jeugdwerk.org", password: "john123" });
const testIntensity = new Intensity({ intensity: "High", order: 1 });
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

test("given: valid game details, when: creating a game, then: game is created with correct values", () => {
  expect(testGame.getUser()).toEqual(testUser);
  expect(testGame.getIntensity()).toEqual(testIntensity);
  expect(testGame.getName()).toBe("Hide and Seek");
  expect(testGame.getGroups()).toBe(true);
  expect(testGame.getDuration()).toBe(30);
  expect(testGame.getExplanation()).toBe("The will be one seeker, all the rest has to hide and the seeker has to find the others.");
  expect(testGame.getTags()).toContain(testTag);
});

test("given: identical game instances, when: comparing games, then: games are equal", () => {
  expect(testGame.equals(testGame)).toBe(true);
});

test("given: different game instances, when: comparing games, then: games are not equal", () => {
  const differentGame = new Game({
    ...testGame,
    name: "Different Game",
    user: testUser,
    intensity: testIntensity,
    groups: true,
    duration: 30,
    explanation: "Another fun game",
    tags: [testTag]
  });
  expect(testGame.equals(differentGame)).toBe(false);
});