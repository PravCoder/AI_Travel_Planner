import express from 'express';
import {
  chatWithTripPlanner,
  generateTripPlan,
  updateTrip,
  createEmptyTrip, 
  testCreateCompleteTrip,
  testGetDaysFromTrip
} from '../controllers/tripController';

const router = express.Router();

// Chat route
router.post('/chat', chatWithTripPlanner);

// Trip generation route
router.post('/generate', generateTripPlan);

router.post('/create-trip', createEmptyTrip);

router.post('/update-trip', updateTrip);



// TESTING ROUTES BELOW:
router.post('/test-create-complete-trip', testCreateCompleteTrip);
router.post('/test-get-days-from-trip', testGetDaysFromTrip);



// TODO: Once authentication is implemented, add user-specific trip routes here

export default router;
