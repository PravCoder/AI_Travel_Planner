import express, { Request, Response, Router } from 'express';
import OpenAI from 'openai';
import { hashPassword } from '../functions/Password';
import UserModel from '../models/User';

const userRouter: Router = express.Router();

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
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create and save new user
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error in register route:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
}

/**
 * Generate AI Travel Itinerary
 *
 *
 * Generates a structured travel itinerary using OpenAI's text completion model.
 * This route expects specific fields in the request body (destination, budget, duration, activities),
 * and creates a detailed itinerary based on that structured input.
 *
 * Use this for form-driven itinerary generation where the user provides planning info.
 */
async function generateItinerary(req: Request, res: Response): Promise<void> {
  console.log(' API HIT: /generate-itinerary');
  console.log(' Headers:', req.headers); // Log headers
  console.log(' Raw Request Body:', req.body); // Log raw request body

  try {
    const { destination, budget, duration, activities } = req.body;

    if (!destination || !budget || !duration || !activities) {
      console.error(' Validation Failed: Missing fields in request.');
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }

    console.log(' Validation Passed. Sending request to OpenAI...');

    const prompt = `Generate a ${duration}-day travel itinerary for ${destination} with a budget of ${budget}. Include activities like ${activities.join(
      ', '
    )}.`;

    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 500,
    });

    console.log('✅ OpenAI Response Received');
    res.json({ itinerary: response.choices[0].text.trim() });
  } catch (error) {
    console.error(' Error generating itinerary:', error);
    res.status(500).json({ error: 'Failed to generate itinerary.' });
  }
} // END generateItinerary

/*
 * Chat with Open Ai
 *
 *Handles free-form travel-related questions using OpenAI's chat model (gpt-3.5-turbo).
 * This is a general-purpose chatbot endpoint where users can ask for tips, advice, or info.
 *
 * Use this for conversational travel help, outside of structured itinerary generation.
 */

async function chatWithOpenAI(req: Request, res: Response): Promise<void> {
  try {
    const { message } = req.body;

    if (!message) {
      return void res.status(400).json({ error: 'Message is required.' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini-search-preview',
      messages: [{ role: 'user', content: message }],
    });

    res.json({ reply: response.choices[0].message.content });
    console.log('OpenAI response: ', response);
  } catch (error: any) {
    console.error(' Error calling chat model:', error.message || error);
    res.status(500).json({ error: 'Chat request failed.' });
  }
} // END CHAT WITH OPEN AI

// Attach routes to Express router
userRouter.post('/register', registerUser);
userRouter.post('/generate-itinerary', generateItinerary);
userRouter.post('/chat', chatWithOpenAI);

export default userRouter;
