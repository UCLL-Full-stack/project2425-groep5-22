import { User } from "../model/user";

const testUser = new User({ name: "John Doe", email: "john.doe@jeugdwerk.org", password: "john123" });

test("given: valid user details, when: creating a user, then: user is created with correct values", () => {
  const user = new User({ name: "John Doe", email: "john.doe@example.com", password: "pass123" });
  expect(user.getName()).toBe("John Doe");
  expect(user.getEmail()).toBe("john.doe@example.com");
  expect(user.getPassword()).toBe("pass123");
});

test("given: incomplete user details, when: creating a user, then: error is thrown for missing fields", () => {
  expect(() => new User({ name: "", email: "john.doe@example.com", password: "john123" })).toThrow("Name is required.");
  expect(() => new User({ name: "John Doe", email: "", password: "pass" })).toThrow("Email is required.");
  expect(() => new User({ name: "John Doe", email: "john.doe@example.com", password: "" })).toThrow("Password is required.");
});

test("given: identical users, when: comparing users, then: users are equal", () => {
  expect(testUser.equals(testUser)).toBe(true);
});

test("given: different users, when: comparing users, then: users are not equal", () => {
  const differentUser = new User({ name: "Jane Doe", email: "jane.doe@jeugdwerk.org", password: "jane123" });
  expect(testUser.equals(differentUser)).toBe(false);
});
