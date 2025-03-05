import express, { Router, Request, Response } from "express";
import { hashPassword } from "../Functions/Password"; // Ensure correct import
import UserModel from "../models/User"; // Ensure correct model import

const userRouter: Router = express.Router(); // Explicitly defining Router type

/**
 * Register Route
 */
interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

/*
 * POSTMAN REQUEST URL: http://localhost:3001/user/register
 * JSON BODY:
 * {
 *   "username": "testUser",
 *   "email": "test@example.com",
 *   "password": "SecurePass123"
 * }
 */

userRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create and save new user
    const newUser = new UserModel({ username, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error in register route:", error);
    return res.status(500).json({ error: "Error registering user" });
  }
});

export default userRouter;
