import { Request, Response } from 'express';
import TripModel from '../models/Trip';
import UserModel from '../models/User';
import DestinationModel from '../models/Destination';
import {IDestinations} from '../models/Destination';
import {ITrip} from '../models/Trip';


/* 
Given a trip-object this function should return a list where each element is a day, and each day-element as multiple destinations and all their info. 
This is to display the trip by its grouping it into days on the create trip page. Not tested yet.
*/
export async function groupTripByDays(trip_id: string) {
  try {

    console.log("groupTripByDays trip_id: ",trip_id );
    const trip = await TripModel.findById(trip_id)
      .populate<{ destinations: IDestinations[] }>("destinations") //  correctly typed population
      .lean();


    if (!trip) {
      console.log("Trip not found");
      return;
    }

    const daysMap: Record<string, { date: string; hotel: string; activities: any[]; notes: string }> = {};

    trip.destinations.forEach((destination: IDestinations) => {
      const day = new Date(destination.startTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!daysMap[day]) {
        daysMap[day] = {
          date: day,
          hotel: "", // If needed, update logic to fetch hotel per day
          activities: [],
          notes: "", // You can enhance this if your data supports it
        };
      }

      daysMap[day].activities.push({
        title: destination.title,
        address: destination.address,
        startTime: destination.startTime,
        endTime: destination.endTime,
        activityType: destination.activityType,
        transportationMode: destination.transportationMode,
        cost: destination.cost,
        notes: destination.notes || "",
      });
    });

    const sortedDays = Object.values(daysMap).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Optional: get hotel name from the first destination of each day if applicable
    sortedDays.forEach(day => {
      if (day.activities.length > 0) {
        // You can adapt this to a smarter hotel extraction later
        day.hotel = trip.address || "Unknown Hotel";
        day.notes = `Day planned with ${day.activities.length} activities.`;
      }
    });

    const formattedTrip = {
      destination: trip.city,
      title: trip.title,
      startDate: new Date(trip.startDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      endDate: new Date(trip.endDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      days: sortedDays,
      budget: trip.budget,
      travelers: trip.numTravelers,
      summary: `${sortedDays.length}-day trip to ${trip.city}, filled with curated experiences.`,
      tags: [trip.city, "travel", "exploration", "activities"],
    };

    return formattedTrip;
  } catch (error) {
    console.error("Error grouping trip by days:", error);
    return;
  }
}