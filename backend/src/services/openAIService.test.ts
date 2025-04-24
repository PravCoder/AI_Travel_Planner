import OpenAI from 'openai';
import {
  conversationalPlanningChat,
  generateStructuredTripPlan,
} from './openAIService';

// Mock OpenAI
jest.mock('openai', () => {
  const mockCreate = jest.fn();
  const mockOpenAIInstance = {
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  };

  const OpenAIConstructor = jest.fn(() => mockOpenAIInstance);

  return {
    __esModule: true,
    default: OpenAIConstructor,
  };
});

describe('OpenAI Service', () => {
  let mockOpenAI: OpenAI;

  beforeEach(() => {
    // Reset mocks before each test
    mockOpenAI = new OpenAI();
    jest.clearAllMocks();
  });

  // Tests for conversationalPlanningChat
  describe('conversationalPlanningChat', () => {
    it('should detect when user requests a plan', async () => {
      // Arrange
      mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content:
                'I can help you plan your trip. What are your interests?',
            },
          },
        ],
      });

      // Act
      const result = await conversationalPlanningChat('Create a plan for me', {
        location: 'Paris',
        budget: 'medium',
        travelers: 2,
        startDate: null,
        endDate: null,
      });

      // Assert
      expect(result.commandDetected).toBe(true);
    });

    it('should detect when AI indicates plan generation', async () => {
      // Arrange
      mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: "I'll create your trip plan now.",
            },
          },
        ],
      });

      // Act
      const result = await conversationalPlanningChat(
        'Tell me more about Paris',
        {
          location: 'Paris',
          budget: 'medium',
          travelers: 2,
          startDate: null,
          endDate: null,
        }
      );

      // Assert
      expect(result.commandDetected).toBe(true);
    });

    it('should not trigger planning when no planning commands are detected', async () => {
      // Arrange
      mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content:
                'What kind of activities are you interested in doing in Paris?',
            },
          },
        ],
      });

      // Act
      const result = await conversationalPlanningChat('I like art museums', {
        location: 'Paris',
        budget: 'medium',
        travelers: 2,
        startDate: null,
        endDate: null,
      });

      // Assert
      expect(result.commandDetected).toBe(false);
    });

    it('should handle OpenAI errors gracefully', async () => {
      // Arrange
      mockOpenAI.chat.completions.create = jest
        .fn()
        .mockRejectedValue(new Error('API Error'));

      // Act & Assert
      await expect(
        conversationalPlanningChat('Hello', {
          location: 'Paris',
          budget: 'medium',
          travelers: 2,
          startDate: null,
          endDate: null,
        })
      ).rejects.toThrow('OpenAI API error');
    });

    it('should handle minimal trip parameters', async () => {
      mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'I need more information.' } }],
      });

      // The key here is that "Plan my trip" contains the word "plan" which should
      // trigger command detection per the regex in the service
      const result = await conversationalPlanningChat(
        'Can you create a trip plan for me?',
        {
          location: '',
          budget: '',
          travelers: 0,
          startDate: null,
          endDate: null,
        }
      );

      // Explicitly testing the planCommandRegex behavior
      expect(result.commandDetected).toBe(true);
    });

    it('should handle large conversation history', async () => {
      mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
        choices: [{ message: { content: "Let's continue planning." } }],
      });

      const longHistory = Array(20).fill({
        role: 'user',
        content: 'Message content',
      });
      const result = await conversationalPlanningChat(
        'One more question',
        {
          location: 'Paris',
          budget: 'medium',
          travelers: 2,
          startDate: null,
          endDate: null,
        },
        longHistory
      );

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalled();
    });

    it('should throw for 401 unauthorized errors', async () => {
      // Arrange
      const error = new Error('Unauthorized');
      (error as any).response = { status: 401 };
      mockOpenAI.chat.completions.create = jest.fn().mockRejectedValue(error);

      // Act & Assert
      await expect(
        conversationalPlanningChat('Hello', {
          location: 'Paris',
          budget: 'medium',
          travelers: 2,
          startDate: null,
          endDate: null,
        })
      ).rejects.toThrow('Invalid OpenAI API key');
    });
  });

  // Tests for generateStructuredTripPlan
  describe('generateStructuredTripPlan', () => {
    it('should parse valid JSON response with nonce verification', async () => {
      // Mock Math.random to control the nonce
      const mockRandom = jest
        .spyOn(global.Math, 'random')
        .mockReturnValue(0.123456);

      // Create a complete mock response that matches the schema
      const mockJSON = {
        destination: 'Paris',
        title: 'Paris Adventure',
        startDate: '2025-05-01', // Include required fields
        endDate: '2025-05-07', // Include required fields
        days: [
          {
            date: 'May 1, 2025',
            activities: [
              {
                name: 'Eiffel Tower',
                description: 'Visit the iconic tower',
                location: 'Champ de Mars',
                category: 'Sightseeing',
                price: '€20',
                time: '10:00 AM',
                tags: ['landmark'],
              },
            ],
            hotel: 'Hotel Paris',
          },
        ],
        budget: 'medium',
        travelers: 2,
        summary: 'A great trip to Paris',
        tags: ['cultural'],
        nonce: 123456, // Should match the mocked random value
      };

      mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockJSON),
            },
          },
        ],
      });

      // Act - Use a real location to satisfy the validation
      const result = await generateStructuredTripPlan({
        location: 'Paris',
        budget: 'medium',
        travelers: 2,
        startDate: '2025-05-01', // Use string dates
        endDate: '2025-05-07', // Use string dates
      });

      // Assert
      expect(result.destination).toBe('Paris');
      expect(result.nonce).toBeUndefined(); // Nonce should be removed
      mockRandom.mockRestore();
    });

    it('should reject responses with incorrect nonce', async () => {
      // Mock Math.random to control the nonce
      const mockRandom = jest
        .spyOn(global.Math, 'random')
        .mockReturnValue(0.123456);

      // Create a complete mock response that matches the schema but with wrong nonce
      const mockJSON = {
        destination: 'Paris',
        title: 'Paris Adventure',
        startDate: '2025-05-01',
        endDate: '2025-05-07',
        days: [
          {
            date: 'May 1, 2025',
            activities: [
              {
                name: 'Eiffel Tower',
                description: 'Visit the iconic tower',
                location: 'Champ de Mars',
                category: 'Sightseeing',
                price: '€20',
                time: '10:00 AM',
                tags: ['landmark'],
              },
            ],
            hotel: 'Hotel Paris',
          },
        ],
        budget: 'medium',
        travelers: 2,
        summary: 'A great trip to Paris',
        tags: ['cultural'],
        nonce: 999999, // Wrong nonce
      };

      mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockJSON),
            },
          },
        ],
      });

      // Act & Assert
      await expect(
        generateStructuredTripPlan({
          location: 'Paris',
          budget: 'medium',
          travelers: 2,
          startDate: '2025-05-01',
          endDate: '2025-05-07',
        })
      ).rejects.toThrow(
        'OpenAI API error: Response failed verification. Rejecting untrusted response.'
      );

      mockRandom.mockRestore();
    });

    it('should include conversation context in the prompt', async () => {
      // Mock Math.random to control the nonce
      const mockRandom = jest
        .spyOn(global.Math, 'random')
        .mockReturnValue(0.123456);

      // Create a complete mock response
      const mockJSON = {
        destination: 'Paris',
        title: 'Paris Adventure',
        startDate: '2025-05-01',
        endDate: '2025-05-07',
        days: [
          {
            date: 'May 1, 2025',
            activities: [
              {
                name: 'Museum Visit',
                description: 'Visit museums in Paris',
                location: 'Paris',
                category: 'Cultural',
                price: '€15',
                time: '11:00 AM',
                tags: ['cultural'],
              },
            ],
            hotel: 'Hotel Paris',
          },
        ],
        budget: 'medium',
        travelers: 2,
        summary: 'A great trip to Paris',
        tags: ['cultural'],
        nonce: 123456,
      };

      mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockJSON),
            },
          },
        ],
      });

      const contextArray = ['I like museums', 'I prefer walking tours'];

      // Act
      await generateStructuredTripPlan(
        {
          location: 'Paris',
          budget: 'medium',
          travelers: 2,
          startDate: '2025-05-01',
          endDate: '2025-05-07',
        },
        contextArray
      );

      // Assert
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              content: expect.stringContaining('museums'),
            }),
          ]),
        })
      );

      mockRandom.mockRestore();
    });

    it('should handle invalid JSON responses', async () => {
      // Mock Math.random
      const mockRandom = jest
        .spyOn(global.Math, 'random')
        .mockReturnValue(0.123456);

      // Suppress console.error output during test
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Return invalid JSON
      mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'This is not valid JSON' } }],
      });

      // Act & Assert
      await expect(
        generateStructuredTripPlan({
          location: 'Paris',
          budget: 'medium',
          travelers: 2,
          startDate: '2025-05-01',
          endDate: '2025-05-07',
        })
      ).rejects.toThrow('Generated trip plan is not valid JSON');

      // Cleanup
      consoleSpy.mockRestore();
      mockRandom.mockRestore();
    });

    it('should require either location or trip type', async () => {
      // Act & Assert
      await expect(
        generateStructuredTripPlan({
          location: '',
          tripType: '',
          budget: 'medium',
          travelers: 2,
          startDate: null,
          endDate: null,
        })
      ).rejects.toThrow('Either location or trip type must be specified');
    });
  });
});
