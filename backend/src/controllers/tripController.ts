import { Request, Response } from 'express';
import { conversationalPlanningChat, generateStructuredTripPlan } from '../services/openAIService';
import { TripParameters } from '../models/Trip';
import TripModel from '../models/Trip';
import UserModel from '../models/User';
import DestinationModel from '../models/Destination';
import {IDestinations} from '../models/Destination';
import { groupTripByDays } from '../Functions/TripFunctions';
import mongoose, { Types } from 'mongoose';
import { jsPDF } from 'jspdf';



/**
 * Handle chat messages for the trip planning conversation
 */
export const chatWithTripPlanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, tripParameters, chatHistory, isTestRequest } = req.body;
    
    if (!message) {
      console.log('No message provided in request');
      res.status(400).json({ error: 'Message is required' });
      return;
    }
    
    // Check if this is a test request - if so, return a minimal response to save API costs
    if (isTestRequest) {
      console.log('Test request received - returning minimal response');
      res.json({
        reply: "Test response",
        commandDetected: false
      });
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
 * Generate a structured trip plan, the initial draft
 */
export const generateTripPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    // TODO: Once authentication is implemented, get userId from req.user.id
    // const userId = req.user?.id;

    const { tripParameters, conversationContext, tripID } = req.body;

    
    if (!tripParameters || !tripParameters.location) {
      res.status(400).json({ error: 'Trip parameters with location are required' });
      return;
    }

    console.log("Trip parameters exist (past 400 error check)");

    // get the trip-obj that we are generating trip-data for
    const trip = await TripModel.findById(tripID);
    
    // generate trip plan with OpenAI
    const tripPlanData = await generateStructuredTripPlan(
      tripParameters,
      conversationContext
    );

    // just create a variable to print activites across all days from generated trip plan to comapre with the saved trip object
    const all_activities: any[] = [];

    // breakdown generated-trip data format into its attributes for ease of acess
    const {destination, title, startDate, endDate, days, budget, travelers } = tripPlanData;

    // iterate all days of generated-trip
    for (const day of days) {
      const dayDate = new Date(day.date);
  
      // iterate all activities for cur-day
      for (const activity of day.activities) {
        all_activities.push(activity);
        // breakdown cur-activity into its attributes for ease of access
        const { name: act_name, description: act_description, location: act_location, category: act_category, price: act_price, time: act_time, tags: act_tags } = activity;
        console.log("---processing an activity---:")
        console.log("act_name: ", act_name);
        console.log("act_description: ", act_description);
        console.log("act_location: ", act_location);
        console.log("act_category: ", act_category);
        console.log("act_price: ", act_price);
        console.log("act_time: ", act_time);
        console.log("act_tags: ", act_tags);
        // parse the timings and cost for cur-activity
        const timeToUse = act_time.toLowerCase() === 'anytime' ? '09:00' : act_time;
        const act_startTime = new Date(`${day.date} ${timeToUse}`);
        let act_endTime: Date;
        if (act_time.toLowerCase() === 'anytime' || isNaN(act_startTime.getTime())) {
          act_endTime = new Date(act_startTime.getTime() + 60 * 60 * 1000); // 1 hour duration
        } else {
          act_endTime = new Date(act_startTime.getTime() + 60 * 60 * 1000); // Default 1 hour after start time
        }
        const act_costNum = act_price.toLowerCase() === 'free' ? 0 : act_price.toLowerCase() === 'varies' ? 0 : Number(act_price.replace(/[^0-9.-]+/g, '')) || 0;
        
        // create new destination-obj for cur-activity in cur-day
        const new_destination = new DestinationModel({
          title: act_name,
          notes: act_description,
          city: destination,  // set city of activity equal to destination of trip for now
          location: {
            type: 'Point',
            coordinates: [0, 0],
          },
          startTime: act_startTime,
          endTime: act_endTime,

          transportationMode: "Car",   // we havent handled transportation yet
          activityType: act_category,

          address: act_location,
          cost: act_costNum
        });
        // save this newly created destination obj for cur-act for cur-day
        // console.log("is trip null: ", trip);
        if (trip) {
          const savedNewDestination = await new_destination.save() as IDestinations & { _id: mongoose.Schema.Types.ObjectId };
          trip.destinations.push(savedNewDestination._id);
          await trip.save();
        }
      
      }
    }

    
    // for now, just return the generated trip plan.
    console.log("-----Generated Trip Plan Data:-----");
    console.log(tripPlanData);
    console.log("Activities----: ");
    console.log(all_activities);
    res.json(tripPlanData);

    console.log("\n-----Trip Object After Saving Generated Trip Data To It:-----");
    console.log(trip);
    
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
      const { userID } = req.body; // when this request is sent make sure to send user-id with it
      console.log("create empty trip userID: " + userID);
      // set destinations equal to empty array not null
      const new_trip = new TripModel({title:"Untitled Trip", startDate:null, endDate:null, numTravelers:null, budget:null, currentCost:null,country:null, city:null,destinations:[],address:null, location: { type: "Point", coordinates: [0, 0]} }); // 0,0 coordinates for now
      const saved_new_trip = await new_trip.save();

      const user = await UserModel.findById(userID); // get the current logged in user (via cookies)
      console.log("user: " + user);
      if (user != null) {
        console.log("creating empty trip for " + user.username)
        user.trips.push(saved_new_trip._id as any); // add the newly intialized trip-obj to the users trips
        await user.save();
      }

      // return the trip-id to put in the dynaimc url of /create-trip/{tripID}
      res.status(201).json({ message: "trip initialized successfully!", trip: saved_new_trip, tripID: saved_new_trip._id });
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



/* 
This rooute downloads a trip as a PDF, not working because its needs to return 
*/
export const downloadTripPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    // Your code logic here
  } catch (error) {
    // Error handling here
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
This function is not in use, its replacement is in TripFunctions.ts
This route is to test if a trip can be converted into a days grouping to be displayed into the createTripPage. 
POSTMAN URL: http://localhost:3001/trip/get-days-from-trip
{
    "trip_id":"680b0649e3f57ce79cfd98c4"
}
*/
export const getDaysFromTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const { trip_id } = req.params;
    console.log("getDaysFromTrip trip_id: ",trip_id );
    
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

/**
 * Get all trips for a specific user
 */
export const getTripsForUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userID } = req.params;
    
    // Find all trips for the user
    const user = await UserModel.findById(userID).populate("trips");
    
    if (user != null) {
      console.log("trips for user "+ userID +": " + user.trips.length);

      res.status(200).json(user.trips);
    }
  
  } catch (error) {
    console.error("Error fetching trips for user:", error);
    res.status(500).json({ error: "Failed to fetch trips for user" });
  }
};

/**
 * Get a tri-objp by its ID
 */
export const getTripById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tripID } = req.params;
    
    if (!tripID) {
      res.status(400).json({ error: 'Trip ID is required' });
      return;
    }
    
    // Find the trip
    const trip = await TripModel.findById(tripID);
    
    if (!trip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }
    
    res.status(200).json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ error: "Failed to fetch trip" });
  }
};
