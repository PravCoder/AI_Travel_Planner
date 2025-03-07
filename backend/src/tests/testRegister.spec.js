const axios = require("axios");

const API_URL = "http://localhost:3001/user/register";

// Valid test cases
const validUsers = [
  { username: "ValidUser1", email: "valid1@example.com", password: "A1@bcdef" },
  { username: "ValidUser2", email: "valid2@example.com", password: "X9!yzuvw" },
  { username: "ValidUser3", email: "valid3@example.com", password: "Q2#mnopq" }
];

// Invalid test cases
const invalidUsers = [
  { username: "NoNumber", email: "nonumber@example.com", password: "A@bcdefg" }, // No number
  { username: "NoSpecial", email: "nospecial@example.com", password: "A1bcdefg" }, // No special char
  { username: "NoUpper", email: "noupper@example.com", password: "1@bcdefg" }, // No uppercase
  { username: "TooShort", email: "tooshort@example.com", password: "A1@" }, // Too short
  { username: "ExistingUser", email: "valid1@example.com", password: "A1@bcdef" } // Already exists
];

describe("User Registration API Tests", () => {
  // Test valid passwords
  validUsers.forEach((user) => {
    test(`Should register successfully: ${user.username}`, async () => {
      const response = await axios.post(API_URL, user);
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty("message", "User registered successfully!");
    });
  });

  // Test invalid passwords
  invalidUsers.forEach((user) => {
    test(`Should fail registration: ${user.username}`, async () => {
      try {
        await axios.post(API_URL, user);
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data).toHaveProperty("error");
      }
    });
  });
});
