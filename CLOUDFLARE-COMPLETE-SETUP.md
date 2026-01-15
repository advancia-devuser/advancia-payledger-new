# Cloudflare Complete Setup Guide - Advancia Pay Ledger

**Domain:** advanciapayledger.com  
**Zone ID:** `0bff66558872c58ed5b8b7942acc34d9`  
**Account ID:** `74ecde4d46d4b399c7295cf599d2886b`  
**Server IP:** 157.245.8.131

---

## 🎯 Quick Start - Email Setup (5 minutes)

### Option 1: Automated Script (RECOMMENDED)

```bash
# 1. Edit the script
nano setup-cloudflare-emails.sh
# Change line 7: DESTINATION_EMAIL="your-real-email@gmail.com"

# 2. Make executable (Linux/Mac)
chmod +x setup-cloudflare-emails.sh

# 3. Run it
./setup-cloudflare-emails.sh

# Windows PowerShell alternative:
# Use Git Bash or WSL, or run commands from CLOUDFLARE-EMAIL-COMMANDS.md manually
```

### Option 2: Manual Commands

See `CLOUDFLARE-EMAIL-COMMANDS.md` for step-by-step curl commands.

### What Gets Created

```
✅ livechat@advanciapayledger.com   → Your Gmail
✅ support@advanciapayledger.com    → Your Gmail
✅ billing@advanciapayledger.com    → Your Gmail
✅ admin@advanciapayledger.com      → Your Gmail
✅ noreply@advanciapayledger.com    → Your Gmail
✅ info@advanciapayledger.com       → Your Gmail
```

**Cost:** $0/month (FREE forever)

---

## 🔒 SSL/TLS Setup (15 minutes)

### Step 1: Generate Origin Certificate

1. Go to: Cloudflare Dashboard → SSL/TLS → Origin Server
2. Click "Create Certificate"
3. Settings:
   - **Hostnames:** `advanciapayledger.com`, `*.advanciapayledger.com`
   - **Validity:** 15 years
   - **Key type:** RSA (2048)
4. Click "Create"
5. **Save both:**
   - Origin Certificate → `/etc/ssl/certs/cloudflare-origin.pem`
   - Private Key → `/etc/ssl/private/cloudflare-origin.key`

### Step 2: Install Certificate on Server

```bash
# SSH into your server
ssh root@157.245.8.131

# Create SSL directories
sudo mkdir -p /etc/ssl/certs /etc/ssl/private

# Create certificate file
sudo nano /etc/ssl/certs/cloudflare-origin.pem
# Paste the Origin Certificate

# Create private key file
sudo nano /etc/ssl/private/cloudflare-origin.key
# Paste the Private Key

# Set permissions
sudo chmod 644 /etc/ssl/certs/cloudflare-origin.pem
sudo chmod 600 /etc/ssl/private/cloudflare-origin.key
```

### Step 3: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/advanciapayledger
```

**Complete Nginx Configuration:**

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name advanciapayledger.com www.advanciapayledger.com;
    
    return 301 https://$server_name$request_uri;
}

# HTTPS Server - Backend API
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name advanciapayledger.com www.advanciapayledger.com;

    # Cloudflare Origin Certificate
    ssl_certificate /etc/ssl/certs/cloudflare-origin.pem;
    ssl_certificate_key /etc/ssl/private/cloudflare-origin.key;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API Backend
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $http_x_real_ip;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Frontend (if serving from same domain)
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### Step 4: Test and Reload Nginx

```bash
# Test configuration
sudo nginx -t

# If OK, reload
sudo systemctl reload nginx

# Check status
sudo systemctl status nginx
```

### Step 5: Configure Cloudflare SSL Mode

1. Go to: Cloudflare Dashboard → SSL/TLS → Overview
2. Set SSL/TLS encryption mode: **Full (strict)**
3. Enable: **Always Use HTTPS**
4. Enable: **Automatic HTTPS Rewrites**

---

## 🛡️ Security Configuration

### Firewall Rules

Go to: Cloudflare Dashboard → Security → WAF

**Rule 1: Block Bad Bots**
```
Expression: (cf.bot_management.score lt 30)
Action: Block
```

**Rule 2: Rate Limit Login**
```
Expression: (http.request.uri.path eq "/api/auth/login")
Action: Rate Limit (10 requests per minute)
```

**Rule 3: Block Non-US Traffic (Optional)**
```
Expression: (ip.geoip.country ne "US" and not cf.bot_management.verified_bot)
Action: Challenge
```

### DDoS Protection

Go to: Cloudflare Dashboard → Security → DDoS

- **HTTP DDoS Attack Protection:** Enabled (automatic)
- **Network-layer DDoS Attack Protection:** Enabled (automatic)
- **Sensitivity Level:** Medium

### Bot Protection

Go to: Cloudflare Dashboard → Security → Bots

- **Bot Fight Mode:** Enabled (Free plan)
- **Super Bot Fight Mode:** Available on Pro plan

---

## ⚡ Performance Optimization

### Caching Rules

Go to: Cloudflare Dashboard → Caching → Configuration

**Browser Cache TTL:** 4 hours

**Page Rules** (Go to: Rules → Page Rules)

**Rule 1: Cache Static Assets**
```
URL: *advanciapayledger.com/static/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 month
```

**Rule 2: Bypass Cache for API**
```
URL: *advanciapayledger.com/api/*
Settings:
  - Cache Level: Bypass
```

**Rule 3: Cache Frontend**
```
URL: *advanciapayledger.com/*
Settings:
  - Cache Level: Standard
  - Edge Cache TTL: 2 hours
```

### Speed Optimization

Go to: Cloudflare Dashboard → Speed → Optimization

**Auto Minify:**
- ✅ JavaScript
- ✅ CSS
- ✅ HTML

**Brotli:** ✅ Enabled

**Early Hints:** ✅ Enabled

**Rocket Loader:** ⚠️ Off (can break React apps)

**Mirage:** ✅ Enabled (image optimization)

---

## 📧 Email Configuration for Backend

### Environment Variables

Update `backend-clean/.env`:

```bash
# Email Configuration
EMAIL_FROM="noreply@advanciapayledger.com"
EMAIL_SUPPORT="support@advanciapayledger.com"
EMAIL_ADMIN="admin@advanciapayledger.com"
EMAIL_BILLING="billing@advanciapayledger.com"

# SMTP Configuration (if sending via Gmail)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-gmail@gmail.com"
SMTP_PASS="your-app-specific-password"

# Or use SendGrid (recommended for production)
SENDGRID_API_KEY="your-sendgrid-api-key"
SENDGRID_FROM="noreply@advanciapayledger.com"
```

### Gmail SMTP Setup (for sending)

1. Go to: Google Account → Security → 2-Step Verification
2. Scroll to: App passwords
3. Generate app password for "Mail"
4. Use that password in `SMTP_PASS`

### SendGrid Setup (Recommended)

1. Sign up: sendgrid.com (FREE tier: 100 emails/day)
2. Create API Key
3. Verify domain: advanciapayledger.com
4. Add DNS records (provided by SendGrid)
5. Use API key in backend

---

## 🔧 DNS Records

Go to: Cloudflare Dashboard → DNS → Records

**Current Records:**

```
Type    Name    Content                 Proxy   TTL
A       @       157.245.8.131          ✅ Proxied   Auto
A       www     157.245.8.131          ✅ Proxied   Auto
```

**Email Routing Records (Auto-created):**

```
Type    Name    Content                 Proxy   TTL
MX      @       route1.mx.cloudflare.net   ❌ DNS only   Auto
MX      @       route2.mx.cloudflare.net   ❌ DNS only   Auto
MX      @       route3.mx.cloudflare.net   ❌ DNS only   Auto
TXT     @       v=spf1 include:_spf.mx.cloudflare.net ~all   ❌ DNS only   Auto
```

**Additional Records (if using SendGrid):**

```
Type    Name                Content                         Proxy   TTL
CNAME   em1234             u1234567.wl123.sendgrid.net     ❌ DNS only   Auto
CNAME   s1._domainkey      s1.domainkey.u1234567.wl123.sendgrid.net   ❌ DNS only   Auto
CNAME   s2._domainkey      s2.domainkey.u1234567.wl123.sendgrid.net   ❌ DNS only   Auto
```

---

## 📊 Analytics & Monitoring

### Cloudflare Analytics

Go to: Cloudflare Dashboard → Analytics & Logs

**Available Metrics:**
- Requests
- Bandwidth
- Threats blocked
- Page views
- Unique visitors
- Top paths
- Top countries

### Real User Monitoring (RUM)

Go to: Cloudflare Dashboard → Speed → Web Analytics

1. Enable Web Analytics
2. Add JavaScript snippet to frontend
3. Track: Page load time, Core Web Vitals, User interactions

---

## ✅ Complete Setup Checklist

### Email (5 minutes)
```
☐ Run setup-cloudflare-emails.sh
☐ Verify destination email (click link in inbox)
☐ Test livechat@advanciapayledger.com
☐ Update Tawk.to with livechat@ email
☐ Update backend .env with email addresses
```

### SSL/TLS (15 minutes)
```
☐ Generate Cloudflare origin certificate
☐ Install certificate on server (157.245.8.131)
☐ Update Nginx configuration
☐ Test Nginx config (nginx -t)
☐ Reload Nginx
☐ Set Cloudflare SSL mode to "Full (strict)"
☐ Enable "Always Use HTTPS"
☐ Test: https://advanciapayledger.com
```

### Security (10 minutes)
```
☐ Enable Bot Fight Mode
☐ Create firewall rules (block bots, rate limit)
☐ Verify DDoS protection enabled
☐ Review security events
```

### Performance (5 minutes)
```
☐ Enable Auto Minify (JS, CSS, HTML)
☐ Enable Brotli compression
☐ Create page rules (cache static, bypass API)
☐ Enable Early Hints
☐ Test page speed
```

### Backend Config (5 minutes)
```
☐ Update .env with email addresses
☐ Configure SMTP or SendGrid
☐ Test email sending
☐ Verify email receiving
```

---

## 🧪 Testing

### Test Email Routing

```bash
# Send test email
echo "Test email body" | mail -s "Test Subject" livechat@advanciapayledger.com

# Or use online tool: mail-tester.com
```

### Test HTTPS

```bash
# Check SSL certificate
curl -vI https://advanciapayledger.com

# Test API endpoint
curl https://advanciapayledger.com/api/health

# Check security headers
curl -I https://advanciapayledger.com
```

### Test Performance

1. Go to: tools.pingdom.com
2. Enter: https://advanciapayledger.com
3. Check load time (should be < 2 seconds)

### Test Security

1. Go to: securityheaders.com
2. Enter: https://advanciapayledger.com
3. Should get A+ rating

---

## 💰 Cost Breakdown

**Current Setup (FREE):**
```
Cloudflare Free Plan:        $0/month
  - Email Routing:           ✅ Unlimited
  - SSL Certificate:         ✅ Included
  - DDoS Protection:         ✅ Included
  - CDN:                     ✅ Included
  - Analytics:               ✅ Basic
  
Total: $0/month
```

**Optional Upgrades:**

**Cloudflare Pro ($20/month):**
- Advanced DDoS
- Image optimization
- Mobile optimization
- 20+ page rules

**SendGrid Free ($0/month):**
- 100 emails/day
- Email API
- Analytics

**SendGrid Essentials ($15/month):**
- 50,000 emails/month
- Email validation
- Dedicated IP

---

## 🚀 Next Steps

### Immediate (Today)
1. ✅ Run email setup script
2. ✅ Test livechat@advanciapayledger.com
3. ✅ Update Tawk.to settings
4. ✅ Configure backend email

### This Week
1. Generate SSL certificate
2. Install on server
3. Configure Nginx
4. Enable security rules
5. Optimize performance

### Before Launch
1. Sign up SendGrid (for transactional emails)
2. Test all email flows
3. Run security audit
4. Performance testing
5. Monitor analytics

---

## 📞 Support

**Cloudflare Community:** community.cloudflare.com  
**Cloudflare Docs:** developers.cloudflare.com  
**Status Page:** cloudflarestatus.com

---

## 🎉 Summary

**What You Get:**

✅ **6 Professional Email Addresses** (FREE)  
✅ **Enterprise-grade SSL** (FREE)  
✅ **DDoS Protection** (FREE)  
✅ **Global CDN** (FREE)  
✅ **Bot Protection** (FREE)  
✅ **Analytics** (FREE)  
✅ **99.99% Uptime** (FREE)

**Total Cost:** $0/month

**Setup Time:** 30-40 minutes total

Your domain is already on Cloudflare - just enable the features! 🚀
