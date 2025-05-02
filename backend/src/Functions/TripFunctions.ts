import { Request, Response } from 'express';
import TripModel from '../models/Trip';
import UserModel from '../models/User';
import DestinationModel from '../models/Destination';
import {IDestinations} from '../models/Destination';
import {ITrip} from '../models/Trip';


/* 
Given a trip-object this function should return a list where each element is a day, and each day-element as multiple destinations and all their info. 
This is to display the trip by its grouping it into days on the create trip page.
*/
export async function groupTripByDays(trip_id: string) {
  try {
    console.log("groupTripByDays trip_id: ", trip_id);
    
    const trip = await TripModel.findById(trip_id)
      .populate<{ destinations: IDestinations[] }>("destinations")
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
          hotel: "", 
          activities: [],
          notes: "", 
        };
      }

      daysMap[day].activities.push({
        name: destination.title,
        description: destination.notes || "",
        location: destination.address,
        category: destination.activityType?.toLowerCase() || "general",
        price: destination.cost ? `$${destination.cost}` : "Free",
        time: new Date(destination.startTime).toLocaleTimeString("en-US", {  // only show time not full time object for time of each activity
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        tags: [], // Add tags if you have, otherwise keep empty
      });
    });

    const sortedDays = Object.values(daysMap).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    sortedDays.forEach(day => {
      if (day.activities.length > 0) {
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


export async function canDownloadTripPDF(trip: any) {
  // TBD
  if (!trip || !trip.trip_id || !trip.trip_name || !trip.start_date || !trip.end_date) {
    return false; // Return false if the trip is missing essential properties
  }

  // Check if the destinations array exists and has at least one destination
  if (!trip.destinations || trip.destinations.length === 0) {
    return false; // Return false if there are no destinations
  }

  return true;
}