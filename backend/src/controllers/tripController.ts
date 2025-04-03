import { Request, Response } from 'express';
import { conversationalPlanningChat, generateStructuredTripPlan } from '../services/openAIService';
import { TripParameters } from '../models/Trip';
import TripModel from '../models/Trip';
import UserModel from '../models/User';
import DestinationModel from '../models/Destination';
import { groupTripByDays } from '../Functions/TripFunctions';

/**
 * Handle chat messages for the trip planning conversation
 */
export const chatWithTripPlanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, tripParameters, chatHistory } = req.body;
    
    if (!message) {
      console.log('No message provided in request');
      res.status(400).json({ error: 'Message is required' });
      return;
    }
    
    // Check if user provided at least a location or tripType
    const parameters: TripParameters = tripParameters || {
      location: '',
      tripType: '',
      startDate: null,
      endDate: null,
      budget: 'medium',
      travelers: 1
    };
    
    console.log('Calling OpenAI service with parameters:', {
      message,
      parameters,
      chatHistoryLength: chatHistory?.length || 0
    });
    
    // Process chat with OpenAI service
    const { reply, commandDetected } = await conversationalPlanningChat(
      message,
      parameters,
      chatHistory
    );
    
    console.log('Received response from OpenAI:', {
      replyLength: reply?.length || 0,
      commandDetected
    });
    
    // Return response with planning readiness flag and command detection
    res.json({
      reply,
      commandDetected
    });
  } catch (error: any) {
    console.error('Error in chat with trip planner:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    res.status(500).json({ 
      error: error.message || 'Failed to process chat message',
      details: error.response?.data || null,
      type: error.name || 'UnknownError'
    });
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

    console.log("Trip parameters exist (past 400 error check)");
    
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



/* 
This route creates a empty trip object, with none of its attributes filled. This route is called when a user clicks the new trip button on the dashabord page.
As the user chats we will call another route called /update-trip which starts to fill in the attribute of the trip. 

Postman Url:  http://localhost:3001/trip/create-trip
Postman data:
{
    "userId":"67dcdde4defea3be5556cc6a"
}
*/
export const createEmptyTrip = async (req: Request, res: Response): Promise<void> => {
  try {
      const { userId } = req.body; // when this request is sent make sure to send user-id with it
      const new_trip = new TripModel({title:"Untitled Trip", startDate:null, endDate:null, numTravelers:null, budget:null, currentCost:null,country:null, city:null,destinations:null,address:null, location: { type: "Point", coordinates: [0, 0]} }); // 0,0 coordinates for now
      const saved_new_trip = await new_trip.save();

      const user = await UserModel.findById(userId); // get the current logged in user (via cookies)
      if (user != null) {
        console.log("creating empty trip for " + user.username)
        user.trips.push(saved_new_trip._id as any); // add the newly intialized trip-obj to the users trips
        await user.save();
      }
      res.status(201).json({ message: "trip initialized successfully!", trip: saved_new_trip });
    } catch (error) {
      res.status(500).json({ error: "error intializing trip", message: error });
    }
};


/* 
This route updates the trip object attributes as the user is chatting. For example when
*/
export const updateTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(201).json({ message: "trip updated successfully!" });
  } catch(eror) {
    res.status(201).json({ message: "error updating trip" });
  }
};


// -----TESTING ROUTES BELOW-----:

/* 
This route is to test a Trip object can be created with Destination objects. Check in mongodb that it was created by cntrl-F'ing the trip/destination object ids
POSTMAN-URL:  http://localhost:3001/trip/test-create-complete-trip
POSTMAN-BODY: none
*/
export const testCreateCompleteTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    // create two destinations with required fields
    const destination1 = new DestinationModel({
      title: "Eiffel Tower Visit",
      city: "Paris",
      location: { type: "Point", coordinates: [2.2945, 48.8584] },
      startTime: new Date("2024-07-01T10:00:00Z"),
      endTime: new Date("2024-07-01T12:00:00Z"),
      transportationMode: "Metro",
      activityType: "Sightseeing",
      address: "Champ de Mars, 5 Av. Anatole France, 75007 Paris, France",
      cost: 100
    });

    const destination2 = new DestinationModel({
      title: "Louvre Museum Tour",
      city: "Paris",
      location: { type: "Point", coordinates: [2.3364, 48.8606] },
      startTime: new Date("2024-07-02T14:00:00Z"),
      endTime: new Date("2024-07-02T17:00:00Z"),
      transportationMode: "Walk",
      activityType: "Museum Visit",
      address: "Rue de Rivoli, 75001 Paris, France",
      cost: 100
    });

    // save destinations to the database
    const savedDest1 = await destination1.save();
    const savedDest2 = await destination2.save();

    // create a trip with the two destinations
    const trip = new TripModel({
      title: "Paris Adventure",
      startDate: new Date("2024-07-01"),
      endDate: new Date("2024-07-03"),
      numTravelers: 2,
      budget: 1000,
      currentCost: 200,
      country: "France",
      city: "Paris",
      destinations: [savedDest1._id, savedDest2._id], // reference the saved destination ids
      address: "Paris, France",
      location: { type: "Point", coordinates: [2.3522, 48.8566] },
    });

    // save trip to database
    await trip.save();
    res.status(201).json({ message: "complete trip created successfully", trip_id: trip._id });
  } catch (error) {
    console.error("error creating complete trip:", error);
    res.status(400).json({ message: "Error creating a complete trip" });
  }
};



/* 
This route is to test if a trip can be converted into a days grouping to be displayed into the createTripPage. 
POSTMAN URL: http://localhost:3001/trip/test-get-days-from-trip
*/
export const testGetDaysFromTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    var trip_id = "67e9bdea6aed90e485048b4d"; // change this to test different trips grouping into days
    var days_of_trip = await groupTripByDays(trip_id); // <-- Await the async function
    if (!days_of_trip) {
      res.status(404).json({ message: "Trip not found or has no destinations" });
      return;
    }
    console.log("trip converted to days successfully!");
    console.log(days_of_trip);
    res.status(200).json(days_of_trip); 
  } catch (error) {
    console.error("Error getting days from trip:", error);
    res.status(500).json({ message: "Error getting days from trip" });
  }
};
