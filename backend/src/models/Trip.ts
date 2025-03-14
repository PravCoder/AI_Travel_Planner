import mongoose, { Schema, Document, Model } from "mongoose";

// define the interface for the Trip schema 
interface ITrip extends Document {
  title: string;
  hours: Date; 
  activityType: string;
  cost: number;
  rating: number;
  cuisine: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  user: Schema.Types.ObjectId; // Reference to the User who created the trip
}

// define the schema for the Trip
const TripSchema: Schema<ITrip> = new Schema(
  {
    title: { type: String, required: true },
    hours: { type: Date, required: true }, 
    activityType: { type: String, required: true },
    cost: { type: Number, required: true }, 
    rating: { type: Number, required: true }, 
    cuisine: { type: String, required: true }, 
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
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Reference to the User model
  },
);

// Add a geospatial index for location-based queries
TripSchema.index({ location: '2dsphere' });

// define the model using the interface and schema
const TripModel: Model<ITrip> = mongoose.model<ITrip>("Trip", TripSchema);

export default TripModel;