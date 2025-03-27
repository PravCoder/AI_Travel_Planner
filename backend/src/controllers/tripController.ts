import { Request, Response } from 'express';
import { conversationalPlanningChat, generateStructuredTripPlan } from '../services/openAIService';
import { TripParameters } from '../models/Trip';

/**
 * Handle chat messages for the trip planning conversation
 */
export const chatWithTripPlanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, tripParameters, chatHistory } = req.body;
    
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }
    
    // Use provided parameters or initialize empty ones
    const parameters: TripParameters = tripParameters || {
      location: '',
      startDate: null,
      endDate: null,
      budget: 'medium',
      travelers: 1
    };
    
    // Process chat with OpenAI service
    const { reply, isReadyForPlanning } = await conversationalPlanningChat(
      message,
      parameters,
      chatHistory
    );
    
    // Return response with planning readiness flag
    res.json({
      reply,
      isReadyForPlanning
    });
  } catch (error: any) {
    console.error('Error in chat with trip planner:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
};

/**
 * Generate a structured trip plan
 */
export const generateTripPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tripParameters, conversationContext } = req.body;
    
    // TODO: Once authentication is implemented, get userId from req.user.id
    // const userId = req.user?.id;
    
    if (!tripParameters || !tripParameters.location) {
      res.status(400).json({ error: 'Trip parameters with location are required' });
      return;
    }
    
    // Generate trip plan with OpenAI
    const tripPlanData = await generateStructuredTripPlan(
      tripParameters,
      conversationContext
    );
    
    // TODO: Once authentication is implemented, save the trip to the database for logged-in users
    // if (userId) {
    //   const trip = new TripModel({
    //     userId: userId,
    //     ...tripPlanData
    //   });
    //   await trip.save();
    // }
    
    // For now, just return the generated trip plan without saving to DB
    res.json(tripPlanData);
    
  } catch (error: any) {
    console.error('Error generating trip plan:', error);
    res.status(500).json({ error: 'Failed to generate trip plan' });
  }
};