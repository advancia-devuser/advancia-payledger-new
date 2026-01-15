# Quick Start Guide - Customer Registration Journey

This guide will help you quickly set up and test the complete customer registration journey.

## 🚀 Quick Setup (5 Minutes)

### 1. Backend Setup

```bash
cd backend-clean

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and set required variables (see below)

# Run database migrations
npm run prisma:migrate

# Seed test data
npx ts-node prisma/seed-registration-test.ts

# Start backend server
npm run dev
```

**Minimum Required Environment Variables:**
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/advancia
JWT_SECRET=your-super-secure-jwt-secret-key-256-bits
FRONTEND_URL=http://localhost:3000
PORT=4000

# Email Service (choose one)
# Option 1: SMTP (Gmail)
EMAIL_PROVIDER=smtp
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@advancia.com

# Option 2: Resend
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_api_key

# Option 3: Postmark
EMAIL_PROVIDER=postmark
POSTMARK_SERVER_TOKEN=your_token
```

### 2. Frontend Setup

```bash
cd frontend-clean

# Install dependencies
npm install

# Configure environment
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local

# Start frontend server
npm run dev
```

## 🧪 Testing the Registration Journey

### Test User Accounts (Password: `TestPass123!`)

| Email | Status | Email Verified | Use Case |
|-------|--------|----------------|----------|
| `active@test.com` | ACTIVE | ✅ | Test successful login |
| `pending@test.com` | PENDING_APPROVAL | ✅ | Test pending approval |
| `unverified@test.com` | PENDING_APPROVAL | ❌ | Test email verification |
| `oldpending@test.com` | PENDING_APPROVAL | ✅ | Test auto-approval |
| `rejected@test.com` | REJECTED | ✅ | Test rejected account |
| `admin@test.com` | ACTIVE (ADMIN) | ✅ | Test admin panel |

### Complete Registration Flow Test

#### Step 1: New User Registration
1. Navigate to `http://localhost:3000/auth/register`
2. Fill in the registration form:
   - First Name: John
   - Last Name: Doe
   - Email: john.doe@example.com
   - Phone: +1 (555) 123-4567
   - Password: SecurePass123!
   - Confirm Password: SecurePass123!
   - Accept Terms ✓
3. Click "Create Account"
4. You should be redirected to `/auth/registration-success`

#### Step 2: Email Verification
1. Check your email for the welcome message
2. Click the "Verify Email Address" button
3. You should be redirected to `/auth/verify-email?token=xxx`
4. Email should be verified successfully

**Manual Verification (for testing):**
```bash
# Get verification token from database
curl http://localhost:4000/api/auth/verify-email/YOUR_TOKEN
```

#### Step 3: Wait for Approval
- User status: `PENDING_APPROVAL`
- Admin receives notification email
- Auto-approval after 24 hours if no admin action

#### Step 4: Admin Approval (Manual)
1. Login as admin: `admin@test.com` / `TestPass123!`
2. Navigate to admin panel
3. Approve or reject the user

**API Test:**
```bash
# Login as admin
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"TestPass123!"}'

# Approve user
curl -X POST http://localhost:4000/api/admin/users/USER_ID/approve \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

#### Step 5: Login
1. Navigate to `http://localhost:3000/auth/login`
2. Login with: `john.doe@example.com` / `SecurePass123!`
3. Should redirect to `/onboarding` (first login)

#### Step 6: Complete Onboarding
1. Go through the 4-step onboarding process
2. Complete profile, wallet setup, security
3. Redirect to `/dashboard`

## 🔧 Testing Specific Features

### Test Email Verification

```bash
# Resend verification email
curl -X POST http://localhost:4000/api/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{"email":"unverified@test.com"}'

# Verify with token
curl http://localhost:4000/api/auth/verify-email/test-verification-token-123
```

### Test Auto-Approval Cron Job

```bash
# Manually trigger auto-approval (for testing)
# Add this endpoint to your backend for testing:
curl -X POST http://localhost:4000/api/admin/cron/trigger/auto-approval \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Test Login Scenarios

**Scenario 1: Successful Login**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"active@test.com","password":"TestPass123!"}'
```

**Scenario 2: Email Not Verified**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"unverified@test.com","password":"TestPass123!"}'
# Expected: 403 - "Email not verified"
```

**Scenario 3: Account Pending Approval**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"pending@test.com","password":"TestPass123!"}'
# Expected: 403 - "Account not active"
```

## 📧 Email Service Setup

### Option 1: Gmail SMTP (Easiest for Testing)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password
3. Update `.env`:
```env
EMAIL_PROVIDER=smtp
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
EMAIL_FROM=noreply@advancia.com
```

### Option 2: Resend (Recommended for Production)

1. Sign up at https://resend.com
2. Get your API key
3. Update `.env`:
```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=noreply@yourdomain.com
```

### Option 3: Postmark

1. Sign up at https://postmarkapp.com
2. Get your server token
3. Update `.env`:
```env
EMAIL_PROVIDER=postmark
POSTMARK_SERVER_TOKEN=your_token
EMAIL_FROM=noreply@yourdomain.com
```

## 🎯 Key Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/resend-verification` - Resend verification email
- `GET /api/auth/me` - Get current user

### Admin (Requires ADMIN role)
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get user details
- `POST /api/admin/users/:id/approve` - Approve user
- `POST /api/admin/users/:id/reject` - Reject user
- `GET /api/admin/users/stats/overview` - User statistics

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Reset database (WARNING: Deletes all data)
npm run prisma:reset

# Re-run migrations
npm run prisma:migrate
```

### Email Not Sending
```bash
# Check email service logs in backend console
# Look for [EMAIL] or [REGISTRATION] logs

# Test email service directly
node -e "require('./src/services/emailService').emailService.sendEmail({
  to: 'test@example.com',
  subject: 'Test',
  html: '<p>Test email</p>'
})"
```

### Port Already in Use
```bash
# Backend (port 4000)
lsof -ti:4000 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

### Cron Jobs Not Running
```bash
# Check if cron service started
# Look for "[CRON] Starting cron services..." in backend logs

# Manually trigger cron job (add this route for testing)
curl -X POST http://localhost:4000/api/admin/cron/trigger/auto-approval
```

## 📊 Monitoring Registration Journey

### Check User Status
```bash
# Using Prisma Studio
npm run prisma:studio
# Navigate to http://localhost:5555

# Using SQL
psql -U postgres -d advancia -c "SELECT email, status, \"emailVerified\", \"registeredAt\" FROM \"User\" ORDER BY \"registeredAt\" DESC LIMIT 10;"
```

### Check Email Logs
```bash
psql -U postgres -d advancia -c "SELECT * FROM \"EmailLog\" ORDER BY \"sentAt\" DESC LIMIT 10;"
```

### Check Admin Actions
```bash
psql -U postgres -d advancia -c "SELECT * FROM \"AdminAction\" ORDER BY \"createdAt\" DESC LIMIT 10;"
```

## 🎨 Frontend Routes

- `/auth/register` - Registration form
- `/auth/registration-success` - Post-registration page
- `/auth/verify-email` - Email verification handler
- `/auth/login` - Login page
- `/onboarding` - Multi-step onboarding
- `/dashboard` - Main dashboard (requires auth)

## 🔐 Security Notes

- All passwords are hashed with bcrypt (10 rounds)
- JWT tokens expire after 24 hours (access) / 7 days (refresh)
- Email verification tokens are single-use
- Admin actions are logged in `AdminAction` table
- Rate limiting applied to auth endpoints

## 📝 Next Steps

1. **Customize Email Templates** - Edit `src/services/emailService.ts`
2. **Add KYC Flow** - Implement document upload and verification
3. **Enhance Onboarding** - Add more steps or customize existing ones
4. **Admin Dashboard** - Build full admin UI for user management
5. **Analytics** - Track registration funnel and conversion rates

## 🆘 Need Help?

- **Documentation**: See `CUSTOMER_REGISTRATION_JOURNEY.md`
- **API Docs**: Coming soon
- **Support**: support@advancia.com

---

**Last Updated**: January 15, 2026  
**Version**: 2.0.0  
**Status**: ✅ Production Ready
