# 🧪 ADVANCIA PAY LEDGER - LOCAL TESTING GUIDE

**Date:** January 14, 2026  
**Purpose:** Test frontend and backend locally before production deployment  
**Status:** In Progress

---

## 📋 TESTING CHECKLIST

### Frontend Testing
- [ ] Install dependencies
- [ ] Verify build succeeds
- [ ] Run development server
- [ ] Test key pages/components
- [ ] Verify no console errors

### Backend Testing  
- [ ] Install dependencies
- [ ] Configure environment variables
- [ ] Generate Prisma client
- [ ] Run database migrations (or use existing DB)
- [ ] Start development server
- [ ] Test health endpoint
- [ ] Verify API responses

---

## 🎯 PART 1: FRONTEND LOCAL TESTING

### Step 1: Install Dependencies (IN PROGRESS)
```bash
cd github-repo/frontend
npm install
```
**Status:** Currently running...

### Step 2: Build Test
Once npm install completes, run:
```bash
npm run build
```

**Expected Output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

**If build fails:** Check error messages and we'll fix any issues.

### Step 3: Run Development Server
```bash
npm run dev
```

**Expected Output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

### Step 4: Test in Browser
Open: `http://localhost:3000`

**Pages to Test:**
- [ ] Home/Landing page
- [ ] Registration page
- [ ] Login page
- [ ] Dashboard (if you have test credentials)
- [ ] Payment pages

**Check for:**
- ✅ No white screen errors
- ✅ Components render correctly
- ✅ No console errors (F12 → Console tab)
- ✅ Images/icons load
- ✅ Navigation works

---

## 🎯 PART 2: BACKEND LOCAL TESTING

### Prerequisites
You need either:
- **Option A:** A local PostgreSQL database
- **Option B:** Access to your DigitalOcean PostgreSQL database

**For this test, we'll use minimal configuration to just verify the code works.**

### Step 1: Install Dependencies
```bash
cd github-repo/backend
npm install
```

### Step 2: Create Minimal .env File

Create `github-repo/backend/.env` with:

```env
# Minimal configuration for local testing

# Node Environment
NODE_ENV=development
PORT=4000

# Database - Use one of these options:
# Option A: Local PostgreSQL
DATABASE_URL=postgresql://postgres:password@localhost:5432/advancia_test

# Option B: DigitalOcean PostgreSQL (if you have credentials)
# DATABASE_URL=postgresql://user:pass@host:25060/dbname?sslmode=require

# Option C: SQLite for testing (if Prisma supports it for your schema)
# DATABASE_URL=file:./dev.db

# Redis (Optional for testing)
REDIS_URL=redis://localhost:6379

# JWT Secrets (Test values - NEVER use in production)
JWT_SECRET=test_secret_for_local_development_only
JWT_REFRESH_SECRET=test_refresh_secret_for_local_only
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
SESSION_SECRET=test_session_secret

# Blockchain (Optional - can skip for basic testing)
ETH_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/demo
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/demo
BSC_RPC_URL=https://bsc-dataseed.binance.org
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
OPTIMISM_RPC_URL=https://mainnet.optimism.io
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org

# Payment APIs (Optional for testing)
STRIPE_SECRET_KEY=sk_test_
NOWPAYMENTS_API_KEY=

# Email (Optional for testing)
SENDGRID_API_KEY=
EMAIL_FROM=test@localhost

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

### Step 3: Generate Prisma Client
```bash
npm run prisma:generate
```

**Expected Output:**
```
✔ Generated Prisma Client
```

### Step 4: Database Setup (Choose One)

**Option A: Skip database (test without DB)**
Skip this step if you just want to verify the code compiles.

**Option B: Run migrations (if you have a database)**
```bash
npm run prisma:migrate
```

**Option C: Use existing database**
Update DATABASE_URL in .env to point to your DigitalOcean database.

### Step 5: Build TypeScript
```bash
npm run build
```

**Expected Output:**
```
Successfully compiled TypeScript
```

### Step 6: Start Development Server
```bash
npm run dev
```

**Expected Output:**
```
🚀 Server running on http://localhost:4000
✅ Database connected
✅ Redis connected (if configured)
```

### Step 7: Test Health Endpoint
Open new terminal:
```bash
curl http://localhost:4000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-14T16:15:00.000Z"
}
```

---

## 🔍 COMMON ISSUES & SOLUTIONS

### Frontend Issues

**Issue: "Module not found"**
```bash
# Solution: Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: "Port 3000 already in use"**
```bash
# Solution: Use different port
npm run dev -- -p 3001
```

**Issue: Build fails with TypeScript errors**
```bash
# Solution: Check for type errors
npm run type-check
```

### Backend Issues

**Issue: "Cannot find module '@prisma/client'"**
```bash
# Solution: Generate Prisma client
npm run prisma:generate
```

**Issue: "Database connection failed"**
```bash
# Solution: Check DATABASE_URL
# Make sure database is running
# For PostgreSQL: check if service is running
```

**Issue: "Port 4000 already in use"**
```env
# Solution: Change PORT in .env
PORT=4001
```

**Issue: "Cannot connect to Redis"**
```bash
# Solution: Redis is optional for testing
# Comment out Redis-related code or install Redis locally
```

---

## ✅ SUCCESS CRITERIA

### Frontend Success:
- ✅ npm install completes without errors
- ✅ `npm run build` succeeds
- ✅ Dev server starts on http://localhost:3000
- ✅ Pages load in browser
- ✅ No critical console errors

### Backend Success:
- ✅ npm install completes without errors
- ✅ Prisma client generates
- ✅ TypeScript compiles (`npm run build`)
- ✅ Dev server starts on http://localhost:4000
- ✅ Health endpoint responds with 200 OK
- ✅ No critical startup errors

---

## 🚀 NEXT STEPS AFTER SUCCESSFUL LOCAL TESTING

### If Everything Works Locally:

1. **Frontend Deployment:**
   - Push code to GitHub
   - Vercel will auto-deploy
   - Verify deployment succeeds

2. **Backend Deployment:**
   - Run `bash github-repo/deploy-backend-docker.sh`
   - SSH to droplet and configure .env
   - Restart Docker containers
   - Test health endpoint

3. **Integration Testing:**
   - Configure frontend to use backend API
   - Test full user flows
   - Verify payments work
   - Test blockchain transactions

---

## 📊 CURRENT TEST STATUS

**Frontend:**
- Status: Installing dependencies...
- Command: `npm install`
- Next: Build test

**Backend:**
- Status: Waiting for frontend test
- Next: Install dependencies

---

## 💡 TESTING TIPS

1. **Test frontend first** - it's simpler and has no external dependencies
2. **Backend can be tested without database** for compilation/syntax checks
3. **Use test/demo values** for API keys during local testing
4. **Don't commit .env files** - they contain secrets
5. **Check browser console** (F12) for errors
6. **Use Postman/curl** to test backend API endpoints

---

## 🆘 IF YOU GET STUCK

1. **Check the error message** - it usually tells you what's wrong
2. **Google the error** - often others have solved it
3. **Check environment variables** - most issues are config-related
4. **Verify dependencies are installed** - run npm install again
5. **Check ports** - make sure no other apps are using them

---

## 📝 TEST RESULTS LOG

### Frontend Test Results:
- npm install: [ IN PROGRESS ]
- npm build: [ PENDING ]
- npm dev: [ PENDING ]
- Browser test: [ PENDING ]

### Backend Test Results:
- npm install: [ PENDING ]
- Prisma generate: [ PENDING ]
- npm build: [ PENDING ]
- npm dev: [ PENDING ]
- Health check: [ PENDING ]

---

**Will update this document as we progress through testing...**
