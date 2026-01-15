# 🚀 Advancia Pay Ledger - Frontend Deployment Guide

## ✅ Pre-Deployment Checklist

Your frontend is **ready to deploy**! All necessary files are configured:

- ✓ **Next.js 14** application with proper build configuration
- ✓ **Environment variables** configured in `.env.production`
- ✓ **Vercel configuration** (`vercel.json`) in place
- ✓ **Vercel CLI** installed (v50.3.2)

## 📋 Current Environment Variables

Located in `github-repo/frontend/.env.production`:

```env
NEXT_PUBLIC_API_URL="https://advancia-pay-ledger.vercel.app/api"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
NEXT_PUBLIC_APP_NAME="Advancia Pay Ledger"
NEXT_PUBLIC_APP_VERSION="2.0.0"
NEXT_PUBLIC_ENVIRONMENT="production"
```

⚠️ **IMPORTANT**: Update these values before deployment:
- Replace `NEXT_PUBLIC_API_URL` with your actual backend URL
- Replace `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` with your production Stripe key

## 🚀 Deployment Steps

### Step 1: Open Terminal in VS Code

Press `` Ctrl+` `` or go to **Terminal** > **New Terminal**

### Step 2: Navigate to Frontend Directory

```powershell
cd github-repo\frontend
```

### Step 3: Deploy to Vercel

```powershell
vercel --prod
```

### Step 4: Follow Vercel CLI Prompts

**First time deploying?** Vercel will ask:

1. **"Set up and deploy?"** → Type `y` and press Enter
2. **"Which scope?"** → Select your account (use arrow keys and Enter)
3. **"Link to existing project?"** → Type `n` (unless you already created one)
4. **"What's your project's name?"** → Type `advancia-pay-ledger` or your preferred name
5. **"In which directory is your code located?"** → Press Enter (defaults to `./`)
6. **"Want to modify the settings?"** → Type `n` (settings are already configured)

**Subsequent deployments?** Just run `vercel --prod` and it will deploy!

## 📊 What Happens During Deployment

Vercel will:
1. ✓ Upload your source code
2. ✓ Install dependencies (`npm install`)
3. ✓ Build your Next.js app (`npm run build`)
4. ✓ Deploy to production
5. ✓ Provide you with a URL (e.g., `https://advancia-pay-ledger.vercel.app`)

⏱️ **Expected time**: 2-5 minutes

## 🎯 After Deployment

### 1. Test Your Deployment

Visit the Vercel URL provided and verify:
- ✓ Site loads correctly
- ✓ No console errors
- ✓ API connections work
- ✓ All pages render properly

### 2. Configure Environment Variables in Vercel Dashboard

If you need to add more environment variables:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add any additional variables
5. Redeploy if needed

### 3. Update Backend CORS

Add your Vercel domain to your backend's CORS allowed origins:

```javascript
// In your backend configuration
const allowedOrigins = [
  'https://advancia-pay-ledger.vercel.app',
  'https://yourdomain.com' // if using custom domain
];
```

### 4. Set Up Custom Domain (Optional)

In Vercel Dashboard:
1. Go to your project
2. Click **Settings** > **Domains**
3. Click **Add**
4. Enter your domain name
5. Follow DNS configuration instructions

Or via CLI:
```powershell
vercel domains add yourdomain.com
```

## 🔧 Troubleshooting

### Build Fails

```powershell
# Check for errors in the build log
# Common issues:
# - Missing environment variables
# - TypeScript errors
# - Dependency conflicts
```

### Environment Variables Not Working

1. Ensure all `NEXT_PUBLIC_*` variables are set in Vercel Dashboard
2. Redeploy after adding variables
3. Variables must start with `NEXT_PUBLIC_` to be accessible in the browser

### API Connection Issues

1. Verify backend is running
2. Check CORS configuration on backend
3. Verify `NEXT_PUBLIC_API_URL` is correct
4. Test API endpoints directly

### Deployment Rollback

```powershell
# List all deployments
vercel ls

# Promote a previous deployment to production
vercel promote <deployment-url>
```

## 📈 Monitoring & Analytics

### Vercel Dashboard

Access at: https://vercel.com/dashboard

Monitor:
- ✓ Build logs
- ✓ Runtime logs  
- ✓ Performance metrics
- ✓ Error tracking
- ✓ Analytics

### View Logs

```powershell
# View production logs
vercel logs

# Follow logs in real-time
vercel logs --follow
```

## 💰 Cost Information

**Vercel Free Tier Includes:**
- ✓ Unlimited deployments
- ✓ SSL certificates
- ✓ Global CDN
- ✓ 100GB bandwidth/month
- ✓ Serverless functions
- ✓ Preview deployments

**Upgrade to Pro ($20/month) for:**
- More bandwidth
- Team collaboration
- Advanced analytics
- Password protection
- Priority support

## 🔄 CI/CD with Git (Optional)

### Connect to GitHub

```powershell
vercel git connect
```

Then every push to your main branch auto-deploys!

### Manual Deployment Commands

```powershell
# Deploy to preview (staging)
vercel

# Deploy to production
vercel --prod

# Deploy specific branch
vercel --prod --branch main
```

## 📝 Quick Reference

| Command | Description |
|---------|-------------|
| `vercel` | Deploy to preview |
| `vercel --prod` | Deploy to production |
| `vercel ls` | List deployments |
| `vercel logs` | View logs |
| `vercel domains` | Manage domains |
| `vercel env` | Manage environment variables |
| `vercel --help` | Show all commands |

## 🎉 Success Checklist

After deployment, verify:

- [ ] Site loads at Vercel URL
- [ ] No errors in browser console
- [ ] API connections working
- [ ] Authentication flow works
- [ ] Payment integrations functional
- [ ] All pages accessible
- [ ] Mobile responsive
- [ ] Performance acceptable

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Support**: support@vercel.com

---

**Generated**: January 14, 2026
**Version**: 1.0.0
