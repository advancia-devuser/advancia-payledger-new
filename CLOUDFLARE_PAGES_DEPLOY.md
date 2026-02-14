# Cloudflare Pages Deployment - advanciapayledger.com

## Your Cloudflare Details
- **Domain:** advanciapayledger.com
- **Zone ID:** 0bff66558872c58ed5b8b7942acc34d9
- **Account ID:** 74ecde4d46d4b399c7295cf599d2886b

---

## DEPLOY NOW (5 Minutes)

### Step 1: Create Cloudflare Pages Project

1. Go to: https://dash.cloudflare.com/74ecde4d46d4b399c7295cf599d2886b/pages
2. Click: **Create a project**
3. Click: **Connect to Git**

### Step 2: Connect GitHub

1. Click: **GitHub**
2. Authorize Cloudflare GitHub app if prompted
3. Search for: **pdtribe181-prog/advancia-payledger**
4. Click: **Begin setup**

### Step 3: Build Configuration

**Set these exact values:**

| Setting | Value |
|---------|-------|
| **Project name** | `advancia-payledger` |
| **Production branch** | `master` |
| **Framework preset** | Next.js |
| **Root directory (optional)** | `frontend` |
| **Build command** | `npm run build` |
| **Build output directory** | `.next` |
| **Environment variables** | (leave empty for now) |

### Step 4: Deploy

1. Click: **Save and Deploy**
2. Wait 2-3 minutes (watch build logs)
3. Your site will be live!

---

## URLs After Deployment

**Automatic Cloudflare Pages URL:**
- https://advancia-payledger.pages.dev

**Custom Domain (set up after):**
- https://advanciapayledger.com
- https://www.advanciapayledger.com

---

## After First Deploy - Add Custom Domain

1. In Pages project → **Custom domains**
2. Click: **Set up a custom domain**
3. Enter: `advanciapayledger.com`
4. Cloudflare will auto-configure DNS (you already have the zone)
5. SSL certificate auto-provisions in 1-2 minutes

---

## DNS Records (Already Configured ✅)

You already have:
- ✅ A record for `api` (104.16.0.1, proxied)
- ✅ MX records for email (Cloudflare)
- ✅ TXT records (SPF, DKIM, DMARC)

Cloudflare Pages will automatically add:
- `CNAME` record for `www` → `advancia-payledger.pages.dev`
- `CNAME` record for root if needed

---

## Environment Variables (Add Later)

After deployment, add in Pages → Settings → Environment variables:

```
NEXT_PUBLIC_API_URL = https://api.advanciapayledger.com
NEXT_PUBLIC_APP_URL = https://advanciapayledger.com
```

---

## Expected Build Output

Build should complete in ~2-3 minutes:
- Installing dependencies: ~60 seconds
- Building Next.js: ~90 seconds
- Deploying to CDN: ~30 seconds

**Total:** ~3-4 minutes

---

## Troubleshooting

**Build fails?**
- Check build logs in Cloudflare dashboard
- Verify `frontend/` directory exists in GitHub
- Ensure `package.json` has `build` script

**Custom domain not working?**
- Wait 5-10 minutes for DNS propagation
- Check SSL certificate provisioned
- Verify CNAME records added automatically

---

## Next Steps After Live

1. ✅ Test: https://advancia-payledger.pages.dev
2. ✅ Add custom domain: advanciapayledger.com
3. ✅ Enable WAF rules (Security → WAF)
4. ✅ Set up monitoring (Analytics)
5. ✅ Configure environment variables

---

## Support

- Build failing? Share build logs
- DNS issues? Check Cloudflare DNS tab
- Questions? Check QUICK_START.md

**Repository:** https://github.com/pdtribe181-prog/advancia-payledger
