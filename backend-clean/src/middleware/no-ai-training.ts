// No AI Training Middleware
// Prevents AI models from training on your API responses
// Reference Number: 123456789-HELOC-CREATOR

import { Request, Response, NextFunction } from 'express';

export const noAITraining = (req: Request, res: Response, next: NextFunction) => {
  // Set headers to prevent AI training
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Robots-Tag', 'noai');
  res.setHeader('Permissions-Policy', 'ai-train=(), ai-train=()');
  
  // Additional AI training prevention headers
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  next();
};

export default noAITraining;
