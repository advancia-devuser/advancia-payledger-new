# Cloudflare Deployment - 5-Minute Quick Start
**Get Advancia Pay Ledger LIVE in 5 minutes**

---

## ✅ COMPLETE THESE STEPS NOW

### Step 1: Get Your API Token (1 min)
**In Cloudflare Dashboard:**
1. Go to: https://dash.cloudflare.com/
2. Click: **Your Profile** (bottom left)
3. Click: **API Tokens**
4. Click: **Create Token**
5. Select: **Edit Cloudflare Workers** template
6. Scroll to **Zone Resources** → Select your domain
7. Click: **Continue to Summary**
8. Click: **Create Token**
9. **COPY the token** (save it somewhere safe)

---

### Step 2: Get Your Zone ID (30 sec)
**In Cloudflare Dashboard:**
1. Go to your domain
2. Look at **Right Sidebar**
3. **Copy Zone ID** (alphanumeric, 32 chars)

---

### Step 3: Run The Setup Script (2 min)

**Windows (PowerShell):**
```powershell
cd "C:\Users\mucha.DESKTOP-H7T9NPM\Downloads\mdsiles\myproject\advancia-deployed"
.\frontend\scripts\setup-cloudflare-waf.ps1
```

**When prompted:**
- Paste API Token when asked
- Paste Zone ID when asked
- Enter: `advancia.io` (or your domain)
- Type: `yes` when asked to apply

**This will automatically:**
- ✅ Enable OWASP Core Rules (SQLi, XSS, LFI blocking)
- ✅ Set rate limits (API: 100/10s, Login: 5/min)
- ✅ Block SQL injection attempts
- ✅ Block XSS attacks
- ✅ Require auth on API endpoints
- ✅ Block AI bots (ChatGPT, Claude)
- ✅ Set SSL/TLS 1.2+

---

### Step 4: Connect GitHub to Cloudflare Pages (1.5 min)

**In Cloudflare Dashboard:**
1. Go to: **Pages** (left sidebar)
2. Click: **Create a project**
3. Click: **Connect to Git**
4. Select: **GitHub**
5. Authorize Cloudflare app
6. Search: `pdtribe181-prog/advancia-payledger`
7. Click: **Select Repository**
8. In **Build settings:**
   - Build command: `npm run build`
   - Build output directory: `frontend/.next`
   - Root directory: `frontend`
9. **Production branch:** `master`
10. Click: **Save and Deploy**

**Instant URL:** https://advancia-payledger.pages.dev (auto-generated)

---

### Step 5: Verify It's Working (1 min)

Check all ✅:
```bash
# 1. Check frontend is live
curl -I https://advancia-payledger.pages.dev

# 2. Check WAF is blocking SQLi
curl "https://advancia-payledger.pages.dev/api?id=1' OR '1'='1"
# Should return: 403 Forbidden

# 3. Check rate limiting works
for i in {1..150}; do curl -s https://advancia-payledger.pages.dev/api > /dev/null; done
# After 100 requests should get: 429 Too Many Requests

# 4. Check bot blocking
curl -H "User-Agent: GPTBot" https://advancia-payledger.pages.dev
# Should return: 403 Forbidden
```

---

## 🚀 YOU ARE NOW LIVE!

| Item | Status |
|------|--------|
| Frontend | ✅ Live at https://advancia-payledger.pages.dev |
| OWASP Rules | ✅ Enabled (SQLi, XSS, LFI, RFI blocked) |
| Rate Limiting | ✅ 100 req/10s on API |
| Bot Protection | ✅ AI crawlers blocked |
| SSL/TLS | ✅ 1.2+ enforced |
| Auto-deploy | ✅ Triggered on git push |

---

## 📊 MONITOR IN REAL-TIME

**Security Events:**
1. Go to: Cloudflare Dashboard → **Security → Event Log**
2. View all blocked requests in real-time
3. Check for false positives

**Analytics:**
1. Go to: **Analytics → Security**
2. See: Attacks blocked, bot traffic, request patterns

**Alerts:**
1. Go to: **Notifications** → **Create Notification**
2. Set event: **Firewall Blocked Traffic**
3. Threshold: >50 blocks/min
4. Get Slack/Email alerts

---

## 🔧 TROUBLESHOOTING

**Pages deployment fails?**
```bash
# Check build locally
cd frontend
npm run build
```

**WAF rules blocking legitimate traffic?**
1. Go to: Security → Event Log
2. Find blocked request
3. Click "Add to allow list"

**Rate limits too aggressive?**
In Cloudflare Dashboard:
1. Security → Rate Limiting
2. Adjust threshold (currently 100 req/10s)

**Need to disable temporarily?**
```bash
cd terraform
terraform destroy  # Removes all WAF rules
```

---

## 🎯 WHAT'S RUNNING NOW

- **Frontend:** Next.js 14.2 React app (fully mocked)
- **Database:** Mock data only (in-memory)
- **Backend:** Edge Worker at Cloudflare (request routing)
- **CDN:** Global distribution via Cloudflare
- **Security:** OWASP rules + rate limiting + bot blocking

---

## 📱 NEXT FEATURES (Optional)

**If you want to add backend:**
```bash
# Create Node.js backend
npm init -y
npm install express cors dotenv

# Deploy to Vercel, Railway, or Render
git push origin backend-api
```

**If you want real database:**
```bash
# Add PostgreSQL connection
# Use Prisma ORM for database
npm install @prisma/client prisma
```

---

## ✨ DEPLOYMENT COMPLETE!

- ✅ Code on GitHub
- ✅ Deployed to Cloudflare Pages
- ✅ WAF security enabled
- ✅ Auto-deploy on git push
- ✅ Global CDN + caching
- ✅ SSL/TLS 1.2+ enforced
- ✅ Rate limiting active
- ✅ Bot protection enabled

**Live URL:** https://advancia-payledger.pages.dev

---

## 🆘 SUPPORT

**Issues?**
1. Check [SETUP_CLOUDFLARE_WAF.md](SETUP_CLOUDFLARE_WAF.md) for detailed guide
2. View Cloudflare logs: https://dash.cloudflare.com/
3. Check git status: `git log --oneline -10`

**Questions?**
- Terraform: https://registry.terraform.io/providers/cloudflare/cloudflare/latest
- Cloudflare: https://developers.cloudflare.com/
- Next.js: https://nextjs.org/docs
