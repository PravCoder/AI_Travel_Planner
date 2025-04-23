import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Proxy for Google Maps Embed API
 * This endpoint receives map embed requests from the frontend and proxies them to Google
 */
export const getMapEmbed = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get parameters from request query
    const { q, zoom, center, maptype } = req.query;
    
    if (!q && !center) {
      res.status(400).json({ error: 'Either q (search query) or center parameter is required' });
      return;
    }
    
    // Construct the URL for the appropriate Google Maps Embed API mode
    let mode = 'place';
    let baseUrl = 'https://www.google.com/maps/embed/v1/';
    
    // Determine the mode based on parameters
    if (q && (q as string).includes('|')) {
      mode = 'search'; // Multiple locations with | separator uses search mode
    } else if (center && !q) {
      mode = 'view'; // Center parameter but no query uses view mode
    }
    
    const apiUrl = `${baseUrl}${mode}?key=${GOOGLE_MAPS_API_KEY}`;
    
    // Add query parameters
    const params: Record<string, string> = {};
    if (q) params.q = q as string;
    if (zoom) params.zoom = zoom as string;
    if (center && mode === 'view') params.center = center as string;
    if (maptype) params.maptype = maptype as string;
    
    // Construct URL with query parameters
    const paramsString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    const fullUrl = `${apiUrl}&${paramsString}`;
    
    // Return the full embed URL for the frontend to use
    res.json({ 
      mapUrl: fullUrl,
      mode
    });
    
  } catch (error: any) {
    console.error('Error proxying Maps Embed API:', error);
    res.status(500).json({ 
      error: 'Failed to process map request',
      details: error.message
    });
  }
};

/**
 * Geocode a location string to coordinates
 */
export const geocodeLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { address } = req.query;
    
    if (!address) {
      res.status(400).json({ error: 'Address parameter is required' });
      return;
    }
    
    // Call the Google Maps Geocoding API
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address: address,
          key: GOOGLE_MAPS_API_KEY
        }
      }
    );
    
    // Extract and return the results
    const { results, status } = response.data;
    
    if (status !== 'OK') {
      res.status(400).json({ 
        error: 'Geocoding failed',
        status
      });
      return;
    }
    
    // Return the first result
    res.json({
      results
    });
    
  } catch (error: any) {
    console.error('Error in geocoding:', error);
    res.status(500).json({ 
      error: 'Failed to geocode location',
      details: error.message
    });
  }
}; 