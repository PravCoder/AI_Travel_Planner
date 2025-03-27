import express from 'express';
import {
  chatWithTripPlanner,
  generateTripPlan,
} from '../controllers/tripController';

const router = express.Router();

// Chat route
router.post('/chat', chatWithTripPlanner);

// Trip generation route
router.post('/generate', generateTripPlan);

// TODO: Once authentication is implemented, add user-specific trip routes here

export default router;
