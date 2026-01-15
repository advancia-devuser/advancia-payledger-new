# Advancia Pay Ledger - Troubleshooting Guide

## Table of Contents
1. [Quick Diagnostics](#quick-diagnostics)
2. [Installation Errors](#installation-errors)
3. [Database Errors](#database-errors)
4. [Prisma Errors](#prisma-errors)
5. [Runtime Errors](#runtime-errors)
6. [TypeScript Errors](#typescript-errors)
7. [Sentry Error Tracking](#sentry-error-tracking)
8. [Step-by-Step Reset](#step-by-step-reset)

---

## Quick Diagnostics

### Run the Troubleshooting Script

**Windows (PowerShell):**
```powershell
cd backend
.\troubleshoot.ps1
```

**Linux/macOS (Bash):**
```bash
cd backend
chmod +x troubleshoot.sh
./troubleshoot.sh
```

This will check:
- ✅ Node.js version (requires >= 18.0.0)
- ✅ npm installation
- ✅ PostgreSQL availability
- ✅ Docker (optional)
- ✅ Environment configuration (.env file)
- ✅ Dependencies (node_modules)
- ✅ Prisma Client generation
- ✅ Sentry packages
- ✅ TypeScript build

---

## Installation Errors

### Error: `npm ERR! code ENOENT`
**Cause:** package.json not found or in wrong directory

**Solution:**
```bash
# Make sure you're in the backend directory
cd backend
ls package.json  # Should show package.json
npm install
```

### Error: `npm ERR! peer dependencies`
**Cause:** Version conflicts

**Solution:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Error: `node: command not found`
**Cause:** Node.js not installed

**Solution:**
- **Windows:** Download from https://nodejs.org
- **macOS:** `brew install node@18`
- **Ubuntu/Debian:** 
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

---

## Database Errors

### Error: `Can't reach database server at localhost:5432`
**Cause:** PostgreSQL not running or wrong connection string

**Solution 1 - Check PostgreSQL is running:**

**Windows:**
- Check Services app for PostgreSQL service
- Or use: `Get-Service postgresql*`

**macOS:**
```bash
brew services list
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

**Solution 2 - Use Docker PostgreSQL:**
```bash
docker run --name advancia-db \
  -e POSTGRES_USER=advancia \
  -e POSTGRES_PASSWORD=secure_password \
  -e POSTGRES_DB=advancia_payledger \
  -p 5432:5432 \
  -d postgres:14-alpine

# Update .env:
DATABASE_URL="postgresql://advancia:secure_password@localhost:5432/advancia_payledger?schema=public"
```

**Solution 3 - Test connection:**
```bash
psql -U advancia -d advancia_payledger
# If this fails, the database doesn't exist or credentials are wrong
```

### Error: `database "advancia_payledger" does not exist`
**Cause:** Database not created

**Solution:**
```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE advancia_payledger OWNER advancia;

# Or use createdb command
createdb -U advancia advancia_payledger
```

### Error: `password authentication failed for user "advancia"`
**Cause:** Wrong password in DATABASE_URL

**Solution:**
```bash
# Update password in .env
DATABASE_URL="postgresql://advancia:CORRECT_PASSWORD@localhost:5432/advancia_payledger?schema=public"

# Or reset password in PostgreSQL
psql postgres
ALTER USER advancia WITH PASSWORD 'new_password';
```

---

## Prisma Errors

### Error: `Prisma Client is not yet generated`
**Cause:** Need to generate Prisma Client

**Solution:**
```bash
npm run prisma:generate
# Or directly
npx prisma generate
```

### Error: `The table 'public.User' does not exist in the current database`
**Cause:** Migrations not run

**Solution:**
```bash
# Run migrations
npm run prisma:migrate

# Or reset and migrate (WARNING: deletes all data)
npx prisma migrate reset
npx prisma migrate dev
```

### Error: `Migration failed to apply cleanly to the shadow database`
**Cause:** Previous migration issues

**Solution:**
```bash
# Reset migrations (WARNING: deletes all data)
npx prisma migrate reset

# Or drop and recreate database
psql postgres
DROP DATABASE advancia_payledger;
CREATE DATABASE advancia_payledger OWNER advancia;
\q

# Then run migrations
npm run prisma:migrate
```

### Error: `Environment variable not found: DATABASE_URL`
**Cause:** .env file not found or DATABASE_URL not set

**Solution:**
```bash
# Make sure .env exists in backend directory
cd backend
cp .env.example .env

# Edit .env and add:
DATABASE_URL="postgresql://advancia:password@localhost:5432/advancia_payledger?schema=public"
```

---

## Runtime Errors

### Error: `Port 3001 already in use`
**Cause:** Another process using port 3001

**Solution:**

**Windows:**
```powershell
# Find process using port 3001
netstat -ano | findstr :3001
# Kill process (replace <PID> with actual process ID)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find process using port 3001
lsof -i :3001
# Kill process (replace <PID> with actual process ID)
kill -9 <PID>
```

**Or change port in .env:**
```bash
PORT=3002
```

### Error: `Cannot find module 'express'`
**Cause:** Dependencies not installed

**Solution:**
```bash
npm install
```

### Error: `JWT_SECRET is not defined`
**Cause:** Environment variable missing

**Solution:**
```bash
# Add to .env file
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"
REFRESH_TOKEN_SECRET="your-refresh-token-secret-at-least-32-chars"

# Generate secure keys:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Error: `ENCRYPTION_KEY must be 32 bytes`
**Cause:** Invalid encryption key format

**Solution:**
```bash
# Generate proper 32-byte hex key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env (should be 64 hex characters)
ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
```

### Error: `Invalid token` or `Token expired`
**Cause:** JWT token issues

**Solution:**
```bash
# Login again to get new token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@advanciapayledger.com","password":"Test123!@#"}'

# Use the new accessToken in subsequent requests
```

---

## TypeScript Errors

### Error: `Cannot find module '@prisma/client'`
**Cause:** Prisma Client not generated

**Solution:**
```bash
npm run prisma:generate
```

### Error: `Duplicate identifier` errors
**Cause:** TypeScript compilation issues

**Solution:**
```bash
# Clean and rebuild
rm -rf dist
npm run build
```

### Error: `TS2307: Cannot find module` for local imports
**Cause:** Import paths incorrect

**Solution:**
```typescript
// Make sure imports use correct relative paths
import { prisma } from '../config/database';  // Not './config/database'
```

---

## Sentry Error Tracking

### What is Sentry?

Sentry is an error tracking and performance monitoring tool that automatically captures errors and performance data from your application.

### Configuration

**1. Environment Variables (in `.env`):**
```bash
# Your Sentry DSN (Data Source Name)
SENTRY_DSN=https://f12a5919a099c9dabb6075f84f3a2011@o4510400768573440.ingest.us.sentry.io/4510686561632256

# Auth token for Sentry CLI (optional)
SENTRY_AUTH_TOKEN=your_sentry_auth_token_here

# Release version for tracking
SENTRY_RELEASE=advancia-backend@2.0.0
```

**2. What Gets Tracked:**
- ✅ Server errors (HTTP 5xx)
- ✅ Unhandled exceptions
- ✅ Promise rejections
- ✅ Database errors (Prisma)
- ✅ API performance metrics
- ✅ Request tracing

**3. What Doesn't Get Tracked:**
- ❌ Client errors (HTTP 4xx) - these are expected
- ❌ Sensitive data (passwords, tokens) - automatically filtered
- ❌ Test environment errors - disabled in test mode

### Accessing Sentry Dashboard

**1. Login to Sentry:**
- URL: https://sentry.io
- Organization: advancia-payledger
- Project: advancia-backend

**2. View Errors:**
- Issues → View all issues
- Filter by environment (development, staging, production)
- Click on any error for full stack trace and context

**3. Performance Monitoring:**
- Performance → View transactions
- See API endpoint response times
- Identify slow queries

### Testing Sentry Integration

**1. Test Error Capture:**
```bash
# Create a test endpoint that throws an error
curl http://localhost:3001/api/test-error
```

**2. Check Sentry Dashboard:**
- Go to https://sentry.io
- Navigate to your project
- You should see the error appear within seconds

**3. Manual Error Reporting (in code):**
```typescript
import { captureException, captureMessage } from './config/sentry';

// Capture an exception
try {
  // ... some code
} catch (error) {
  captureException(error, {
    userId: req.user?.id,
    endpoint: req.path,
  });
}

// Capture a message
captureMessage('Payment processing started', 'info', {
  amount: payment.amount,
  currency: payment.currency,
});
```

### Troubleshooting Sentry

**Error: Sentry not initializing**
```bash
# Check if SENTRY_DSN is set
echo $SENTRY_DSN  # Linux/macOS
echo %SENTRY_DSN%  # Windows CMD
$env:SENTRY_DSN  # Windows PowerShell

# Make sure it starts with https://
```

**Error: Events not appearing in dashboard**
1. Check your internet connection
2. Verify SENTRY_DSN is correct
3. Check Sentry status: https://status.sentry.io
4. Look for "Sentry initialized" message in console logs

**Disable Sentry (for development):**
```bash
# Remove or comment out in .env
# SENTRY_DSN=

# Or set NODE_ENV to test
NODE_ENV=test
```

---

## Step-by-Step Reset (Nuclear Option)

If nothing works, start fresh:

**Windows (PowerShell):**
```powershell
# 1. Stop all processes (Ctrl+C in terminal)

# 2. Clean everything
cd backend
Remove-Item -Recurse -Force node_modules, package-lock.json, dist -ErrorAction SilentlyContinue
npm cache clean --force

# 3. Reinstall
npm install

# 4. Reset database (WARNING: deletes all data)
npx prisma migrate reset

# 5. Generate Prisma Client
npm run prisma:generate

# 6. Run migrations
npm run prisma:migrate

# 7. Seed database
npm run prisma:seed

# 8. Start server
npm run dev
```

**Linux/macOS (Bash):**
```bash
# 1. Stop all processes (Ctrl+C)

# 2. Clean everything
cd backend
rm -rf node_modules package-lock.json dist
npm cache clean --force

# 3. Reinstall
npm install

# 4. Reset database (WARNING: deletes all data)
npx prisma migrate reset

# 5. Generate Prisma Client
npm run prisma:generate

# 6. Run migrations
npm run prisma:migrate

# 7. Seed database
npm run prisma:seed

# 8. Start server
npm run dev
```

---

## Getting More Help

### Check Logs

**Application logs:**
```bash
# View logs in development
npm run dev

# Production logs (if using PM2)
pm2 logs advancia-backend

# Docker logs
docker logs advancia-backend
```

**Error logs:**
- Check Sentry dashboard for production errors
- Review console output for stack traces
- Look for detailed error messages

### Enable Debug Mode

**In `.env`:**
```bash
LOG_LEVEL=debug
NODE_ENV=development
DEBUG=app:*
```

### Test Database Connection

**Quick connection test:**
```bash
# PostgreSQL direct connection
psql "postgresql://advancia:password@localhost:5432/advancia_payledger"

# Or with Prisma
npx prisma studio  # Opens database GUI at http://localhost:5555
```

### Verify Installation

**Run troubleshooting script:**
```bash
# Windows
.\troubleshoot.ps1

# Linux/macOS
./troubleshoot.sh
```

---

## Still Having Issues?

**Please provide:**

1. **Exact error message** (copy/paste the full error)
2. **What command you ran**
3. **Your environment:**
   ```bash
   node --version
   npm --version
   psql --version
   ```
4. **Output of troubleshooting script**
5. **Sentry error link** (if available)

**Where to get help:**
- GitHub Issues: [Your repo]/issues
- Sentry Dashboard: https://sentry.io/organizations/advancia-payledger/
- Email: support@advanciapayledger.com
