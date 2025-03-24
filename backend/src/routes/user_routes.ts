import express, { Router, Request, Response } from "express";
import { hashPassword } from "../Functions/Password"; // Ensure correct import
import UserModel from "../models/User"; // Ensure correct model import
import OpenAI from "openai"; // Import OpenAI

const userRouter: Router = express.Router(); // Explicitly defining Router type

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your .env file
});

/**
 * Register User
 */
async function registerUser(req: Request, res: Response): Promise<void> {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create and save new user
    const newUser = new UserModel({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error in register route:", error);
    res.status(500).json({ error: "Error registering user" });
  }
}

/**
 * Generate AI Travel Itinerary
 */
async function generateItinerary(req: Request, res: Response): Promise<void> {
  console.log(" API HIT: /generate-itinerary");
  console.log(" Headers:", req.headers); // Log headers
  console.log(" Raw Request Body:", req.body); // Log raw request body

  try {
    const { destination, budget, duration, activities } = req.body;

    if (!destination || !budget || !duration || !activities) {
      console.error(" Validation Failed: Missing fields in request.");
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    console.log(" Validation Passed. Sending request to OpenAI...");

    const prompt = `Generate a ${duration}-day travel itinerary for ${destination} with a budget of ${budget}. Include activities like ${activities.join(', ')}.`;

    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 500,
    });

    console.log("✅ OpenAI Response Received");
    res.json({ itinerary: response.choices[0].text.trim() });
  } catch (error) {
    console.error(" Error generating itinerary:", error);
    res.status(500).json({ error: "Failed to generate itinerary." });
  }
}




// Attach routes to Express router
userRouter.post("/register", registerUser);
userRouter.post("/generate-itinerary", generateItinerary);

export default userRouter;
