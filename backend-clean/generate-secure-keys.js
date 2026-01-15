/**
 * SECURE KEY GENERATOR FOR PRODUCTION
 * Run this script to generate all required secure keys for production deployment
 * 
 * Usage: node generate-secure-keys.js
 */

const crypto = require('crypto');

console.log('\n🔐 GENERATING SECURE KEYS FOR PRODUCTION\n');
console.log('═'.repeat(70));
console.log('\n📋 Copy these values to your .env.production file:\n');

// JWT Secret (64 characters)
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('# JWT Authentication');
console.log(`JWT_SECRET="${jwtSecret}"`);

// JWT Refresh Secret (64 characters)
const jwtRefreshSecret = crypto.randomBytes(32).toString('hex');
console.log(`JWT_REFRESH_SECRET="${jwtRefreshSecret}"`);
console.log('');

// Encryption Key (64 characters)
const encryptionKey = crypto.randomBytes(32).toString('hex');
console.log('# Encryption');
console.log(`ENCRYPTION_KEY="${encryptionKey}"`);
console.log('');

// Session Secret (64 characters)
const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log('# Session Management');
console.log(`SESSION_SECRET="${sessionSecret}"`);
console.log('');

// Database App User Password (24 characters, alphanumeric + special chars)
const dbPassword = crypto.randomBytes(24).toString('base64').replace(/[+/=]/g, 'x').substring(0, 24);
console.log('# Database Application User Password');
console.log(`DB_APP_PASSWORD="${dbPassword}"`);
console.log('');

// Webhook Secret
const webhookSecret = crypto.randomBytes(32).toString('hex');
console.log('# Webhook Verification');
console.log(`WEBHOOK_SECRET="${webhookSecret}"`);
console.log('');

// API Key (for internal services)
const apiKey = 'api_' + crypto.randomBytes(32).toString('hex');
console.log('# Internal API Key');
console.log(`INTERNAL_API_KEY="${apiKey}"`);
console.log('');

console.log('═'.repeat(70));
console.log('\n✅ Keys generated successfully!');
console.log('\n⚠️  SECURITY WARNINGS:');
console.log('   1. Save these keys in a secure password manager');
console.log('   2. NEVER commit these keys to version control');
console.log('   3. Use different keys for development, staging, and production');
console.log('   4. Rotate keys every 90 days');
console.log('   5. If a key is compromised, regenerate immediately');
console.log('\n📝 NEXT STEPS:');
console.log('   1. Copy keys to backend/.env.production');
console.log('   2. Update deployment configuration');
console.log('   3. Use DB_APP_PASSWORD to create database user (setup-database-user.sql)');
console.log('   4. Test the configuration before deploying');
console.log('\n💾 Save Output:');
console.log('   node generate-secure-keys.js > secure-keys.txt');
console.log('   chmod 600 secure-keys.txt  # Restrict file permissions');
console.log('');

// Generate a summary
const summary = {
  generatedAt: new Date().toISOString(),
  keys: {
    JWT_SECRET: jwtSecret.substring(0, 10) + '...',
    JWT_REFRESH_SECRET: jwtRefreshSecret.substring(0, 10) + '...',
    ENCRYPTION_KEY: encryptionKey.substring(0, 10) + '...',
    SESSION_SECRET: sessionSecret.substring(0, 10) + '...',
    DB_APP_PASSWORD: dbPassword.substring(0, 5) + '...',
    WEBHOOK_SECRET: webhookSecret.substring(0, 10) + '...',
    INTERNAL_API_KEY: apiKey.substring(0, 10) + '...'
  }
};

console.log('🗂️  Summary (for reference only - not secure values):');
console.log(JSON.stringify(summary, null, 2));
console.log('');
