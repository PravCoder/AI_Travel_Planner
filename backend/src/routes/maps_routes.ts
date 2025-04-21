import express from 'express';
import { getMapEmbed, geocodeLocation } from '../controllers/mapsController';

const router = express.Router();

// Map embed proxy endpoint
router.get('/embed', getMapEmbed);

// Geocoding endpoint
router.get('/geocode', geocodeLocation);

export default router; 