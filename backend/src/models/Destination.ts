import mongoose, {Schema, Document, Model} from 'mongoose';

//Define interface for destinations model
interface IDestinations extends Document {
    title: string; 
    city: string;
    location: {
        type: string;
        coordinates: [number, number];
    };
    startTime: Date;
    endTime: Date; 
    transportationMode: string;
    activityType: string;
    address: string;
    cost: number;
}

//Define schema for Destinations - its like an activity
const DestinationsSchema: Schema<IDestinations> = new Schema(
    {
      title: {type: String, required: true},
      city: {type: String, required: true},
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
      startTime: {type: Date, required: true},
      endTime: {type: Date, required: true},
      transportationMode: {type: String, required: true},
      activityType: {type: String, required: true},
      address: {type: String, required: true},
      cost: {type: Number, required: true},
    }
);

//Define model 
const DestinationModel: Model<IDestinations> = mongoose.model<IDestinations>("Destination", DestinationsSchema);

export default DestinationModel;
export type { IDestinations };
