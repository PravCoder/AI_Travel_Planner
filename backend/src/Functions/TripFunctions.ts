import { Request, Response } from 'express';
import TripModel from '../models/Trip';
import UserModel from '../models/User';
import DestinationModel from '../models/Destination';

/* 
Given a trip-object this function should return a list where each element is a day, and each day-element as multiple destinations and all their info. 
This is to display the trip by its grouping it into days on the create trip page. Not tested yet.
*/
export async function groupTripByDays(trip_id: any) {
  try {
    // const { trip_id } = req.params;

    // Fetch the trip by ID and populate destinations
    const trip = await TripModel.findById(trip_id).populate("destinations");

    if (!trip) {
      console.log("trip not found");
      return;
    }

    const daysMap: Record<string, any> = {};

    // iterate every destination in trip to group by day its date
    trip.destinations.forEach((destination: any) => {
      const day = new Date(destination.startTime).toLocaleDateString(); // format date beacuse we need to torup it

      if (!daysMap[day]) {
        daysMap[day] = { date: day, destinations: [] };
      }

      daysMap[day].destinations.push(destination);
    });

    console.log("Days of trip: " + Object.values(daysMap));
    return Object.values(daysMap);
  } catch (error) {
    console.error("error grouping trip by days:", error);
    return;
  }
}