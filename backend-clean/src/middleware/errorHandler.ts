import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { captureException, captureMessage } from '../config/sentry';

// Custom error classes
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(401, message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(409, message);
  }
}

// Logger utility
const logger = {
  error: (error: Error, meta?: any) => {
    console.error('❌ Error:', {
      message: error.message,
      stack: error.stack,
      ...meta,
    });
  },
  warn: (message: string, meta?: any) => {
    console.warn('⚠️  Warning:', message, meta);
  },
  info: (message: string, meta?: any) => {
    console.info('ℹ️  Info:', message, meta);
  },
};

// Centralized error handler middleware
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log error
  logger.error(err, {
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Send to Sentry for server errors (5xx)
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  if (statusCode >= 500) {
    captureException(err, {
      path: req.path,
      method: req.method,
      ip: req.ip,
      user: (req as any).user?.id || 'anonymous',
    });
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Handle custom app errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    
    if (prismaError.code === 'P2002') {
      res.status(409).json({
        success: false,
        error: 'Resource already exists',
        field: prismaError.meta?.target?.[0],
      });
      return;
    }
    
    if (prismaError.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: 'Resource not found',
      });
      return;
    }
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: 'Token expired',
    });
    return;
  }

  // Default error response
  const defaultStatusCode = 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  res.status(defaultStatusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

// Async handler wrapper to catch errors in async route handlers
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// 404 handler
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
  });
}

export { logger };
