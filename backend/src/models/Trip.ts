import mongoose, { Document, Model, Schema } from 'mongoose';

// Activity within a trip
interface IActivity {
  name: string;
  description: string;
  location: string;
  category: string; // Food, Outdoor, Cultural, etc.
  price: number; // 1-5 price level
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  businessUrl?: string;
  yelpId?: string;
  tags: string[];
  dateTime?: string;
  duration?: number;
}

// Day plan within a trip
interface IDayPlan {
  date: string;
  activities: IActivity[];
  notes?: string;
}

// Trip document interface
export interface ITrip extends Document {
  userId: mongoose.Types.ObjectId;
  destination: string;
  startDate?: Date;
  endDate?: Date;
  days: IDayPlan[];
  budget: string;
  travelers: number;
  summary: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Trip parameters (for request/response)
export interface TripParameters {
  location: string;
  startDate: Date | null;
  endDate: Date | null;
  budget: string;
  travelers: number;
}

// Trip schema
const TripSchema: Schema<ITrip> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    days: [
      {
        date: { type: String, required: true },
        activities: [
          {
            name: { type: String, required: true },
            description: { type: String },
            location: { type: String },
            category: { type: String },
            price: { type: Number, min: 1, max: 5 },
            rating: { type: Number },
            reviewCount: { type: Number },
            imageUrl: { type: String },
            businessUrl: { type: String },
            yelpId: { type: String },
            tags: [{ type: String }],
            dateTime: { type: String },
            duration: { type: Number },
          },
        ],
        notes: { type: String },
      },
    ],
    budget: {
      type: String,
      enum: ['budget', 'economy', 'medium', 'premium', 'luxury'],
    },
    travelers: { type: Number, required: true },
    summary: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Trip model
const TripModel: Model<ITrip> = mongoose.model<ITrip>('Trip', TripSchema);

export default TripModel;
