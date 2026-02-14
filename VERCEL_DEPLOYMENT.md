# Deploy Advancia PayLedger to Vercel

Vercel is the native platform for Next.js and provides the simplest deployment experience.

## Quick Deploy (5 minutes)

### Step 1: Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **"Add New Project"**
3. **Import Git Repository**:
   - Select: `pdtribe181-prog/advancia-payledger`
   - If not listed, click "Adjust GitHub App Permissions" to grant access

### Step 2: Configure Project Settings

**Framework Preset**: Next.js (auto-detected)

**Root Directory**: `frontend`

**Build and Output Settings**:
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

**Environment Variables**: (Leave empty for now)

### Step 3: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Your site will be live at: `https://advancia-payledger.vercel.app`

### Step 4: Add Custom Domain

1. Go to your project → **Settings** → **Domains**
2. Add domain: `advanciapayledger.com`
3. Configure DNS (Vercel will provide instructions):

#### Option A: Use Vercel Nameservers (Recommended)
- Copy Vercel's nameservers
- Update at your domain registrar
- DNS propagation: 24-48 hours

#### Option B: Use Existing DNS (Faster)
In Cloudflare DNS, add these records:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. Wait for SSL certificate (automatic, ~1 minute)

## Automatic Deployments

Every push to `master` branch automatically deploys to production.

## Preview Deployments

Every pull request gets a unique preview URL automatically.

## Monitoring & Analytics

- **Performance**: Automatically tracked
- **Error Tracking**: Built-in monitoring
- **Usage**: Dashboard shows bandwidth, build minutes

## Security Features

✅ **Automatic HTTPS**: SSL certificates auto-renewed
✅ **DDoS Protection**: Built-in at edge network
✅ **Security Headers**: Configured in vercel.json
✅ **WAF**: Available on Pro plan ($20/month)

## Upgrade Options

**Free Tier** (Current):
- 100 GB bandwidth/month
- Unlimited deployments
- Custom domains
- Automatic HTTPS

**Pro Tier** ($20/month):
- 1 TB bandwidth
- Advanced analytics
- Password protection
- Edge config
- WAF & DDoS protection

## Troubleshooting

### Build Fails
1. Check build logs in Vercel dashboard
2. Verify `frontend/package.json` has correct scripts
3. Ensure dependencies are in `package.json`

### Domain Not Working
1. Wait 5-10 minutes for DNS propagation
2. Check DNS records are correct
3. Verify SSL certificate issued (automatic)

### Environment Variables
Add in: Project Settings → Environment Variables
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`

Redeploy after adding variables.

## Commands

### Deploy from CLI (Optional)
```bash
npm install -g vercel
cd frontend
vercel --prod
```

### Check Deployment Status
```bash
vercel ls
```

### View Logs
```bash
vercel logs <deployment-url>
```

## Next Steps After Deployment

1. ✅ Verify site works at `.vercel.app` URL
2. ✅ Add custom domain `advanciapayledger.com`
3. ✅ Test all features (landing page, dashboard, tabs)
4. 🔄 Set up backend API (when ready)
5. 🔄 Configure environment variables
6. 🔄 Enable Web Application Firewall (Pro plan)
7. 🔄 Set up monitoring/alerts

## Support

- **Documentation**: https://vercel.com/docs
- **Support**: https://vercel.com/support
- **Community**: https://github.com/vercel/vercel/discussions
