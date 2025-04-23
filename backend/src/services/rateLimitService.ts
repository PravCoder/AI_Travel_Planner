import { Request, Response, NextFunction } from 'express';

interface RateLimitData {
  count: number;
  resetTime: number;
}

const rateLimits = new Map<string, RateLimitData>();
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MAX_REQUESTS = 10; // Maximum requests per window

export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const userId = (req.user?.id || req.ip) as string;
  const now = Date.now();

  // Clean up old rate limits
  for (const [key, data] of rateLimits.entries()) {
    if (now > data.resetTime) {
      rateLimits.delete(key);
    }
  }

  const userLimit = rateLimits.get(userId);
  
  if (!userLimit) {
    // First request in the window
    rateLimits.set(userId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    next();
    return;
  }

  if (userLimit.count >= MAX_REQUESTS) {
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: `You have exceeded the maximum number of requests (${MAX_REQUESTS}) in 24 hours. Please try again later.`,
      resetTime: Math.ceil((userLimit.resetTime - now) / 1000) // Convert to seconds
    });
    return;
  }

  // Increment count
  userLimit.count++;
  next();
}; 