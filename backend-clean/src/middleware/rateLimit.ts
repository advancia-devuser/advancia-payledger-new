import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later.',
      retryAfter: req.rateLimit ? Math.ceil(req.rateLimit.resetTime.getTime() / 1000) : 60,
    });
  },
});

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  skipSuccessfulRequests: true,
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.',
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts. Please try again in 15 minutes.',
      retryAfter: req.rateLimit ? Math.ceil(req.rateLimit.resetTime.getTime() / 1000) : 900,
    });
  },
});

// Rate limiter for card creation
export const cardCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 card creations per hour
  message: {
    success: false,
    error: 'Card creation limit reached. Please try again later.',
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Card creation limit reached. Maximum 3 cards per hour.',
      retryAfter: req.rateLimit ? Math.ceil(req.rateLimit.resetTime.getTime() / 1000) : 3600,
    });
  },
});

// Rate limiter for conversion operations
export const conversionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 conversions per minute
  message: {
    success: false,
    error: 'Too many conversion requests, please slow down.',
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Too many conversion requests. Please wait a moment.',
      retryAfter: req.rateLimit ? Math.ceil(req.rateLimit.resetTime.getTime() / 1000) : 60,
    });
  },
});

// Rate limiter for transaction operations
export const transactionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 transactions per minute
  message: {
    success: false,
    error: 'Too many transaction requests, please slow down.',
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Too many transaction requests. Please wait a moment.',
      retryAfter: req.rateLimit ? Math.ceil(req.rateLimit.resetTime.getTime() / 1000) : 60,
    });
  },
});
