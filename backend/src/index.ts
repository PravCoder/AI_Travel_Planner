import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
dotenv.config(); // Load environment variables

// Import routers
import tripRouter from './routes/trip_routes';
import userRouter from './routes/user_routes';
import mapsRouter from './routes/maps_routes';

// Import middleware
import { authMiddleware } from './middleware/authMiddleware';

const app = express(); // Create Express app
app.use(express.json({ strict: false }));
app.use(cors()); // Enable CORS

// Apply authentication middleware to all routes
// This will set req.user when a valid token is provided
app.use(authMiddleware);

// Mount routers
app.use('/user', userRouter);
app.use('/trip', tripRouter);
app.use('/maps', mapsRouter);

// Connect to MongoDB and make sure server is running on port 3001
mongoose
  .connect(
    'mongodb+srv://admin:djbeg123*@aitravelplannercluster.96bpw.mongodb.net/?retryWrites=true&w=majority&appName=aitravelplannercluster'
  )
  .then(() => console.log('Connected to MongoDB'))
  .catch((err: Error) => console.log('Error connecting to MongoDB:', err));

// Confirm server is running
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
