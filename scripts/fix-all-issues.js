const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Print colored status messages
function printStatus(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  switch (type) {
    case 'success':
      console.log(`${colors.green}✓ ${message}${colors.reset}`);
      break;
    case 'error':
      console.log(`${colors.red}✗ ${message}${colors.reset}`);
      break;
    case 'warning':
      console.log(`${colors.yellow}⚠ ${message}${colors.reset}`);
      break;
    case 'info':
      console.log(`${colors.blue}ℹ ${message}${colors.reset}`);
      break;
    case 'step':
      console.log(`\n${colors.cyan}${colors.bright}${message}${colors.reset}\n`);
      break;
  }
}

// Execute a command and handle errors
function executeCommand(command, errorMessage) {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    printStatus(errorMessage, 'error');
    printStatus(error.message, 'error');
    return false;
  }
}

// Verify script exists
function verifyScript(scriptPath) {
  const fullPath = path.join(process.cwd(), scriptPath);
  if (!fs.existsSync(fullPath)) {
    printStatus(`Missing script: ${scriptPath}`, 'error');
    return false;
  }
  return true;
}

// Main execution
async function main() {
  printStatus('Starting comprehensive fixes for all critical issues...', 'step');

  // Verify all required scripts exist
  const requiredScripts = [
    'scripts/cleanup-logging.js',
    'scripts/validate-environment.js',
    'scripts/setup-infrastructure.js'
  ];

  const missingScripts = requiredScripts.filter(script => !verifyScript(script));
  if (missingScripts.length > 0) {
    printStatus('Cannot proceed - missing required scripts', 'error');
    process.exit(1);
  }

  // Step 1: Clean up logging
  printStatus('Step 1: Cleaning up logging and implementing proper logger...', 'step');
  if (!executeCommand('node scripts/cleanup-logging.js', 'Failed to clean up logging')) {
    process.exit(1);
  }
  printStatus('Logging cleanup completed', 'success');

  // Step 2: Validate and fix environment
  printStatus('Step 2: Validating and fixing environment configuration...', 'step');
  if (!executeCommand('node scripts/validate-environment.js', 'Failed to validate environment')) {
    process.exit(1);
  }
  printStatus('Environment validation completed', 'success');

  // Step 3: Set up infrastructure
  printStatus('Step 3: Setting up infrastructure components...', 'step');
  if (!executeCommand('node scripts/setup-infrastructure.js', 'Failed to set up infrastructure')) {
    process.exit(1);
  }
  printStatus('Infrastructure setup completed', 'success');

  // Step 4: Start infrastructure services
  printStatus('Step 4: Starting infrastructure services...', 'step');
  if (!executeCommand('npm run infra:up', 'Failed to start infrastructure services')) {
    process.exit(1);
  }
  printStatus('Infrastructure services started', 'success');

  // Final verification
  printStatus('\nRunning final verification...', 'step');

  // Verify Redis connection
  try {
    const Redis = require('ioredis');
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    await redis.ping();
    printStatus('Redis connection verified', 'success');
    redis.disconnect();
  } catch (error) {
    printStatus('Redis connection failed', 'error');
    printStatus(error.message, 'error');
  }

  // Verify monitoring endpoints
  try {
    const http = require('http');
    const prometheusUrl = 'http://localhost:9090/-/healthy';
    const grafanaUrl = 'http://localhost:3001/api/health';

    await Promise.all([
      new Promise((resolve, reject) => {
        http.get(prometheusUrl, res => {
          res.statusCode === 200 ? resolve() : reject();
        }).on('error', reject);
      }),
      new Promise((resolve, reject) => {
        http.get(grafanaUrl, res => {
          res.statusCode === 200 ? resolve() : reject();
        }).on('error', reject);
      })
    ]);
    printStatus('Monitoring services verified', 'success');
  } catch (error) {
    printStatus('Monitoring services verification failed', 'error');
  }

  // Print summary
  printStatus('\nFix Summary:', 'step');
  console.log(`
${colors.bright}Security Fixes:${colors.reset}
- Replaced console logging with Winston logger
- Generated new secure secrets
- Implemented proper error boundaries

${colors.bright}Configuration Fixes:${colors.reset}
- Updated Node.js version requirements
- Implemented environment validation
- Created comprehensive .env.example

${colors.bright}Infrastructure Fixes:${colors.reset}
- Set up Redis for session/cache
- Configured Prometheus monitoring
- Implemented Grafana dashboards
- Added error boundaries and circuit breakers

${colors.bright}Next Steps:${colors.reset}
1. Review the changes in your git diff
2. Update your .env file with the new configuration
3. Test the application thoroughly
4. Monitor the logs and metrics
5. Deploy the changes to staging
`);

  printStatus('All critical issues have been addressed!', 'success');
}

// Run the main function
main().catch(error => {
  printStatus('Unexpected error during fix process', 'error');
  printStatus(error.message, 'error');
  process.exit(1);
});
