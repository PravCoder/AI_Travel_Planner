import express, { Router, Request, Response } from "express";
import TripModel from "../models/Trip"; // Ensure correct model import
import UserModel from "../models/User";
import mongoose from 'mongoose';
const tripRouter: Router = express.Router();
import { Types } from "mongoose";

/* 
This route creates a empty trip object, with none of its attributes filled. This route is called when a user clicks the new trip button on the dashabord page.
As the user chats we will call another route called /update-trip which starts to fill in the attribute of the trip. 


*/
tripRouter.post("/create-trip", async(req: Request, res: Response) => {
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
});


/* 
This route updates the tirp object attributes as the user is chatting.
*/


    
export default tripRouter;