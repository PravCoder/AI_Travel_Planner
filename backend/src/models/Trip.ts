import mongoose, { Schema, Document, Model } from "mongoose";

// define the interface for the Trip schema 
interface ITrip extends Document {
  title: string;
  startDate: Date; 
  endDate: Date;
  numTravelers: number;
  budget: number;
  currentCost: number;
  country: string;
  city: string;
  destinations: Schema.Types.ObjectId[]; //array of destination objects
  address: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

// define the schema for the Trip
const TripSchema: Schema<ITrip> = new Schema(
  {
    title: { type: String, required: true },
    startDate: { type: Date, required: true }, 
    endDate: { type: Date, required: true },
    numTravelers: { type: Number, required: true }, 
    budget: { type: Number, required: true }, 
    currentCost: { type: Number, required: true }, 
    country: { type: String, required: true }, 
    city: { type: String, required: true }, 
    destinations: [{ type: Schema.Types.ObjectId, ref: "Destination" }], 
    address: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'], 
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
  },
);

// Add a geospatial index for location-based queries
TripSchema.index({ location: '2dsphere' });

// define the model using the interface and schema
const TripModel: Model<ITrip> = mongoose.model<ITrip>("Trip", TripSchema);

export default TripModel;