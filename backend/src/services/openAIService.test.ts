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
    __esModule: true, // This makes it work like a module
    default: OpenAIConstructor,
  };
});

describe('OpenAI Service', () => {
  let mockOpenAI;

  beforeEach(() => {
    // Reset mocks before each test
    mockOpenAI = new OpenAI();
    jest.clearAllMocks();
  });

  // Tests for conversationalPlanningChat
  describe('conversationalPlanningChat', () => {
    it('should detect when AI is ready to generate plan', async () => {
      // Arrange
      mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content:
                'I think I have enough information to create your trip plan now. Would you like me to generate it?',
            },
          },
        ],
      });

      // Act
      const result = await conversationalPlanningChat("Let's create a plan", {
        location: 'Paris',
        budget: 'medium',
        travelers: 2,
        startDate: null,
        endDate: null,
      });

      // Assert
      expect(result.isReadyForPlanning).toBe(true);
    });

    it('should not trigger planning when readiness phrase is not present', async () => {
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
      const result = await conversationalPlanningChat("Let's plan a trip", {
        location: 'Paris',
        budget: 'medium',
        travelers: 2,
        startDate: null,
        endDate: null,
      });

      // Assert
      expect(result.isReadyForPlanning).toBe(false);
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
      ).rejects.toThrow();
    });

    it('should handle minimal trip parameters', async () => {
      mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'I need more information.' } }],
      });

      const result = await conversationalPlanningChat('Plan my trip', {
        location: '',
        budget: '',
        travelers: 0,
        startDate: null,
        endDate: null,
      });

      expect(result.isReadyForPlanning).toBe(false);
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
  });

  // Tests for generateStructuredTripPlan
  describe('generateStructuredTripPlan', () => {
    it('should parse valid JSON response', async () => {
      // Arrange
      const mockJSON = { destination: 'Paris', days: [] };
      mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockJSON),
            },
          },
        ],
      });

      // Act
      const result = await generateStructuredTripPlan({
        location: 'Paris',
        budget: 'medium',
        travelers: 2,
        startDate: null,
        endDate: null,
      });

      // Assert
      expect(result).toEqual(mockJSON);
    });

    it('should include conversation context in the prompt', async () => {
      // Arrange
      mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
        choices: [
          { message: { content: '{"destination":"Paris","days":[]}' } },
        ],
      });

      const contextArray = ['I like museums', 'I prefer walking tours'];

      // Act
      await generateStructuredTripPlan(
        {
          location: 'Paris',
          budget: 'medium',
          travelers: 2,
          startDate: null,
          endDate: null,
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
    });

    it('should handle invalid JSON responses', async () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'This is not valid JSON' } }],
      });

      await expect(
        generateStructuredTripPlan({
          location: 'Paris',
          budget: 'medium',
          travelers: 2,
          startDate: null,
          endDate: null,
        })
      ).rejects.toThrow('Generated trip plan is not valid JSON');

      consoleSpy.mockRestore();
    });
  });
});
