import { Router, Request, Response } from 'express';
import { healthCheck, featureFlags, autoRecovery } from '../middleware/resilience';
import { circuitBreakers } from '../utils/circuitBreaker';
import os from 'os';

const router = Router();

// Helper function to get system resource information
async function getSystemResources(): Promise<{
  memory: { used_percent: number; total: number; used: number; free: number };
  disk: { free_percent: number; total: number; used: number; free: number };
  cpu: { usage_percent: number; load_average: number[] };
  uptime: number;
}> {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memUsedPercent = (usedMem / totalMem) * 100;

  // Get disk usage (simplified - in production you'd want to check specific mount points)
  let diskInfo = { total: 0, used: 0, free: 0, free_percent: 100 };
  try {
    const fs = await import('fs');
    const stats = await fs.promises.statfs ? await fs.promises.statfs('.') : null;
    if (stats) {
      diskInfo.total = stats.bavail * stats.bsize;
      diskInfo.free = stats.bavail * stats.bsize;
      diskInfo.used = (stats.blocks - stats.bavail) * stats.bsize;
      diskInfo.free_percent = (diskInfo.free / diskInfo.total) * 100;
    }
  } catch (error) {
    // Fallback for systems that don't support statfs
    diskInfo = { total: 1000000000000, used: 500000000000, free: 500000000000, free_percent: 50 };
  }

  const cpuUsage = os.loadavg()[0];
  const cpuCount = os.cpus().length;
  const cpuUsagePercent = (cpuUsage / cpuCount) * 100;

  return {
    memory: {
      used_percent: Math.round(memUsedPercent * 100) / 100,
      total: totalMem,
      used: usedMem,
      free: freeMem
    },
    disk: {
      free_percent: Math.round(diskInfo.free_percent * 100) / 100,
      total: diskInfo.total,
      used: diskInfo.used,
      free: diskInfo.free
    },
    cpu: {
      usage_percent: Math.round(cpuUsagePercent * 100) / 100,
      load_average: os.loadavg()
    },
    uptime: os.uptime()
  };
}

// Enhanced comprehensive health check endpoint
router.get('/', async (req: Request, res: Response) => {
  try {
    const healthReport = await healthCheck.checkAll();
    const featureStatuses = featureFlags.getAllStatuses();
    const circuitBreakerStatuses = {
      stripe: circuitBreakers.stripe.getState(),
      nowpayments: circuitBreakers.nowpayments.getState(),
      alchemy: circuitBreakers.alchemy.getState(),
      database: circuitBreakers.database.getState(),
      email: circuitBreakers.email.getState(),
      sms: circuitBreakers.sms.getState(),
    };

    // Get system resources
    const systemResources = await getSystemResources();

    // Determine overall system health including resource checks
    let overallHealthy = healthReport.healthy;
    let resourceWarnings: string[] = [];

    if (systemResources.memory.used_percent > 90) {
      overallHealthy = false;
      resourceWarnings.push('High memory usage');
    }

    if (systemResources.disk.free_percent < 10) {
      overallHealthy = false;
      resourceWarnings.push('Low disk space');
    }

    if (systemResources.cpu.usage_percent > 95) {
      overallHealthy = false;
      resourceWarnings.push('High CPU usage');
    }

    const status = overallHealthy ? 200 : 503;

    res.status(status).json({
      status: overallHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: healthReport.services.database ? {
          status: 'healthy',
          message: 'Database connection successful'
        } : {
          status: 'unhealthy',
          error: 'Database connection failed'
        },
        services: healthReport.services,
        memory: {
          status: systemResources.memory.used_percent > 90 ? 'warning' : 'healthy',
          used_percent: systemResources.memory.used_percent,
          ...(systemResources.memory.used_percent > 90 && { message: 'High memory usage' })
        },
        disk_space: {
          status: systemResources.disk.free_percent < 10 ? 'warning' : 'healthy',
          free_percent: systemResources.disk.free_percent,
          ...(systemResources.disk.free_percent < 10 && { message: 'Low disk space' })
        },
        cpu: {
          status: systemResources.cpu.usage_percent > 95 ? 'warning' : 'healthy',
          usage_percent: systemResources.cpu.usage_percent,
          load_average: systemResources.cpu.load_average
        }
      },
      system: {
        uptime: systemResources.uptime,
        platform: os.platform(),
        arch: os.arch(),
        node_version: process.version,
        memory: systemResources.memory,
        disk: systemResources.disk,
        cpu: systemResources.cpu
      },
      services: healthReport.services,
      features: featureStatuses,
      circuitBreakers: circuitBreakerStatuses,
      criticalFailure: healthReport.criticalFailure,
      warnings: resourceWarnings,
      success: overallHealthy,
      message: overallHealthy 
        ? 'All systems operational' 
        : `System issues detected: ${resourceWarnings.join(', ')}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'error',
      error: 'Health check failed',
      timestamp: new Date().toISOString(),
    });
  }
});

// Check specific service
router.get('/service/:serviceName', async (req: Request, res: Response) => {
  const { serviceName } = req.params;
  
  try {
    const isHealthy = await healthCheck.checkService(serviceName);
    const serviceStatus = healthCheck.getStatus(serviceName);

    res.json({
      success: true,
      service: serviceName,
      healthy: isHealthy,
      status: serviceStatus?.status || 'unknown',
      lastCheck: serviceStatus?.lastCheck || 0,
      critical: serviceStatus?.critical || false,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to check service health',
    });
  }
});

// Trigger recovery for a service
router.post('/recover/:serviceName', async (req: Request, res: Response) => {
  const { serviceName } = req.params;

  try {
    const recovered = await autoRecovery.attemptRecovery(serviceName);

    res.json({
      success: recovered,
      service: serviceName,
      message: recovered 
        ? 'Service recovered successfully' 
        : 'Recovery failed, service still unhealthy',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Recovery attempt failed',
    });
  }
});

// Reset circuit breaker
router.post('/circuit-breaker/:service/reset', (req: Request, res: Response) => {
  const { service } = req.params;

  const breaker = (circuitBreakers as any)[service];
  if (!breaker) {
    res.status(404).json({
      success: false,
      error: 'Circuit breaker not found',
    });
    return;
  }

  breaker.reset();

  res.json({
    success: true,
    message: `Circuit breaker for ${service} has been reset`,
    state: breaker.getState(),
  });
});

// Enable/disable feature
router.post('/feature/:featureName/:action', (req: Request, res: Response) => {
  const { featureName, action } = req.params;

  if (action === 'enable') {
    featureFlags.enable(featureName);
  } else if (action === 'disable') {
    featureFlags.disable(featureName, 'Manual disable via API');
  } else {
    res.status(400).json({
      success: false,
      error: 'Invalid action. Use "enable" or "disable"',
    });
    return;
  }

  res.json({
    success: true,
    feature: featureName,
    enabled: featureFlags.isEnabled(featureName),
  });
});

// Get system resilience status
router.get('/resilience', (req: Request, res: Response) => {
  const featureStatuses = featureFlags.getAllStatuses();
  const serviceStatuses = healthCheck.getAllStatuses();
  const circuitBreakerStatuses = {
    stripe: circuitBreakers.stripe.getState(),
    nowpayments: circuitBreakers.nowpayments.getState(),
    alchemy: circuitBreakers.alchemy.getState(),
    database: circuitBreakers.database.getState(),
    email: circuitBreakers.email.getState(),
    sms: circuitBreakers.sms.getState(),
  };

  const degradedFeatures = Object.entries(featureStatuses)
    .filter(([_, status]) => !status.enabled || status.fallback)
    .map(([name]) => name);

  const unhealthyServices = Object.entries(serviceStatuses)
    .filter(([_, status]) => status.status !== 'healthy')
    .map(([name]) => name);

  const openCircuits = Object.entries(circuitBreakerStatuses)
    .filter(([_, state]) => state === 'OPEN')
    .map(([name]) => name);

  res.json({
    success: true,
    resilience: {
      features: featureStatuses,
      services: serviceStatuses,
      circuitBreakers: circuitBreakerStatuses,
    },
    summary: {
      degradedFeatures,
      unhealthyServices,
      openCircuits,
      systemStatus: degradedFeatures.length === 0 && unhealthyServices.length === 0 
        ? 'fully_operational' 
        : 'degraded',
    },
    timestamp: new Date().toISOString(),
  });
});

// Kubernetes-style readiness check
// Returns 200 when service is ready to accept traffic
router.get('/ready', async (req: Request, res: Response) => {
  try {
    let ready = true;
    const checks: Record<string, boolean> = {};

    // Check critical services required for the application to function
    // Database check
    try {
      const dbHealthy = await healthCheck.checkService('database');
      checks.database = dbHealthy;
      if (!dbHealthy) ready = false;
    } catch (error) {
      checks.database = false;
      ready = false;
    }

    // Check if any circuit breakers are open for critical services
    const criticalCircuitBreakers = ['database'];
    for (const service of criticalCircuitBreakers) {
      const breaker = (circuitBreakers as any)[service];
      if (breaker && breaker.getState() === 'OPEN') {
        checks[`${service}_circuit`] = false;
        ready = false;
      } else {
        checks[`${service}_circuit`] = true;
      }
    }

    // Check system resources for readiness
    const systemResources = await getSystemResources();
    
    // Memory check - fail if over 95% memory usage
    if (systemResources.memory.used_percent > 95) {
      checks.memory = false;
      ready = false;
    } else {
      checks.memory = true;
    }

    // Disk space check - fail if less than 5% free space
    if (systemResources.disk.free_percent < 5) {
      checks.disk = false;
      ready = false;
    } else {
      checks.disk = true;
    }

    const response = {
      ready,
      checks,
      timestamp: new Date().toISOString()
    };

    res.status(ready ? 200 : 503).json(response);
  } catch (error) {
    res.status(503).json({
      ready: false,
      error: 'Readiness check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Kubernetes-style liveness check
// Returns 200 if the application is running and responding
router.get('/live', async (req: Request, res: Response) => {
  try {
    // Basic liveness check - just verify the application is responsive
    const alive = true;
    const uptime = process.uptime();
    
    // Optional: Add basic memory leak detection
    const memUsage = process.memoryUsage();
    const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    
    // Fail liveness if heap usage is extremely high (>2GB) indicating potential memory leak
    const memoryIssue = memUsageMB > 2048;
    
    res.status(alive && !memoryIssue ? 200 : 503).json({
      alive: alive && !memoryIssue,
      timestamp: new Date().toISOString(),
      uptime: Math.round(uptime),
      memory: {
        heap_used_mb: memUsageMB,
        heap_total_mb: Math.round(memUsage.heapTotal / 1024 / 1024),
        external_mb: Math.round(memUsage.external / 1024 / 1024)
      },
      pid: process.pid,
      ...(memoryIssue && { warning: 'High memory usage detected' })
    });
  } catch (error) {
    // If we can't even respond to liveness, something is seriously wrong
    res.status(503).json({
      alive: false,
      error: 'Liveness check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Startup probe endpoint (for applications with long initialization)
router.get('/startup', async (req: Request, res: Response) => {
  try {
    // Check if the application has fully started
    const startupComplete = process.uptime() > 10; // App considered started after 10 seconds
    
    // Check critical initialization requirements
    let ready = startupComplete;
    const checks: Record<string, boolean> = {};

    // Verify database connection can be established
    try {
      const dbReady = await healthCheck.checkService('database');
      checks.database_connection = dbReady;
      if (!dbReady) ready = false;
    } catch (error) {
      checks.database_connection = false;
      ready = false;
    }

    // Check if environment variables are properly loaded
    const envVarsPresent = !!(process.env.NODE_ENV);
    checks.environment_config = envVarsPresent;
    if (!envVarsPresent) ready = false;

    res.status(ready ? 200 : 503).json({
      started: ready,
      uptime: Math.round(process.uptime()),
      checks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      started: false,
      error: 'Startup check failed',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
