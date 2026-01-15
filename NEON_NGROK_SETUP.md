# Neon Database & Ngrok Setup Guide

**Repository:** https://github.com/advancia-devuser/advanciapayledger-1  
**Latest Commit:** 992ab2b (Security Fixed)  
**Date:** January 15, 2026

---

## 🗄️ Neon Database Setup

### Step 1: Create Neon Account
1. Go to [https://neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project

### Step 2: Get Connection String
1. In your Neon dashboard, go to your project
2. Click on "Connection Details"
3. Copy the connection string (it looks like this):
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Step 3: Update Backend .env
1. Open `backend-clean/.env`
2. Replace the `DATABASE_URL` with your Neon connection string:
   ```env
   DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Step 4: Run Database Migrations
```bash
cd backend-clean
npm run prisma:generate
npm run prisma:migrate
```

---

## 🌐 Ngrok Setup

### Step 1: Install Ngrok
Ngrok is already being installed via npm. If it fails, download manually from [https://ngrok.com/download](https://ngrok.com/download)

### Step 2: Sign Up for Ngrok
1. Go to [https://dashboard.ngrok.com/signup](https://dashboard.ngrok.com/signup)
2. Create a free account
3. Get your authtoken from the dashboard

### Step 3: Configure Ngrok
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

### Step 4: Start Ngrok Tunnel
Open a new terminal and run:
```bash
ngrok http 3001
```

This will create a public URL for your backend (e.g., `https://abc123.ngrok-free.app`)

### Step 5: Update Environment Variables
1. Copy the ngrok URL (e.g., `https://abc123.ngrok-free.app`)
2. Update `backend-clean/.env`:
   ```env
   BACKEND_URL=https://abc123.ngrok-free.app
   ```

---

## 🚀 Complete Setup Commands

### Terminal 1: Backend Server
```bash
cd backend-clean
npm run dev
```

### Terminal 2: Frontend Server
```bash
cd frontend-clean
npm run dev
```

### Terminal 3: Ngrok Tunnel
```bash
ngrok http 3001
```

---

## 📝 Final .env Configuration

Your `backend-clean/.env` should look like this:

```env
# Environment
NODE_ENV=development
PORT=3001

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=https://YOUR-NGROK-URL.ngrok-free.app

# Neon Database
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require

# Security
JWT_SECRET=dev-jwt-secret-change-in-production-256-bits-minimum
SESSION_SECRET=dev-session-secret-change-in-production
API_KEY=dev-api-key-change-in-production

# Feature Flags
MVP_MODE=true
ENABLE_REDIS=false
```

---

## ✅ Verification Steps

1. **Check Backend**: Visit `https://YOUR-NGROK-URL.ngrok-free.app/health`
   - Should return: `{"status":"ok"}`

2. **Check Frontend**: Visit `http://localhost:3000`
   - Should load the landing page

3. **Check Database**: Run in backend directory:
   ```bash
   npm run prisma:studio
   ```
   - Should open Prisma Studio at `http://localhost:5555`

---

## 🔧 Troubleshooting

### Ngrok Issues
- **"command not found"**: Install ngrok manually from [ngrok.com/download](https://ngrok.com/download)
- **"authtoken required"**: Run `ngrok config add-authtoken YOUR_TOKEN`
- **Tunnel closed**: Restart ngrok with `ngrok http 3001`

### Neon Database Issues
- **Connection timeout**: Check if connection string is correct
- **SSL error**: Ensure `?sslmode=require` is at the end of connection string
- **Migration failed**: Run `npm run prisma:generate` first, then `npm run prisma:migrate`

### Backend Issues
- **Port already in use**: Change `PORT=3001` to another port in `.env`
- **Missing dependencies**: Run `npm install` in `backend-clean` directory

---

## 📊 Landing Page Updates

### Current Landing Pages

1. **Main Landing Page** (`/landing`)
   - Location: `frontend-clean/src/app/landing/page.tsx`
   - Features: Virtual card focus, crypto-friendly, pricing tiers
   - Style: Dark gradient theme (purple/blue)

2. **Component Landing Page** (`/`)
   - Location: `frontend-clean/src/components/landing/LandingPage.tsx`
   - Features: Enterprise features, MedBeds section, testimonials, FAQ
   - Style: Light theme with gradient accents

### Recent Updates
- ✅ Both landing pages are complete and production-ready
- ✅ Responsive design for mobile/tablet/desktop
- ✅ SEO-optimized with proper headings
- ✅ Call-to-action buttons linked to registration
- ✅ MedBed pricing and booking integration
- ✅ Security features highlighted
- ✅ FAQ section for common questions

### Next Steps for Landing Pages
- Consider A/B testing both versions
- Add analytics tracking (Google Analytics, Mixpanel)
- Implement email capture for newsletter
- Add live chat widget integration

---

## 🎯 Quick Start Checklist

- [ ] Clone repository: `git clone https://github.com/advancia-devuser/advanciapayledger-1.git`
- [ ] Create Neon account and get connection string
- [ ] Update `DATABASE_URL` in `backend-clean/.env`
- [ ] Run database migrations
- [ ] Sign up for ngrok and get authtoken
- [ ] Configure ngrok with authtoken
- [ ] Start ngrok tunnel
- [ ] Update `BACKEND_URL` with ngrok URL
- [ ] Start backend server
- [ ] Start frontend server
- [ ] Test all endpoints
- [ ] Visit landing pages

---

## 🌟 Production Deployment Notes

When deploying to production:
1. Replace ngrok with a proper domain (e.g., api.advanciapayledger.com)
2. Keep Neon database (it's production-ready)
3. Update all environment variables
4. Enable SSL/TLS certificates
5. Set up proper CORS configuration
6. Configure rate limiting
7. Enable monitoring and logging

---

## 🔗 Related Documentation

- **Complete Deployment Guide**: `DEPLOYMENT-SUMMARY.md`
- **Email Setup**: `manual-email-setup.md`
- **Security Fixes**: `SECURITY-FIXED.md`
- **Quick Start**: `START-HERE.md`
- **GitHub Repository**: https://github.com/advancia-devuser/advanciapayledger-1

---

## 📞 Support

### Documentation
- GitHub: https://github.com/advancia-devuser/advanciapayledger-1
- All guides in repository root directory

### External Resources
- Neon Docs: https://neon.tech/docs
- Ngrok Docs: https://ngrok.com/docs
- Prisma Docs: https://www.prisma.io/docs

---

**Status:** ✅ Updated for new repository  
**Security:** ✅ All vulnerabilities fixed  
**Timeline:** Ready for immediate setup
