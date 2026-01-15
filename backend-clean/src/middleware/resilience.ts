import { Request, Response, NextFunction } from 'express';
import { logger } from './errorHandler';

// Graceful degradation middleware - isolates errors to prevent system-wide failures
export function isolateErrors(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Wrap the response methods to catch errors
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);

  res.json = function (body: any) {
    try {
      return originalJson(body);
    } catch (error) {
      logger.error(error as Error, { path: req.path, method: req.method });
      return originalJson({
        success: false,
        error: 'Response serialization failed',
        fallback: true,
      });
    }
  };

  res.send = function (body: any) {
    try {
      return originalSend(body);
    } catch (error) {
      logger.error(error as Error, { path: req.path, method: req.method });
      return originalSend('Response failed');
    }
  };

  next();
}

// Feature flag system for graceful degradation
export class FeatureFlags {
  private flags: Map<string, boolean> = new Map();
  private fallbackModes: Map<string, boolean> = new Map();

  constructor() {
    // Initialize core features as enabled
    this.flags.set('cards', true);
    this.flags.set('conversion', true);
    this.flags.set('notifications', true);
    this.flags.set('payments', true);
    this.flags.set('kyc', true);
    this.flags.set('analytics', true);
    this.flags.set('email', true);
    this.flags.set('sms', true);
  }

  // Check if feature is enabled
  isEnabled(feature: string): boolean {
    return this.flags.get(feature) ?? false;
  }

  // Disable feature (graceful degradation)
  disable(feature: string, reason?: string): void {
    this.flags.set(feature, false);
    logger.warn(`Feature disabled: ${feature}`, { reason });
  }

  // Enable feature
  enable(feature: string): void {
    this.flags.set(feature, true);
    logger.info(`Feature enabled: ${feature}`);
  }

  // Enable fallback mode for feature
  enableFallback(feature: string): void {
    this.fallbackModes.set(feature, true);
    logger.info(`Fallback mode enabled for: ${feature}`);
  }

  // Check if in fallback mode
  isInFallbackMode(feature: string): boolean {
    return this.fallbackModes.get(feature) ?? false;
  }

  // Get all feature statuses
  getAllStatuses(): Record<string, { enabled: boolean; fallback: boolean }> {
    const statuses: Record<string, { enabled: boolean; fallback: boolean }> = {};
    
    this.flags.forEach((enabled, feature) => {
      statuses[feature] = {
        enabled,
        fallback: this.fallbackModes.get(feature) ?? false,
      };
    });

    return statuses;
  }
}

export const featureFlags = new FeatureFlags();

// Middleware to check feature availability
export function requireFeature(featureName: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!featureFlags.isEnabled(featureName)) {
      res.status(503).json({
        success: false,
        error: `Feature "${featureName}" is temporarily unavailable`,
        fallback: featureFlags.isInFallbackMode(featureName),
        message: 'Please try again later or use alternative features',
      });
      return;
    }
    next();
  };
}

// Timeout wrapper to prevent hanging requests
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  fallback?: T
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => {
        if (fallback !== undefined) {
          return fallback;
        }
        reject(new Error(`Operation timed out after ${timeoutMs}ms`));
      }, timeoutMs)
    ),
  ]);
}

// Retry mechanism with exponential backoff
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  fallback?: () => Promise<T>
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        logger.warn(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`, {
          error: lastError.message,
        });
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed
  if (fallback) {
    logger.warn('All retries failed, using fallback');
    return await fallback();
  }

  throw lastError;
}

// Health check system
export class HealthCheck {
  private services: Map<string, ServiceHealth> = new Map();

  // Register a service for health monitoring
  register(
    serviceName: string,
    checkFn: () => Promise<boolean>,
    critical: boolean = false
  ): void {
    this.services.set(serviceName, {
      name: serviceName,
      check: checkFn,
      critical,
      status: 'unknown',
      lastCheck: 0,
    });
  }

  // Check health of all services
  async checkAll(): Promise<HealthReport> {
    const results: Record<string, boolean> = {};
    let allHealthy = true;
    let criticalFailure = false;

    for (const [name, service] of this.services) {
      try {
        const isHealthy = await withTimeout(service.check(), 5000, false);
        results[name] = isHealthy;
        service.status = isHealthy ? 'healthy' : 'unhealthy';
        service.lastCheck = Date.now();

        if (!isHealthy) {
          allHealthy = false;
          if (service.critical) {
            criticalFailure = true;
            featureFlags.disable(name, 'Health check failed');
          } else {
            featureFlags.enableFallback(name);
          }
        } else {
          featureFlags.enable(name);
        }
      } catch (error) {
        results[name] = false;
        service.status = 'error';
        allHealthy = false;
        
        if (service.critical) {
          criticalFailure = true;
          featureFlags.disable(name, 'Health check error');
        }
        
        logger.error(error as Error, { service: name });
      }
    }

    return {
      healthy: allHealthy,
      criticalFailure,
      services: results,
      timestamp: new Date().toISOString(),
    };
  }

  // Check specific service
  async checkService(serviceName: string): Promise<boolean> {
    const service = this.services.get(serviceName);
    if (!service) {
      return false;
    }

    try {
      const isHealthy = await service.check();
      service.status = isHealthy ? 'healthy' : 'unhealthy';
      service.lastCheck = Date.now();
      return isHealthy;
    } catch (error) {
      service.status = 'error';
      logger.error(error as Error, { service: serviceName });
      return false;
    }
  }

  // Get service status
  getStatus(serviceName: string): ServiceHealth | undefined {
    return this.services.get(serviceName);
  }

  // Get all statuses
  getAllStatuses(): Record<string, ServiceHealth> {
    const statuses: Record<string, ServiceHealth> = {};
    this.services.forEach((service, name) => {
      statuses[name] = service;
    });
    return statuses;
  }
}

interface ServiceHealth {
  name: string;
  check: () => Promise<boolean>;
  critical: boolean;
  status: 'healthy' | 'unhealthy' | 'error' | 'unknown';
  lastCheck: number;
}

interface HealthReport {
  healthy: boolean;
  criticalFailure: boolean;
  services: Record<string, boolean>;
  timestamp: string;
}

export const healthCheck = new HealthCheck();

// Initialize health checks for core services
healthCheck.register('database', async () => {
  // Check database connection
  try {
    // In production: await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}, true); // Critical service

healthCheck.register('stripe', async () => {
  // Check Stripe API
  try {
    // In production: await stripe.balance.retrieve();
    return true;
  } catch {
    return false;
  }
}, false); // Non-critical, can use fallback

healthCheck.register('nowpayments', async () => {
  // Check NOWPayments API
  try {
    // In production: fetch NOWPayments status endpoint
    return true;
  } catch {
    return false;
  }
}, false);

healthCheck.register('alchemy', async () => {
  // Check Alchemy API
  try {
    // In production: fetch Alchemy endpoint
    return true;
  } catch {
    return false;
  }
}, false);

// Auto-recovery system
export class AutoRecovery {
  private recoveryAttempts: Map<string, number> = new Map();
  private maxAttempts: number = 3;

  async attemptRecovery(serviceName: string): Promise<boolean> {
    const attempts = this.recoveryAttempts.get(serviceName) || 0;
    
    if (attempts >= this.maxAttempts) {
      logger.error(new Error(`Max recovery attempts reached for ${serviceName}`));
      return false;
    }

    this.recoveryAttempts.set(serviceName, attempts + 1);
    logger.info(`Attempting recovery for ${serviceName} (attempt ${attempts + 1})`);

    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, 5000 * (attempts + 1)));

    // Check if service is healthy now
    const isHealthy = await healthCheck.checkService(serviceName);
    
    if (isHealthy) {
      logger.info(`Service ${serviceName} recovered successfully`);
      this.recoveryAttempts.delete(serviceName);
      featureFlags.enable(serviceName);
      return true;
    }

    return false;
  }

  reset(serviceName: string): void {
    this.recoveryAttempts.delete(serviceName);
  }
}

export const autoRecovery = new AutoRecovery();
