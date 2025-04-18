import dotenv from "dotenv";
import OpenAI from "openai";
import { TripParameters } from "../models/Trip";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Chat service for the conversational intake phase
 * Maintains chat history and provides travel planning guidance
 */
export async function conversationalPlanningChat(
  message: string,
  parameters: TripParameters,
  chatHistory: ChatMessage[] = []
): Promise<{
  reply: string;
  commandDetected: boolean;
}> {
  try {
    // Build the system message
    const systemMessage: ChatMessage = {
      role: "system",
      content: `You are a conversational AI assistant helping someone plan a trip.

Your job is to gather basic trip information and make reasonable assumptions for missing details. Keep replies brief (2-3 sentences max) and warm. If you need more information, focus on asking thoughtful questions that help clarify what the traveler wants.

You already know:
- Destination: ${parameters.location || "Not specified"}
- Trip Type: ${parameters.tripType || "Not specified"}
- Dates: ${
        parameters.startDate
          ? new Date(parameters.startDate).toLocaleDateString()
          : "Not specified"
      } ${
        parameters.endDate
          ? "to " + new Date(parameters.endDate).toLocaleDateString()
          : ""
      }
- Budget Level: ${
        parameters.budget
          ? parameters.budget.charAt(0).toUpperCase() +
            parameters.budget.slice(1)
          : "Medium (assumed)"
      }
- Travelers: ${parameters.travelers || "1 (assumed)"}

If the user doesn't specify some details, make reasonable assumptions based on their destination or trip type.

Ask questions to learn about their interests, preferences, and travel style, but don't be repetitive.

DO NOT use phrases like "I need more information" or "I need to know X before creating your plan."

If the user asks for a trip plan or itinerary, respond with: "I'll create your trip plan now."`,
    };

    // Build the complete messages array
    const messages: ChatMessage[] = [systemMessage];

    // Add chat history if available
    if (chatHistory.length > 0) {
      messages.push(...chatHistory);
    }

    // Add the current user message
    messages.push({ role: "user", content: message });

    // Call OpenAI with the specified model
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      response_format: { type: "text" },
      temperature: 0.7,
      max_tokens: 500,
    });

    const replyContent = response.choices[0]?.message?.content;
    if (!replyContent) {
      throw new Error("No response content received from OpenAI");
    }

    // Check for trip plan generation commands
    const planCommandRegex =
      /(create|generate|make|show|give me).*(plan|itinerary|trip|schedule)/i;
    const aiPlanIndicator = /I'll create your trip plan now/i;

    const commandDetected =
      planCommandRegex.test(message) || aiPlanIndicator.test(replyContent);

    return {
      reply: replyContent,
      commandDetected,
    };
  } catch (error: any) {
    console.error("OpenAI API Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack,
      type: error.name,
      code: error.code,
    });

    if (error.response?.status === 401) {
      throw new Error(
        "Invalid OpenAI API key. Please check your API key configuration."
      );
    } else if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    } else {
      throw new Error(
        `OpenAI API error: ${error.message || "Unknown error occurred"}`
      );
    }
  }
}

/**
 * Generate structured JSON trip plan
 * Creates a detailed itinerary based on collected parameters
 */
export async function generateStructuredTripPlan(
  parameters: TripParameters,
  conversationContext: string[] = []
): Promise<any> {
  try {
    const nonce = Math.floor(Math.random() * 1e6); // generate a random challenge key

    // Ensure we have either a location or trip type
    if (!parameters.location && !parameters.tripType) {
      throw new Error("Either location or trip type must be specified");
    }

    // Build system message with instructions
    const systemMessage: ChatMessage = {
      role: "system",
      content: `Generate a detailed trip plan ${
        parameters.location
          ? `for ${parameters.location}`
          : `for a ${parameters.tripType} trip`
      }.

For this trip, make reasonable assumptions about any missing information:
- Location: ${
        parameters.location ||
        "(Please select an appropriate destination based on the trip type)"
      }
- Trip Type: ${parameters.tripType || "(Determine based on the location)"}
- Dates: ${
        parameters.startDate
          ? `${new Date(parameters.startDate).toLocaleDateString()}`
          : "Assume a 5-day trip starting next month"
      } 
  ${
    parameters.endDate
      ? `to ${new Date(parameters.endDate).toLocaleDateString()}`
      : ""
  }
- Budget: ${parameters.budget || "medium (default)"} 
- Travelers: ${parameters.travelers || "1 (default)"}

Return ONLY the JSON with no additional text before or after it.`,
    };

    // Add conversation context if available
    const contextMessage =
      conversationContext.length > 0
        ? {
            role: "system" as const,
            content: `Relevant user preferences from conversation: ${conversationContext.join(
              " "
            )}`,
          }
        : null;

    // Build messages array
    const messages: ChatMessage[] = [systemMessage];
    if (contextMessage) messages.push(contextMessage);

    // Add user request message
    messages.push({
      role: "user",
      content: `Generate a detailed trip plan ${
          parameters.location
              ? `for ${parameters.location}`
              : `for a ${parameters.tripType} trip`
      }. Make reasonable assumptions for any missing details and create an exciting itinerary.

        IMPORTANT: Include this verification number in your JSON response exactly as-is under a field called "nonce": ${nonce}`
    });


    // Call OpenAI with the specified model and structured output format
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "TripPlan",
          schema: {
            type: "object",
            properties: {
              destination: {
                type: "string",
                description: "The destination for the trip",
              },
              title: {
                type: "string",
                description:
                  "Short, creative title for the trip, using the destination and trip type",
              },
              startDate: {
                type: ["string", "null"],
                description:
                  "The start date of the trip in Month Day, Year format, or null if not specified",
              },
              endDate: {
                type: ["string", "null"],
                description:
                  "The end date of the trip in Month Day, Year format, or null if not specified",
              },
              days: {
                type: "array",
                description: "Array of day objects containing activities",
                items: {
                  type: "object",
                  properties: {
                    date: {
                      type: "string",
                      description: "Day of trip in 'Month Day, Year' format",
                    },
                    hotel: {
                      type: "string",
                      description:
                        "Name of the hotel, or none if not specified",
                    },
                    activities: {
                      type: "array",
                      description: "List of activities for this day",
                      items: {
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                            description: "Name of the activity",
                          },
                          description: {
                            type: "string",
                            description: "Brief description of the activity",
                          },
                          location: {
                            type: "string",
                            description: "Specific location for the activity",
                          },
                          category: {
                            type: "string",
                            description:
                              "Category of the activity (Food, Outdoor, Cultural, etc.)",
                          },
                          price: {
                            type: "string",
                            description:
                              "Price of the activity in US dollars (format ${price}), 'Free' if it's free, else 'Varies'",
                          },
                          time: {
                            type: "string",
                            description:
                              "Time of the activity in HH:MM AM/PM format, or 'Anytime' if not specified",
                          },
                          tags: {
                            type: "array",
                            description: "Tags relevant to this activity",
                            items: {
                              type: "string",
                            },
                          },
                        },
                        required: [
                          "name",
                          "description",
                          "location",
                          "category",
                          "price",
                          "time",
                        ],
                      },
                    },
                    notes: {
                      type: "string",
                      description: "Optional notes for this day",
                    },
                  },
                  required: ["date", "activities", "hotel"],
                },
              },
              budget: {
                type: "string",
                description:
                  "Budget level (budget, economy, medium, premium, luxury)",
              },
              travelers: {
                type: "integer",
                description: "Number of travelers",
              },
              summary: {
                type: "string",
                description: "Brief summary of the trip plan",
              },
              tags: {
                type: "array",
                description: "Tags relevant to this trip",
                items: {
                  type: "string",
                },
              },
              nonce:{
                type: "integer",
                description: "Verification number echoed from the prompt"
              }
            },
            required: [
              "destination",
              "title",
              "days",
              "budget",
              "travelers",
              "summary",
              "tags",
              "nonce",
            ],
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No response content received from OpenAI");
    }

    // Parse the JSON response
    try {
      const parsedResponse = JSON.parse(content);

      // Verify integrity of response
      if (parsedResponse.nonce !== nonce) {
        console.error(`Nonce mismatch: expected ${nonce}, got ${parsedResponse.nonce}`);
        throw new Error("Response failed verification. Rejecting untrusted response.");
      }
      // remove this so we don't have to deal with it on the UI side
      delete parsedResponse.nonce;


      // Validate the structure meets our requirements
      if (!parsedResponse.destination || !Array.isArray(parsedResponse.days)) {
        throw new Error("Invalid trip plan format: missing required fields");
      }

      return parsedResponse;
    } catch (error) {
      console.error("Error parsing trip plan JSON:", error);
      throw new Error("Generated trip plan is not valid JSON");
    }
  } catch (error: any) {
    console.error("OpenAI API Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack,
    });

    if (error.response?.status === 401) {
      throw new Error(
        "Invalid OpenAI API key. Please check your API key configuration."
      );
    } else if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    } else {
      throw new Error(
        `OpenAI API error: ${error.message || "Unknown error occurred"}`
      );
    }
  }
}
