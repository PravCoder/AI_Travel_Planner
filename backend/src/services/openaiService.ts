import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure your .env file is set up correctly
});

export async function generateItinerary(userInput: string): Promise<string> {
  try {
    const response = await openai.completions.create({
      model: "text-davinci-003", // Or use "gpt-4" if you have access
      prompt: userInput,
      max_tokens: 500,
    });

    return response.choices[0].text.trim();
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw new Error("Failed to generate itinerary.");
  }
}
