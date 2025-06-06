import mongoose, { Document, Model, Schema } from 'mongoose';

// define the interface for the Trip schema
interface ITrip extends Document {
  title: string;
  startDate: Date;
  endDate: Date;
  numTravelers: number;
  budget_num: number;
  budget: string;
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
const TripSchema: Schema<ITrip> = new Schema({
  title: {
    type: String,
    required: false,
    default: 'Untitled Trip',
    unique: false,
  },
  startDate: { type: Date, required: false, unique: false },
  endDate: { type: Date, required: false, unique: false },
  numTravelers: { type: Number, required: false, unique: false },
  budget_num: { type: Number, required: false, unique: false },
  budget: { type: String, required: false, unique: false },
  currentCost: { type: Number, required: false, unique: false },
  country: { type: String, required: false, unique: false },
  city: { type: String, required: false, unique: false },
  destinations: [{ type: Schema.Types.ObjectId, ref: 'Destination', default: [] }], // default is empty array not null
  address: { type: String, required: false, unique: false },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  },
});

// Trip parameters (for request/response)
export interface TripParameters {
  location?: string;
  tripType?: string;
  startDate: string | null;
  endDate: string | null;
  budget: string;
  travelers: number;
}

// Add a geospatial index for location-based queries
TripSchema.index({ location: '2dsphere' });

// define the model using the interface and schema
const TripModel: Model<ITrip> = mongoose.model<ITrip>('Trip', TripSchema);

export default TripModel;
export type { ITrip };
