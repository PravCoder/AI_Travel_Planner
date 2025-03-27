import dotenv from 'dotenv';
import OpenAI from 'openai';
import { TripParameters } from '../models/Trip';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
  isReadyForPlanning: boolean;
}> {
  // Build the system message
  const systemMessage: ChatMessage = {
    role: 'system',
    content: `You are a conversational AI assistant helping someone plan a trip.

    Your job is to gather trip preferences in a natural, friendly conversation. Keep replies brief (2-3 sentences max), and focus on asking thoughtful questions that help clarify what the traveler wants.
    
    You already know:
    - Destination: ${parameters.location || 'Not specified'}
    - Dates: ${
      parameters.startDate
        ? new Date(parameters.startDate).toLocaleDateString()
        : 'Not specified'
    } ${
      parameters.endDate
        ? 'to ' + new Date(parameters.endDate).toLocaleDateString()
        : ''
    }
    - Budget: ${parameters.budget || 'Not specified'}
    - Travelers: ${parameters.travelers || 'Not specified'}
    
    Your goals:
    - Fill in any missing details (dates, budget, preferences, group size)
    - Help the user reflect on what kind of trip they want (pace, interests, vibe)
    - Ask open-ended or multiple-choice questions to inspire the user
    
    Don't give a full itinerary. When you feel ready to create a full trip plan, say so and ask if they'd like you to do that.
    
    Keep your tone warm, concise, and curious—like a smart friend helping plan an awesome trip.`,
  };

  // Build the complete messages array
  const messages: ChatMessage[] = [systemMessage];

  // Add chat history if available
  if (chatHistory.length > 0) {
    messages.push(...chatHistory);
  }

  // Add the current user message
  messages.push({ role: 'user', content: message });

  // Call OpenAI with the specified model
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini-search-preview',
    messages,
  });

  const replyContent = response.choices[0].message.content || 'No response';

  // Check if the AI is indicating readiness to generate a trip plan
  const readinessIndicators = [
    /I(('|')?ve|have) gathered enough information/i,
    /I(('|')?m| am) ready to (create|generate|build|prepare) (a|your|an|the) (complete |detailed |full |)(itinerary|trip plan|travel plan)/i,
    /Would you like me to (create|generate|build|prepare) (a|your|an|the) (complete |detailed |full |)(itinerary|trip plan|travel plan)/i,
    /ready to see your (complete |detailed |full |)(itinerary|trip plan|travel plan)/i,
  ];

  const isReadyForPlanning = readinessIndicators.some((indicator) =>
    indicator.test(replyContent)
  );

  return {
    reply: replyContent,
    isReadyForPlanning,
  };
}

/**
 * Generate structured JSON trip plan
 * Creates a detailed itinerary based on collected parameters
 */
export async function generateStructuredTripPlan(
  parameters: TripParameters,
  conversationContext: string[] = []
): Promise<any> {
  // Build system message with JSON structure instructions
  const systemMessage: ChatMessage = {
    role: 'system',
    content: `Generate a detailed trip plan for ${
      parameters.location
    } as a valid JSON object with this structure:
    {
      "destination": "${parameters.location}",
      "startDate": ${
        parameters.startDate
          ? `"${new Date(parameters.startDate).toISOString().split('T')[0]}"`
          : 'null'
      },
      "endDate": ${
        parameters.endDate
          ? `"${new Date(parameters.endDate).toISOString().split('T')[0]}"`
          : 'null'
      },
      "days": [
        {
          "date": "YYYY-MM-DD or Day X",
          "activities": [
            {
              "name": "Activity name",
              "description": "Brief description",
              "location": "Specific location",
              "category": "Category (Food, Outdoor, Cultural, Entertainment, etc.)",
              "price": 1-5 (1=budget, 5=luxury),
              "tags": ["tag1", "tag2"]
            }
          ],
          "notes": "Optional day notes"
        }
      ],
      "budget": "${parameters.budget || 'medium'}",
      "travelers": ${parameters.travelers || 1},
      "summary": "Brief trip summary",
      "tags": ["tag1", "tag2"]
    }
    
    Create activities that are appropriate for the destination, budget level, and number of travelers.
    If dates are provided, create a day-by-day itinerary; otherwise, create a sample itinerary.
    Return ONLY valid JSON with no additional text before or after the JSON object.`,
  };

  // Add conversation context if available
  const contextMessage =
    conversationContext.length > 0
      ? {
          role: 'system' as const,
          content: `Relevant user preferences from conversation: ${conversationContext.join(
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
    content: `Please generate a complete trip plan for ${
      parameters.location
    } with the following parameters:
    - Budget: ${parameters.budget || 'medium'}
    - Number of travelers: ${parameters.travelers || 1}
    - Start date: ${
      parameters.startDate
        ? new Date(parameters.startDate).toLocaleDateString()
        : 'flexible'
    }
    - End date: ${
      parameters.endDate
        ? new Date(parameters.endDate).toLocaleDateString()
        : 'flexible'
    }`,
  });

  // Call OpenAI with the specified model and JSON response format
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini-search-preview',
    messages,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;

  if (!content) {
    throw new Error('No response content received from OpenAI');
  }

  // Parse the JSON response
  try {
    return JSON.parse(content);
  } catch (error) {
    console.error('Error parsing trip plan JSON:', error);
    throw new Error('Generated trip plan is not valid JSON');
  }
}
