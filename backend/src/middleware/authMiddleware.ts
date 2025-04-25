import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';
import { Types } from 'mongoose';

const secretKey = 'prav-is-cool'; // Should match the key in userController.ts

interface DecodedToken {
  email: string;
  exp: number;
  iat: number;
}

interface IUser {
  _id: Types.ObjectId;
  email: string;
  username: string;
}

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 * Sets req.user with user data if token is valid
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without authentication
      console.log('No auth token provided');
      next();
      return;
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, secretKey) as DecodedToken;
    
    // Get user from database
    const user = await UserModel.findOne({ email: decoded.email }) as IUser | null;
    
    if (!user) {
      console.log('User not found for token');
      next();
      return;
    }
    
    // Set user data on request object
    req.user = {
      id: user._id.toString()
    };
    
    // Add additional user info to req object for potential future use
    (req as any).userEmail = user.email;
    
    console.log(`User authenticated: ${user.email} (${user._id})`);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    // Continue without authentication on error
    next();
  }
}; 