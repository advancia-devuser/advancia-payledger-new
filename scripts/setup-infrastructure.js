const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Docker Compose configuration for Redis and monitoring
const dockerComposeConfig = `
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    restart: unless-stopped

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning
    depends_on:
      - prometheus
    restart: unless-stopped

volumes:
  redis_data:
  prometheus_data:
  grafana_data:
`;

// Prometheus configuration
const prometheusConfig = `
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'nodejs'
    static_configs:
      - targets: ['host.docker.internal:3000']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']
`;

// Redis configuration for the application
const redisConfig = `
import Redis from 'ioredis';
import logger from './logger';

const redis = new Redis(process.env.REDIS_URL, {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redis.on('error', (error) => {
  logger.error('Redis connection error:', error);
});

redis.on('connect', () => {
  logger.info('Connected to Redis');
});

export default redis;
`;

// Error boundary middleware
const errorBoundaryCode = `
import { Request, Response, NextFunction } from 'express';
import logger from './logger';
import * as Sentry from '@sentry/node';

export function errorBoundary(err: any, req: Request, res: Response, next: NextFunction) {
  // Log error
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Report to Sentry if configured
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  res.status(err.status || 500).json({
    error: message,
    requestId: req.id,
  });
}

// Circuit breaker for external services
export class CircuitBreaker {
  private failures = 0;
  private lastFailure: number = 0;
  private readonly threshold = 5;
  private readonly timeout = 60000; // 1 minute

  async execute<T>(
    fn: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T> {
    if (this.isOpen()) {
      if (fallback) {
        return fallback();
      }
      throw new Error('Circuit breaker is open');
    }

    try {
      const result = await fn();
      this.reset();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private isOpen(): boolean {
    if (this.failures >= this.threshold) {
      const now = Date.now();
      if (now - this.lastFailure >= this.timeout) {
        // Try again after timeout
        this.failures = 0;
        return false;
      }
      return true;
    }
    return false;
  }

  private recordFailure() {
    this.failures++;
    this.lastFailure = Date.now();
  }

  private reset() {
    this.failures = 0;
  }
}
`;

// Update package.json with new dependencies
function updatePackageJson() {
  console.log('Updating package.json with infrastructure dependencies...');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  const newDependencies = {
    'ioredis': '^5.3.2',
    '@sentry/node': '^7.64.0',
    'prom-client': '^14.2.0',
    'express-rate-limit': '^6.9.0',
    'rate-limit-redis': '^3.0.2'
  };

  pkg.dependencies = {
    ...pkg.dependencies,
    ...newDependencies
  };

  // Add infrastructure scripts
  pkg.scripts = {
    ...pkg.scripts,
    'infra:up': 'docker-compose -f docker-compose.infra.yml up -d',
    'infra:down': 'docker-compose -f docker-compose.infra.yml down',
    'infra:logs': 'docker-compose -f docker-compose.infra.yml logs -f'
  };

  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
  console.log('✓ Updated package.json');
}

// Create necessary directories and files
function createInfrastructureFiles() {
  console.log('Creating infrastructure files...');

  // Create directories
  const dirs = [
    'monitoring',
    'monitoring/grafana',
    'monitoring/grafana/provisioning',
    'src/utils',
    'src/middleware'
  ];

  dirs.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });

  // Write configuration files
  fs.writeFileSync(
    path.join(process.cwd(), 'docker-compose.infra.yml'),
    dockerComposeConfig
  );

  fs.writeFileSync(
    path.join(process.cwd(), 'monitoring/prometheus.yml'),
    prometheusConfig
  );

  fs.writeFileSync(
    path.join(process.cwd(), 'src/utils/redis.ts'),
    redisConfig
  );

  fs.writeFileSync(
    path.join(process.cwd(), 'src/middleware/errorBoundary.ts'),
    errorBoundaryCode
  );

  console.log('✓ Created infrastructure files');
}

// Install dependencies
function installDependencies() {
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✓ Installed dependencies');
}

// Main execution
console.log('🔧 Setting up infrastructure...\n');

try {
  updatePackageJson();
  createInfrastructureFiles();
  installDependencies();

  console.log('\n✅ Infrastructure setup complete!');
  console.log('\nNext steps:');
  console.log('1. Start infrastructure services:');
  console.log('   npm run infra:up');
  console.log('2. Configure Grafana (http://localhost:3001):');
  console.log('   - Default credentials: admin/admin');
  console.log('   - Import dashboard templates');
  console.log('3. Update your .env file with:');
  console.log('   REDIS_URL=redis://localhost:6379');
  console.log('4. Implement the error boundary middleware in your Express app');
  console.log('5. Monitor the services:');
  console.log('   npm run infra:logs');
} catch (error) {
  console.error('\n❌ Error during infrastructure setup:', error);
  process.exit(1);
}
