import express, { Router, Request, Response } from "express";
import TripModel from "../models/Trip"; // Ensure correct model import
import mongoose from 'mongoose';

const tripRouter: Router = express.Router();

tripRouter.post("/createTrip", async(req: Request, res: Response) => {
    try {

      const testUserId = new mongoose.Types.ObjectId(); // Temporary test user id.

        // Static trip data for testing
        const tripData = {
          title: "Test Trip", //Works with postman for a unique title, removed (unique: true) from Trip.ts but it still acts like it needs to be unique. 
          hours: new Date(), 
          activityType: "Hiking",
          cost: 50.0,
          rating: 4.5,
          cuisine: "yummy",
          location: {
            type: "Point",
            coordinates: [-122.4194, 37.7749], // Example coordinates (San Francisco)
          },
          user: testUserId, // Temporary test user id.
        };
    
        // Create and save the trip
        const newTrip = new TripModel(tripData);
        await newTrip.save();
        
    
        res.status(201).json({ message: "Trip created successfully!", trip: newTrip });
      } catch (error) {
        res.status(500).json({ error: "Error creating trip", details: error });
      }
    });
    
    export default tripRouter;