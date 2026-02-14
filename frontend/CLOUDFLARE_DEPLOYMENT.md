# Cloudflare Pages Deployment Guide for Advancia Pay Ledger

## Prerequisites
- Cloudflare account (free tier available)
- Domain connected to Cloudflare nameservers
- GitHub repository connected to Cloudflare

## Setup Steps

### 1. Connect GitHub Repository
1. Log in to Cloudflare Dashboard
2. Go to **Pages**
3. Click **Connect to Git**
4. Select **GitHub** and authorize Cloudflare
5. Select repository: `pdtribe181-prog/advancia-payledger`
6. Select branch: `master`

### 2. Build Configuration
- **Production branch**: `master`
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Node.js Version**: `20.11.0`

### 3. Environment Variables (Production)
```
ENVIRONMENT=production
API_URL=https://api.advancia.io
NEXT_PUBLIC_API_URL=https://api.advancia.io
```

### 4. Environment Variables (Staging)
```
ENVIRONMENT=staging
API_URL=https://staging-api.advancia.io
NEXT_PUBLIC_API_URL=https://staging-api.advancia.io
```

### 5. Custom Domain Setup
1. In Cloudflare Pages, click **Custom domain**
2. Enter your domain: `advancia.io`
3. Cloudflare automatically creates DNS records
4. SSL/TLS certificate auto-provisioned

### 6. Advanced Configuration

#### Cloudflare Cache Rules
```
Path: /*
Cache level: Cache Everything
Browser cache TTL: 30 minutes
```

#### Security Headers (via Cloudflare Page Rules)
```
url: advancia.io/*

X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=()
```

#### WAF Rules
- Enable **OWASP ModSecurity Core Rule Set**
- Enable **Cloudflare Managed Ruleset**
- Block countries (if needed): DDOS-prone regions

### 7. DDoS Protection
- **Web Application Firewall (WAF)**: Enabled
- **Rate Limiting**: 100 requests/10 seconds per IP
- **Bot Management**: Verified bots allowed, suspicious blocked

### 8. Performance Settings
- **Minify HTML/CSS/JS**: Enabled
- **Brotli Compression**: Enabled
- **HTTP/3 (QUIC)**: Enabled
- **Early Hints**: Enabled
- **Image Optimization**: Enabled (with WebP)

### 9. Deployment Trigger
- Automatic deployment on git `push` to `master` branch
- Deployments take 1-3 minutes
- View logs in Cloudflare Pages dashboard

### 10. DNS Configuration (Optional)
If using custom domain:
```
advancia.io A Record -> Points to Cloudflare
www.advancia.io CNAME -> advancia.io
api.advancia.io CNAME -> your-api-server
```

## Manual Deployment (Alternative)

### Using Wrangler CLI
```bash
# Install Wrangler globally
npm install -g wrangler

# Authenticate with Cloudflare
wrangler login

# Deploy to Pages
wrangler pages deploy .next

# Deploy to specific environment
wrangler pages deploy .next --project-name=advancia-payledger --branch=staging
```

## Monitoring & Analytics

### Enable Cloudflare Analytics
1. Dashboard → Advancia project
2. **Analytics** tab shows:
   - Page views
   - Unique visitors
   - Request rate
   - Bandwidth
   - Cache ratio

### Enable Real User Monitoring (RUM)
```javascript
// Automatically enabled with Cloudflare Pages
// View in: Analytics → Real-time metrics
```

## Rollback Deployment
1. Go to **Deployments** in Cloudflare Pages
2. Click on previous deployment
3. Click **Rollback to this version**

## Environment Promotion (Staging → Production)
```bash
# Test on staging
git push origin feature-branch

# Review & approve
# Merge to main/master for production deployment
git merge --ff-only feature-branch
git push origin master
```

## Troubleshooting

### Build Fails
- Check build logs: Pages → Deployments → View logs
- Verify `npm run build` works locally
- Check Node.js version (should be 20+)

### Site Not Loading
- Check DNS propagation: https://dns.google/
- Clear browser cache (Ctrl+Shift+Delete)
- Check Cloudflare Page Rules aren't blocking

### Slow Performance
- Check Image Optimization settings
- Verify Cache Rules are set correctly
- Enable Rocket Loader (may affect functionality)

### API Calls Failing
- Verify CORS headers from backend
- Check API URL in environment variables
- Enable Cloudflare Workers for custom routing

## Support
- Cloudflare Docs: https://developers.cloudflare.com/pages/
- GitHub Issues: https://github.com/pdtribe181-prog/advancia-payledger/issues

## Next Steps
1. Update nameservers if using custom domain
2. Set up SSL/TLS certificate (Cloudflare auto-provisions)
3. Configure WAF rules for your API
4. Enable analytics and monitoring
5. Set up email forwarding (Cloudflare Email Routing)
