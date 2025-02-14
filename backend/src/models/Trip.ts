/*  Define the Trip class model here. */
import mongoose, { Schema, model, Document } from 'mongoose';

const tripSchema = new mongoose.Schema({
    title: { type: String, required: true },
    destinations: [{ type: Schema.Types.ObjectId, ref: 'Destination' }],
});

const Trip = mongoose.model("Trip", tripSchema);
export default Trip;