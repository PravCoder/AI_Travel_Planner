import express from 'express';
import {
  chatWithTripPlanner,
  generateTripPlan,
  updateTrip,
  createEmptyTrip, 
  testCreateCompleteTrip,
  getDaysFromTrip,
  getTripsForUser,
  getTripById
} from '../controllers/tripController';
import { rateLimitMiddleware } from '../services/rateLimitService';

const router = express.Router();

// Chat route with rate limiting
router.post('/chat', rateLimitMiddleware, chatWithTripPlanner);

// Trip generation routes, specifying type of request either post, get, etc
router.post('/generate', generateTripPlan);

router.post('/create-trip', createEmptyTrip);

router.post('/update-trip', updateTrip);

// Get user trips routes
router.get('/get-trips/:userID', getTripsForUser);
router.get('/get-trip/:tripID', getTripById);
router.get('/get-days-from-trip/:trip_id', getDaysFromTrip);


// TESTING ROUTES BELOW::
router.post('/test-create-complete-trip', testCreateCompleteTrip);

// TODO: Once authentication is implemented, add user-specific trip routes here

export default router;
