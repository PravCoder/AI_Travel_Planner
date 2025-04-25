import { Request, Response, NextFunction } from 'express';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        [key: string]: any;
      };
    }
  }
}

interface RateLimitData {
  count: number;
  resetTime: number;
}

const rateLimits = new Map<string, RateLimitData>();
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MAX_REQUESTS = 50; // Maximum requests per window

// Utility function to reset rate limits (for testing purposes)
export const resetRateLimits = (): void => {
  console.log('Resetting all rate limits');
  rateLimits.clear();
};

// Utility function to get current rate limit count (for testing/debugging)
export const getRateLimitCount = (userId: string): number => {
  const userLimit = rateLimits.get(userId);
  return userLimit ? userLimit.count : 0;
};

export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // First priority: test ID for testing
  // Second priority: user ID for authenticated users
  // Last resort: IP address (less reliable)
  let userId: string;
  let idSource: string;
  
  if (req.body.testId) {
    userId = req.body.testId;
    idSource = 'testId';
  } else if (req.user?.id) {
    userId = req.user.id;
    idSource = 'userId';
  } else {
    userId = req.ip as string;
    idSource = 'ipAddress';
    
    // Log a warning when falling back to IP address
    console.warn('Rate limiting using IP address - consider implementing proper authentication');
  }
  
  const now = Date.now();

  console.log(`Rate limit check using ${idSource}: ${userId}`);

  // Clean up old rate limits
  for (const [key, data] of rateLimits.entries()) {
    if (now > data.resetTime) {
      console.log(`Removing expired rate limit for: ${key}`);
      rateLimits.delete(key);
    }
  }

  const userLimit = rateLimits.get(userId);
  
  if (!userLimit) {
    // First request in the window
    console.log(`First request for ${idSource} ${userId}, setting count to 1`);
    rateLimits.set(userId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    next();
    return;
  }

  console.log(`Current request count for ${idSource} ${userId}: ${userLimit.count}/${MAX_REQUESTS}`);

  if (userLimit.count >= MAX_REQUESTS) {
    console.log(`Rate limit exceeded for ${idSource} ${userId}: ${userLimit.count}/${MAX_REQUESTS}`);
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: `You have exceeded the maximum number of requests (${MAX_REQUESTS}) in 24 hours. Please try again later.`,
      resetTime: Math.ceil((userLimit.resetTime - now) / 1000) // Convert to seconds
    });
    return;
  }

  // Increment count
  userLimit.count++;
  console.log(`Incremented count for ${idSource} ${userId} to ${userLimit.count}/${MAX_REQUESTS}`);
  next();
}; 