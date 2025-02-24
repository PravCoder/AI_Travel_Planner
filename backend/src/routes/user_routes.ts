/*  Create backend endpoints related to user model here, like /login & /register  

1. Need to create a express router called userRouter or something, create a /login endpoint, export that router, and import it in index.js
2. In index.js import this userRouter and do app.use("/", userRouter);, so you can send requests to the endpoints in this file and test your code.
*/

/* 
The interface is just defining the structure of the body of the request that the endpoint recives from the request.
Postman-url: http://localhost:3001/user/test
Postman-request-body: 
{
  "form_input1": "Apple",
  "form_input2": "Orange"
}
*/

import express, { Request, Response } from "express";
import { hashPassword } from "../Functions/Password"; // Ensure correct folder casing
import UserModel from "../models/User"; // Ensure correct model import

const userRouter = express.Router(); // ✅ No need to declare as `Router`
interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

interface LoginRequestBody {
  username: string;
  email: string;
  password: string;
}

userRouter.post("/register", async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
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

// User /login endpoint
userRouter.post('/login', async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    const { username, email, password } = req.body;

    try {
        // Find the user
        const user = await UserModel.findOne({ email, password });
        if (!user) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error });
    }
});

export default userRouter;