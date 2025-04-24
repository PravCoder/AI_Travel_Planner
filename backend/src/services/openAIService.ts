import dotenv from 'dotenv';
import OpenAI from 'openai';
import { z } from 'zod'; // Import zod
import { TripParameters } from '../models/Trip';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define validation schemas
const ChatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
});

const BaseTripParamsSchema = z.object({
  location: z.string().optional(),
  tripType: z.string().optional(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  budget: z.string().optional(),
  travelers: z.number().optional(),
});

const TripParametersSchema = BaseTripParamsSchema.refine(
  (data) => data.location || data.tripType,
  {
    message: 'Either location or trip type must be specified',
  }
);

// Schema for activity in trip plan
const ActivitySchema = z.object({
  name: z.string(),
  description: z.string(),
  location: z.string(),
  category: z.string(),
  price: z.string(),
  time: z.string(),
  tags: z.array(z.string()),
});

// Schema for a day in the trip plan
const DaySchema = z.object({
  date: z.string(),
  hotel: z.string(),
  activities: z.array(ActivitySchema),
  notes: z.string().optional(),
});

// Schema for the trip plan response
const TripPlanSchema = z.object({
  destination: z.string(),
  title: z.string(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  days: z.array(DaySchema),
  budget: z.string(),
  travelers: z.number(),
  summary: z.string(),
  tags: z.array(z.string()),
  nonce: z.number(),
});

// Response for chat
const ChatResponseSchema = z.object({
  reply: z.string(),
  commandDetected: z.boolean(),
});

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
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
    // Validate message
    const validatedMessage = z.string().parse(message);

    // Validate parameters (loose validation since some fields are optional)
    const validatedParams = BaseTripParamsSchema.parse(parameters);

    // Validate chat history
    const validatedHistory = z.array(ChatMessageSchema).parse(chatHistory);

    // Build the system message
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are a conversational AI assistant helping someone plan a trip.

Your job is to gather basic trip information and make reasonable assumptions for missing details. Keep replies brief (2-3 sentences max) and warm. If you need more information, focus on asking thoughtful questions that help clarify what the traveler wants.

You already know:
- Destination: ${validatedParams.location || 'Not specified'}
- Trip Type: ${validatedParams.tripType || 'Not specified'}
- Dates: ${
        validatedParams.startDate
          ? new Date(validatedParams.startDate).toLocaleDateString()
          : 'Not specified'
      } ${
        validatedParams.endDate
          ? 'to ' + new Date(validatedParams.endDate).toLocaleDateString()
          : ''
      }
- Budget Level: ${
        validatedParams.budget
          ? validatedParams.budget.charAt(0).toUpperCase() +
            validatedParams.budget.slice(1)
          : 'Medium (assumed)'
      }
- Travelers: ${validatedParams.travelers || '1 (assumed)'}

If the user doesn't specify some details, make reasonable assumptions based on their destination or trip type.

Ask questions to learn about their interests, preferences, and travel style, but don't be repetitive.

DO NOT use phrases like "I need more information" or "I need to know X before creating your plan."

If the user asks for a trip plan or itinerary, respond with: "I'll create your trip plan now."`,
    };

    // Build the complete messages array
    const messages: ChatMessage[] = [systemMessage];

    // Add chat history if available
    if (validatedHistory.length > 0) {
      messages.push(...validatedHistory);
    }

    // Add the current user message
    messages.push({ role: 'user', content: validatedMessage });

    // Call OpenAI with the specified model
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      response_format: { type: 'text' },
      temperature: 0.7,
      max_tokens: 500,
    });

    const replyContent = response.choices[0]?.message?.content;
    if (!replyContent) {
      throw new Error('No response content received from OpenAI');
    }

    // Check for trip plan generation commands
    const planCommandRegex =
      /(create|generate|make|show|give me).*(plan|itinerary|trip|schedule)/i;
    const aiPlanIndicator = /I'll create your trip plan now/i;

    const commandDetected =
      planCommandRegex.test(validatedMessage) ||
      aiPlanIndicator.test(replyContent);

    // Validate and return response
    return ChatResponseSchema.parse({
      reply: replyContent,
      commandDetected,
    });
  } catch (error: any) {
    // Handle zod validation errors
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      throw new Error(`Input validation failed: ${error.errors[0].message}`);
    }

    console.error('OpenAI API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack,
      type: error.name,
      code: error.code,
    });

    if (error.response?.status === 401) {
      throw new Error(
        'Invalid OpenAI API key. Please check your API key configuration.'
      );
    } else if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else {
      throw new Error(
        `OpenAI API error: ${error.message || 'Unknown error occurred'}`
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
    // Validate parameters
    const validatedParams = TripParametersSchema.parse(parameters);

    // Validate conversation context
    const validatedContext = z.array(z.string()).parse(conversationContext);

    const nonce = Math.floor(Math.random() * 1e6); // generate a random challenge key

    // Build system message with instructions
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `Generate a detailed trip plan ${
        validatedParams.location
          ? `for ${validatedParams.location}`
          : `for a ${validatedParams.tripType} trip`
      }.

For this trip, make reasonable assumptions about any missing information:
- Location: ${
        validatedParams.location ||
        '(Please select an appropriate destination based on the trip type)'
      }
- Trip Type: ${validatedParams.tripType || '(Determine based on the location)'}
- Dates: ${
        validatedParams.startDate
          ? `${new Date(validatedParams.startDate).toLocaleDateString()}`
          : 'Assume a 5-day trip starting next month'
      } 
  ${
    validatedParams.endDate
      ? `to ${new Date(validatedParams.endDate).toLocaleDateString()}`
      : ''
  }
- Budget: ${validatedParams.budget || 'medium (default)'} 
- Travelers: ${validatedParams.travelers || '1 (default)'}

Return ONLY the JSON with no additional text before or after it.`,
    };

    // Add conversation context if available
    const contextMessage =
      validatedContext.length > 0
        ? {
            role: 'system' as const,
            content: `Relevant user preferences from conversation: ${validatedContext.join(
              ' '
            )}`,
          }
        : null;

    // Build messages array
    const messages: ChatMessage[] = [systemMessage];
    if (contextMessage) messages.push(contextMessage);

    // Add user request message
    messages.push({
      role: 'user',
      content: `Generate a detailed trip plan ${
        validatedParams.location
          ? `for ${validatedParams.location}`
          : `for a ${validatedParams.tripType} trip`
      }. Make reasonable assumptions for any missing details and create an exciting itinerary.

        IMPORTANT: Include this verification number in your JSON response exactly as-is under a field called "nonce": ${nonce}`,
    });

    // Call OpenAI with the specified model and structured output format
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'TripPlan',
          schema: {
            type: 'object',
            properties: {
              destination: {
                type: 'string',
                description: 'The destination for the trip',
              },
              title: {
                type: 'string',
                description:
                  'Short, creative title for the trip, using the destination and trip type',
              },
              startDate: {
                type: ['string', 'null'],
                description:
                  'The start date of the trip in Month Day, Year format, or null if not specified',
              },
              endDate: {
                type: ['string', 'null'],
                description:
                  'The end date of the trip in Month Day, Year format, or null if not specified',
              },
              days: {
                type: 'array',
                description: 'Array of day objects containing activities',
                items: {
                  type: 'object',
                  properties: {
                    date: {
                      type: 'string',
                      description: "Day of trip in 'Month Day, Year' format",
                    },
                    hotel: {
                      type: 'string',
                      description:
                        'Name of the hotel, or none if not specified',
                    },
                    activities: {
                      type: 'array',
                      description: 'List of activities for this day',
                      items: {
                        type: 'object',
                        properties: {
                          name: {
                            type: 'string',
                            description: 'Name of the activity',
                          },
                          description: {
                            type: 'string',
                            description: 'Brief description of the activity',
                          },
                          location: {
                            type: 'string',
                            description: 'Specific location for the activity',
                          },
                          category: {
                            type: 'string',
                            description:
                              'Category of the activity (Food, Outdoor, Cultural, etc.)',
                          },
                          price: {
                            type: 'string',
                            description:
                              "Price of the activity in US dollars (format ${price}), 'Free' if it's free, else 'Varies'",
                          },
                          time: {
                            type: 'string',
                            description:
                              "Time of the activity in HH:MM AM/PM format, or 'Anytime' if not specified",
                          },
                          tags: {
                            type: 'array',
                            description: 'Tags relevant to this activity',
                            items: {
                              type: 'string',
                            },
                          },
                        },
                        required: [
                          'name',
                          'description',
                          'location',
                          'category',
                          'price',
                          'time',
                        ],
                      },
                    },
                    notes: {
                      type: 'string',
                      description: 'Optional notes for this day',
                    },
                  },
                  required: ['date', 'activities', 'hotel'],
                },
              },
              budget: {
                type: 'string',
                description:
                  'Budget level (budget, economy, medium, premium, luxury)',
              },
              travelers: {
                type: 'integer',
                description: 'Number of travelers',
              },
              summary: {
                type: 'string',
                description: 'Brief summary of the trip plan',
              },
              tags: {
                type: 'array',
                description: 'Tags relevant to this trip',
                items: {
                  type: 'string',
                },
              },
              nonce: {
                type: 'integer',
                description: 'Verification number echoed from the prompt',
              },
            },
            required: [
              'destination',
              'title',
              'days',
              'budget',
              'travelers',
              'summary',
              'tags',
              'nonce',
            ],
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response content received from OpenAI');
    }

    // Step 1: Try to parse the JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(content);
    } catch (error) {
      console.error('Error parsing trip plan JSON:', error);
      throw new Error('Generated trip plan is not valid JSON');
    }

    // Step 2: Validate against the Zod schema
    let validatedResponse;
    try {
      validatedResponse = TripPlanSchema.parse(parsedResponse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Schema validation error:', error.errors);
        throw new Error(
          `Trip plan validation failed: ${error.errors[0].message}`
        );
      }
      throw error;
    }

    // Step 3: Check the nonce outside both try/catch blocks
    if (validatedResponse.nonce !== nonce) {
      console.error(
        `Nonce mismatch: expected ${nonce}, got ${validatedResponse.nonce}`
      );
      throw new Error(
        'OpenAI API error: Response failed verification. Rejecting untrusted response.'
      );
    }

    // Step 4: Remove the nonce field before returning
    const { nonce: _, ...responseWithoutNonce } = validatedResponse;
    return responseWithoutNonce;
  } catch (error: any) {
    // Handle zod validation errors
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      throw new Error(`Input validation failed: ${error.errors[0].message}`);
    }

    console.error('OpenAI API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack,
    });

    if (error.response?.status === 401) {
      throw new Error(
        'Invalid OpenAI API key. Please check your API key configuration.'
      );
    } else if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else {
      throw new Error(
        `OpenAI API error: ${error.message || 'Unknown error occurred'}`
      );
    }
  }
}
