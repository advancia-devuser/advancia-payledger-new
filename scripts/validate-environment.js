const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Required Node.js version
const REQUIRED_NODE_VERSION = '24.x';

// Required environment variables
const REQUIRED_ENV_VARS = {
  NODE_ENV: ['development', 'production', 'staging'],
  // Demo mode does not require a database, Redis, Sentry, or separate access/refresh secrets.
  JWT_SECRET: 'string',
  LOG_LEVEL: ['debug', 'info', 'warn', 'error'],
  PORT: 'number'
};

// Production-only environment variables
const PRODUCTION_ENV_VARS = {
  STRIPE_SECRET_KEY: 'string',
  STRIPE_WEBHOOK_SECRET: 'string',
  NOWPAYMENTS_API_KEY: 'string',
  NOWPAYMENTS_WEBHOOK_SECRET: 'string',
  SMTP_HOST: 'string',
  SMTP_PORT: 'number',
  SMTP_USER: 'string',
  SMTP_PASS: 'string'
};

// Update package.json
function updatePackageJson() {
  console.log('Updating package.json...');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  // Update Node.js version
  pkg.engines = {
    ...pkg.engines,
    node: REQUIRED_NODE_VERSION
  };

  // Add scripts for environment validation
  pkg.scripts = {
    ...pkg.scripts,
    'validate:env': 'node scripts/validate-environment.js',
    'prestart': 'npm run validate:env',
    'predev': 'npm run validate:env'
  };

  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
  console.log('✓ Updated package.json');
}

// Validate Node.js version
function validateNodeVersion() {
  console.log('Checking Node.js version...');
  
  const currentVersion = process.version;
  const majorVersion = currentVersion.split('.')[0].slice(1);
  const requiredMajor = REQUIRED_NODE_VERSION.split('.')[0];
  
  if (Number(majorVersion) < Number(requiredMajor)) {
    console.error(`❌ Node.js version ${currentVersion} is not compatible.`);
    console.error(`Please install Node.js ${REQUIRED_NODE_VERSION}`);
    process.exit(1);
  }
  
  console.log(`✓ Node.js version ${currentVersion} is compatible`);
}

// Validate environment variables
function validateEnvVars() {
  console.log('Validating environment variables...');
  
  const errors = [];
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Validate required variables
  Object.entries(REQUIRED_ENV_VARS).forEach(([key, validation]) => {
    const value = process.env[key];
    
    if (!value) {
      errors.push(`Missing required environment variable: ${key}`);
      return;
    }
    
    if (Array.isArray(validation)) {
      if (!validation.includes(value)) {
        errors.push(`Invalid value for ${key}. Must be one of: ${validation.join(', ')}`);
      }
    } else if (validation === 'number') {
      if (isNaN(Number(value))) {
        errors.push(`Invalid value for ${key}. Must be a number.`);
      }
    }
  });
  
  // Validate production-only variables
  if (isProduction) {
    Object.entries(PRODUCTION_ENV_VARS).forEach(([key, validation]) => {
      const value = process.env[key];
      
      if (!value) {
        errors.push(`Missing production environment variable: ${key}`);
        return;
      }
      
      if (validation === 'number' && isNaN(Number(value))) {
        errors.push(`Invalid value for ${key}. Must be a number.`);
      }
    });
  }
  
  if (errors.length > 0) {
    console.error('❌ Environment validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  }
  
  console.log('✓ Environment variables validated successfully');
}

// Create example .env file
function createEnvExample() {
  console.log('Creating .env.example...');
  
  const envExample = [
    '# Required Environment Variables',
    'NODE_ENV=development # (development|staging|production)',
    '# Demo mode: no database/redis required',
    'JWT_SECRET=your-jwt-secret',
    'LOG_LEVEL=info # (debug|info|warn|error)',
    'PORT=3000',
    '',
    '# Production-only Environment Variables',
    'STRIPE_SECRET_KEY=sk_test_...',
    'STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_SECRET',
    'NOWPAYMENTS_API_KEY=your-api-key',
    'NOWPAYMENTS_WEBHOOK_SECRET=your-webhook-secret',
    'SMTP_HOST=smtp.example.com',
    'SMTP_PORT=587',
    'SMTP_USER=your-smtp-user',
    'SMTP_PASS=your-smtp-password'
  ].join('\n');
  
  fs.writeFileSync(path.join(process.cwd(), '.env.example'), envExample);
  console.log('✓ Created .env.example');
}

// Generate secure secrets
function generateSecrets() {
  console.log('Generating secure secrets...');
  
  const crypto = require('crypto');
  const secrets = {
    JWT_SECRET: crypto.randomBytes(64).toString('hex')
  };
  
  console.log('\nGenerated secure secrets:');
  Object.entries(secrets).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
  });
}

// Main execution
console.log('🔍 Starting environment validation...\n');

try {
  validateNodeVersion();
  updatePackageJson();
  validateEnvVars();
  createEnvExample();
  generateSecrets();
  
  console.log('\n✅ Environment validation complete!');
  console.log('\nNext steps:');
  console.log('1. Update your .env file with the generated secrets');
  console.log('2. Start the app (demo mode does not require a database)');
} catch (error) {
  console.error('\n❌ Error during environment validation:', error);
  process.exit(1);
}
