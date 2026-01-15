"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  Circle,
  Clock,
  Code,
  AlertTriangle,
  Zap,
} from "lucide-react";

export default function DebuggingInfraImplementation() {
  const [completedItems, setCompletedItems] = useState(new Set());
  const [selectedComponent, setSelectedComponent] = useState(null);

  const components = {
    phase1: {
      title: "🔥 Phase 1: Foundation (Week 1)",
      time: "5-7 days",
      items: [
        {
          id: "structured-logging",
          title: "Structured Logging System (Winston)",
          priority: "CRITICAL",
          time: "2-3 days",
          why: "Foundation for everything else. Can't debug without proper logs.",
          dependencies: [],
          files: [
            {
              path: "src/utils/logger.ts",
              code: `import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Custom log format
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'service'] }),
  winston.format.json()
);

// Console format for dev
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return \`[\${timestamp}] \${level} [\${service}]: \${message} \${metaStr}\`;
  })
);

// Create transports
const transports: winston.transport[] = [];

// Console (dev only)
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
      level: 'debug',
    })
  );
}

// File rotation for production
if (process.env.NODE_ENV === 'production') {
  transports.push(
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
      format: customFormat,
    }),
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: customFormat,
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  defaultMeta: { service: 'advancia-pay-ledger' },
  transports,
});

// Helper methods for specific contexts
export const createContextLogger = (context: string) => {
  return {
    info: (message: string, meta?: any) => logger.info(message, { context, ...meta }),
    warn: (message: string, meta?: any) => logger.warn(message, { context, ...meta }),
    error: (message: string, meta?: any) => logger.error(message, { context, ...meta }),
    debug: (message: string, meta?: any) => logger.debug(message, { context, ...meta }),
  };
};

export default logger;`,
            },
            {
              path: "src/middleware/requestLogger.ts",
              code: `import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

// Request correlation middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Generate unique request ID
  const requestId = uuidv4();
  req.id = requestId;

  const startTime = Date.now();

  // Log request start
  logger.info('Request started', {
    requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Override res.json to log response
  const originalJson = res.json.bind(res);
  res.json = function(body) {
    const duration = Date.now() - startTime;

    logger.info('Request completed', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: \`\${duration}ms\`,
    });

    return originalJson(body);
  };

  next();
};`,
            },
          ],
          install: `npm install winston winston-daily-rotate-file
npm install --save-dev @types/winston`,
          testing: `// Test logging
import logger from './utils/logger';

logger.info('Test info message', { test: true });
logger.warn('Test warning', { code: 'WARN_001' });
logger.error('Test error', { error: new Error('Test') });`,
        },
        {
          id: "error-tracking",
          title: "Error Tracking Service (Sentry)",
          priority: "CRITICAL",
          time: "1-2 days",
          why: "Catch production errors before users report them. Essential visibility.",
          dependencies: ["structured-logging"],
          files: [
            {
              path: "src/utils/sentry.ts",
              code: `import * as Sentry from '@sentry/node';
import * as SentryTracing from '@sentry/tracing';
import { Express } from 'express';

export const initSentry = (app: Express) => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',

    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Integrations
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new SentryTracing.Integrations.Express({ app }),
      new SentryTracing.Integrations.Postgres(),
      new SentryTracing.Integrations.Prisma({ client: prisma }),
    ],

    // Filter sensitive data
    beforeSend(event) {
      // Remove sensitive data
      if (event.request) {
        delete event.request.cookies;
        if (event.request.headers) {
          delete event.request.headers.authorization;
        }
      }
      return event;
    },
  });

  // Request handler must be first
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
};

// Error handler must be last
export const sentryErrorHandler = Sentry.Handlers.errorHandler();`,
            },
          ],
          install: `npm install @sentry/node @sentry/tracing @sentry/react`,
          testing: `// Test error tracking
import { captureException } from './utils/sentry';

try {
  throw new Error('Test error');
} catch (err) {
  captureException(err, {
    tags: { feature: 'testing' },
    extra: { testData: 'test' }
  });
}`,
        },
        {
          id: "health-checks",
          title: "Health Check Endpoints",
          priority: "HIGH",
          time: "1 day",
          why: "Monitor system health, database connectivity, dependencies.",
          dependencies: ["structured-logging"],
          files: [
            {
              path: "src/routes/health.ts",
              code: `import { Router } from 'express';
import prisma from '../utils/prisma';
import redis from '../utils/redis';
import logger from '../utils/logger';

const router = Router();

// Basic health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Detailed health check
router.get('/health/detailed', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {},
  };

  try {
    // Check database
    await prisma.$queryRaw\`SELECT 1\`;
    health.services.database = { status: 'healthy' };
  } catch (error) {
    health.status = 'degraded';
    health.services.database = {
      status: 'unhealthy',
      error: error.message
    };
  }

  try {
    // Check Redis
    await redis.ping();
    health.services.redis = { status: 'healthy' };
  } catch (error) {
    health.status = 'degraded';
    health.services.redis = {
      status: 'unhealthy',
      error: error.message
    };
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

export default router;`,
            },
          ],
          install: `# No additional packages needed`,
          testing: `# Test health endpoints
curl http://localhost:3000/health
curl http://localhost:3000/health/detailed`,
        },
      ],
    },
    phase2: {
      title: "⚡ Phase 2: Monitoring & Analytics (Week 2)",
      time: "6-8 days",
      items: [
        {
          id: "apm",
          title: "APM - Application Performance Monitoring",
          priority: "HIGH",
          time: "2 days",
          why: "Identify slow queries, API bottlenecks, performance regressions.",
          dependencies: ["structured-logging", "error-tracking"],
          files: [
            {
              path: "src/middleware/performance.ts",
              code: `import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import * as Sentry from '@sentry/node';

// Performance tracking middleware
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = process.hrtime.bigint();

  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1_000_000; // Convert to ms

    // Log slow requests
    if (duration > 1000) {
      logger.warn('Slow request detected', {
        method: req.method,
        url: req.url,
        duration: \`\${duration.toFixed(2)}ms\`,
        requestId: req.id,
      });
    }
  });

  next();
};`,
            },
          ],
          install: `# Already have Sentry for APM
# Optional: New Relic or DataDog
npm install newrelic`,
          testing: `// Test performance tracking
import { trackQueryPerformance } from './middleware/performance';

const result = await trackQueryPerformance('test-query', async () => {
  await new Promise(resolve => setTimeout(resolve, 600)); // Simulate slow query
  return { data: 'test' };
});`,
        },
        {
          id: "prisma-analytics",
          title: "Database Query Analytics (Prisma)",
          priority: "HIGH",
          time: "1-2 days",
          why: "Identify N+1 queries, slow queries, optimization opportunities.",
          dependencies: ["structured-logging"],
          files: [
            {
              path: "src/utils/prisma.ts",
              code: `import { PrismaClient } from '@prisma/client';
import logger from './logger';

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn' },
  ],
});

// Query performance tracking
prisma.$on('query', (e) => {
  const duration = e.duration;

  if (duration > 500) {
    logger.warn('Slow Prisma query detected', {
      query: e.query,
      duration: \`\${duration}ms\`,
      params: e.params,
    });
  }
});

export default prisma;`,
            },
          ],
          install: `npx prisma generate`,
          testing: `// Test query analytics
import prisma from './utils/prisma';

// This will log slow queries
await prisma.user.findMany({
  include: {
    wallets: true,
    transactions: true,
  },
});`,
        },
        {
          id: "blockchain-monitoring",
          title: "Blockchain Transaction Monitoring",
          priority: "CRITICAL",
          time: "2-3 days",
          why: "Track failed transactions, gas estimation errors, RPC failures.",
          dependencies: ["structured-logging", "error-tracking"],
          files: [
            {
              path: "src/services/blockchainMonitoring.ts",
              code: `import { ethers } from 'ethers';
import logger from '../utils/logger';
import { captureException } from '../utils/sentry';

export class BlockchainMonitor {
  private providers: Map<string, ethers.providers.JsonRpcProvider>;

  constructor() {
    this.providers = new Map();
    this.initializeProviders();
  }

  private initializeProviders() {
    const networks = {
      ethereum: process.env.ETH_RPC_URL,
      polygon: process.env.POLYGON_RPC_URL,
      bsc: process.env.BSC_RPC_URL,
      arbitrum: process.env.ARBITRUM_RPC_URL,
      optimism: process.env.OPTIMISM_RPC_URL,
    };

    for (const [network, rpcUrl] of Object.entries(networks)) {
      if (rpcUrl) {
        this.providers.set(network, new ethers.providers.JsonRpcProvider(rpcUrl));
      }
    }
  }

  async trackTransaction(
    network: string,
    txHash: string,
    context: any = {}
  ) {
    const provider = this.providers.get(network);
    if (!provider) {
      logger.error('Provider not found', { network });
      return;
    }

    try {
      const receipt = await provider.getTransactionReceipt(txHash);

      if (receipt.status === 0) {
        logger.error('Transaction failed', {
          network,
          txHash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString(),
          ...context,
        });

        captureException(new Error('Blockchain transaction failed'), {
          tags: { network, type: 'transaction_failure' },
          extra: { txHash, receipt, ...context },
        });
      }

      return receipt;
    } catch (error) {
      logger.error('Failed to fetch transaction receipt', {
        network,
        txHash,
        error: error.message,
        ...context,
      });

      throw error;
    }
  }
}

export const blockchainMonitor = new BlockchainMonitor();`,
            },
          ],
          install: `# Already have ethers.js`,
          testing: `// Test blockchain monitoring
import { blockchainMonitor } from './services/blockchainMonitoring';

const txHash = '0x...';
await blockchainMonitor.trackTransaction('ethereum', txHash, {
  userId: 'test-user',
  orderId: 'test-order',
});`,
        },
      ],
    },
    phase3: {
      title: "🚀 Phase 3: Advanced Tooling (Week 3-4)",
      time: "8-10 days",
      items: [
        {
          id: "alerting",
          title: "Real-time Alerting System",
          priority: "MEDIUM",
          time: "2 days",
          why: "Get notified of critical issues immediately (via Slack, email, SMS).",
          dependencies: ["error-tracking", "health-checks"],
          files: [
            {
              path: "src/services/alerting.ts",
              code: `import axios from 'axios';
import logger from '../utils/logger';

export class AlertingService {
  private slackWebhookUrl: string;

  constructor() {
    this.slackWebhookUrl = process.env.SLACK_WEBHOOK_URL || '';
  }

  async sendSlackAlert(message: string, severity: 'info' | 'warning' | 'critical') {
    if (!this.slackWebhookUrl) {
      logger.warn('Slack webhook URL not configured');
      return;
    }

    const color = {
      info: '#36a64f',
      warning: '#ff9800',
      critical: '#f44336',
    }[severity];

    try {
      await axios.post(this.slackWebhookUrl, {
        attachments: [
          {
            color,
            title: \`\${severity.toUpperCase()}\`,
            text: message,
            ts: Math.floor(Date.now() / 1000),
          },
        ],
      });

      logger.info('Slack alert sent', { severity, message });
    } catch (error) {
      logger.error('Failed to send Slack alert', {
        error: error.message,
        severity,
        message,
      });
    }
  }
}

export const alerting = new AlertingService();`,
            },
          ],
          install: `npm install axios`,
          testing: `// Test alerting
import { alerting } from './services/alerting';

await alerting.sendSlackAlert('Test alert', 'info');`,
        },
        {
          id: "monitoring-dashboard",
          title: "Monitoring Dashboard",
          priority: "MEDIUM",
          time: "3-4 days",
          why: "Centralized view of system health, errors, performance metrics.",
          dependencies: ["health-checks", "error-tracking", "apm"],
          files: [
            {
              path: "src/routes/dashboard.ts",
              code: `import { Router } from 'express';
import prisma from '../utils/prisma';
import redis from '../utils/redis';
import logger from '../utils/logger';

const router = Router();

// Metrics endpoint
router.get('/api/metrics', async (req, res) => {
  try {
    const metrics = {
      timestamp: new Date().toISOString(),
      database: await getDatabaseMetrics(),
      redis: await getRedisMetrics(),
      application: await getApplicationMetrics(),
    };

    res.json(metrics);
  } catch (error) {
    logger.error('Failed to fetch metrics', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

async function getDatabaseMetrics() {
  const [userCount, transactionCount, walletCount] = await Promise.all([
    prisma.user.count(),
    prisma.transaction.count(),
    prisma.wallet.count(),
  ]);

  return {
    users: userCount,
    transactions: transactionCount,
    wallets: walletCount,
  };
}

export default router;`,
            },
          ],
          install: `# No additional packages needed`,
          testing: `# Access dashboard at http://localhost:3000/dashboard`,
        },
      ],
    },
  };

  const toggleComplete = (id) => {
    setCompletedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getPhaseProgress = (phase) => {
    const total = phase.items.length;
    const completed = phase.items.filter((item) =>
      completedItems.has(item.id)
    ).length;
    return Math.round((completed / total) * 100);
  };

  const getTotalProgress = () => {
    const total = Object.values(components).reduce(
      (sum, phase) => sum + phase.items.length,
      0
    );
    const completed = completedItems.size;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            🐛 Debugging Infrastructure
          </h1>
          <p className="text-slate-300 mb-4">
            Production-Ready Implementation Guide
          </p>

          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Overall Progress</span>
              <span className="text-3xl font-bold">{getTotalProgress()}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all"
                style={{ width: `${getTotalProgress()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Phases */}
        {Object.entries(components).map(([phaseKey, phase]) => {
          const progress = getPhaseProgress(phase);

          return (
            <div key={phaseKey} className="mb-8">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{phase.title}</h2>
                  <div className="flex items-center gap-4">
                    <span className="text-sm opacity-80">{phase.time}</span>
                    <span className="text-xl font-bold">{progress}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur border-x border-b border-white/10 rounded-b-lg p-6">
                {phase.items.map((item) => {
                  const isCompleted = completedItems.has(item.id);
                  const isExpanded = selectedComponent === item.id;

                  return (
                    <div key={item.id} className="mb-6 last:mb-0">
                      <div
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          isCompleted
                            ? "border-green-500 bg-green-500/10"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                        }`}
                        onClick={() =>
                          setSelectedComponent(isExpanded ? null : item.id)
                        }
                      >
                        <div className="flex items-start gap-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleComplete(item.id);
                            }}
                            className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                              isCompleted
                                ? "bg-green-500 border-green-500"
                                : "border-white/40 hover:border-white/60"
                            }`}
                          >
                            {isCompleted && <CheckCircle size={20} />}
                          </button>

                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-1">
                              {item.title}
                            </h3>
                            <p className="text-slate-300 text-sm mb-2">
                              {item.why}
                            </p>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span
                                className={`px-2 py-1 rounded ${
                                  item.priority === "CRITICAL"
                                    ? "bg-red-600"
                                    : item.priority === "HIGH"
                                    ? "bg-orange-600"
                                    : "bg-yellow-600"
                                }`}
                              >
                                {item.priority}
                              </span>
                              <span className="px-2 py-1 bg-white/10 rounded flex items-center gap-1">
                                <Clock size={12} /> {item.time}
                              </span>
                              {item.dependencies.length > 0 && (
                                <span className="px-2 py-1 bg-white/10 rounded">
                                  Depends on: {item.dependencies.join(", ")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-6 pt-6 border-t border-white/20 space-y-4">
                            {/* Install */}
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                📦 Installation
                              </h4>
                              <pre className="bg-slate-950 p-3 rounded text-xs overflow-x-auto">
                                <code className="text-green-400">
                                  {item.install}
                                </code>
                              </pre>
                            </div>

                            {/* Files */}
                            {item.files.map((file, idx) => (
                              <div key={idx}>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <Code size={16} /> {file.path}
                                </h4>
                                <pre className="bg-slate-950 p-4 rounded text-xs overflow-x-auto max-h-96">
                                  <code className="text-green-400">
                                    {file.code}
                                  </code>
                                </pre>
                              </div>
                            ))}

                            {/* Testing */}
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                ✅ Testing
                              </h4>
                              <pre className="bg-slate-950 p-3 rounded text-xs overflow-x-auto">
                                <code className="text-blue-400">
                                  {item.testing}
                                </code>
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Summary */}
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">🎯 Execution Strategy</h3>
          <ul className="space-y-2 text-sm">
            <li>
              ✅ <strong>Week 1:</strong> Logging + Sentry + Health Checks
              (foundation)
            </li>
            <li>
              ✅ <strong>Week 2:</strong> APM + Prisma Analytics + Blockchain
              Monitoring
            </li>
            <li>
              ✅ <strong>Week 3-4:</strong> Alerting + Correlation + Dashboard
            </li>
            <li className="mt-4 text-yellow-300">
              <strong>⚡ Quick Win:</strong> Start with structured logging (2-3
              days) - copy/paste the Winston code and replace all console.logs
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
