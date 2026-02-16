# 🚀 COMPLETE DEPLOYMENT GUIDE - ADVANCIA PAY LEDGER

**Your Infrastructure:**
- ✅ DigitalOcean Droplet: `134.199.243.224` (advancia-prod)
- ✅ PostgreSQL Database: NYC3 (16 & 18 available)
- ✅ Frontend: Vercel (deploying)
- ✅ CDN/Security: Cloudflare (configuring)

---

## 📊 DEPLOYMENT ARCHITECTURE

```
User Browser
    ↓
Cloudflare CDN (Security + Cache)
    ↓
Vercel (Frontend - Next.js)
    ↓
DigitalOcean Droplet (Backend API)
    ↓
DigitalOcean PostgreSQL (Database)
```

---

## 🎯 PHASE 1: BACKEND DEPLOYMENT (DigitalOcean Droplet)

### Step 1: Connect to Your Droplet
```bash
ssh root@134.199.243.224
```

### Step 2: Install Required Software
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2 (Process Manager)
npm install -g pm2

# Install Nginx (Reverse Proxy)
apt install -y nginx

# Install PostgreSQL client
apt install -y postgresql-client

# Verify installations
node --version    # Should be v20.x
npm --version
pm2 --version
nginx -v
```

### Step 3: Create Application Directory
```bash
# Create app directory
mkdir -p /var/www/advancia-api
cd /var/www/advancia-api

# Create necessary folders
mkdir -p logs
mkdir -p backups
```

### Step 4: Upload Backend Code
```bash
# On your local machine:
cd /path/to/advancia-launch/backend

# Create production build
npm install
npm run build

# Upload to droplet (from local machine)
scp -r dist package.json package-lock.json root@134.199.243.224:/var/www/advancia-api/
scp -r prisma root@134.199.243.224:/var/www/advancia-api/
```

### Step 5: Install Dependencies on Droplet
```bash
# Back on the droplet
cd /var/www/advancia-api
npm install --production
```

### Step 6: Setup Environment Variables
```bash
# Create .env file
nano /var/www/advancia-api/.env
```

**Paste this (update with your values):**
```bash
# Database (Use your DigitalOcean PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:25060/advancia?sslmode=require"

# JWT Secret (generate a strong random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-to-random-string"

# Resend Email
RESEND_API_KEY="re_your_resend_api_key_here"
EMAIL_FROM="Advancia <noreply@advancia.com>"

# URLs
FRONTEND_URL="https://advancia.com"
API_URL="https://api.advancia.com"

# Server
NODE_ENV="production"
PORT=3001

# Optional: Blockchain (if using)
ALCHEMY_API_KEY="your_alchemy_key"

# Optional: Stripe
STRIPE_SECRET_KEY="YOUR_STRIPE_SECRET_KEY"
```

**Save and exit:** `Ctrl+X`, then `Y`, then `Enter`

### Step 7: Setup Database
```bash
cd /var/www/advancia-api

# Run Prisma migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### Step 8: Create PM2 Ecosystem Config
```bash
nano /var/www/advancia-api/ecosystem.config.js
```

**Paste this:**
```javascript
module.exports = {
  apps: [{
    name: 'advancia-api',
    script: './dist/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '500M',
    autorestart: true,
    watch: false,
  }]
};
```

### Step 9: Start Application with PM2
```bash
cd /var/www/advancia-api

# Start app
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd
# Copy and run the command it outputs

# Check status
pm2 status
pm2 logs advancia-api
```

### Step 10: Setup Nginx Reverse Proxy
```bash
# Create Nginx config
nano /etc/nginx/sites-available/advancia-api
```

**Paste this:**
```nginx
server {
    listen 80;
    server_name api.advancia.com;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/s;
    limit_req zone=api_limit burst=200 nodelay;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint (no rate limit)
    location /health {
        proxy_pass http://localhost:3001/health;
        access_log off;
    }
}
```

**Enable site:**
```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/advancia-api /etc/nginx/sites-enabled/

# Test Nginx config
nginx -t

# If OK, reload Nginx
systemctl reload nginx
```

### Step 11: Setup SSL with Let's Encrypt
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate (make sure DNS is pointed to droplet first!)
certbot --nginx -d api.advancia.com

# Certbot will auto-configure Nginx for HTTPS
# Choose: Redirect HTTP to HTTPS

# Test auto-renewal
certbot renew --dry-run
```

### Step 12: Setup Auto-Approval Cron Job
```bash
# Create cron script
nano /var/www/advancia-api/cron-auto-approve.sh
```

**Paste this:**
```bash
#!/bin/bash
cd /var/www/advancia-api
node -e "
const { startAutoApprovalCron } = require('./dist/services/auto-approval.service');
startAutoApprovalCron();
" >> /var/www/advancia-api/logs/cron.log 2>&1
```

**Make executable:**
```bash
chmod +x /var/www/advancia-api/cron-auto-approve.sh

# Add to crontab (runs every hour)
crontab -e

# Add this line:
0 * * * * /var/www/advancia-api/cron-auto-approve.sh
```

### Step 13: Test Backend
```bash
# Test health endpoint
curl http://localhost:3001/health

# Test from outside
curl https://api.advancia.com/health

# Check logs
pm2 logs advancia-api

# Check Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## 🎨 PHASE 2: FRONTEND DEPLOYMENT (Vercel)

### Step 1: Install Vercel CLI
```bash
# On your local machine
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
# Follow browser authentication
```

### Step 3: Prepare Frontend for Deployment
```bash
cd /path/to/advancia-launch/frontend

# Create .env.production
nano .env.production
```

**Paste this:**
```bash
NEXT_PUBLIC_API_URL=https://api.advancia.com
```

### Step 4: Deploy to Vercel
```bash
# First deployment (interactive)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - Project name? advancia-payledger
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### Step 5: Configure Domain on Vercel
```bash
# Add custom domain
vercel domains add advancia.com
vercel domains add www.advancia.com

# Vercel will show DNS records to add
```

---

## ☁️ PHASE 3: CLOUDFLARE SETUP

### Step 1: Add Site to Cloudflare
1. Go to https://dash.cloudflare.com
2. Click "Add Site"
3. Enter: `advancia.com`
4. Choose Free plan
5. Click "Add Site"

### Step 2: Update Nameservers at Domain Registrar
Cloudflare will show you nameservers like:
```
elsa.ns.cloudflare.com
ron.ns.cloudflare.com
```

Go to your domain registrar (GoDaddy, Namecheap, etc.) and update nameservers.

### Step 3: Configure DNS Records
In Cloudflare DNS settings, add:

```
Type    Name    Content                 Proxy   TTL
─────────────────────────────────────────────────────
A       @       134.199.243.224        ✓ On    Auto
A       www     134.199.243.224        ✓ On    Auto
CNAME   api     api.advancia.com       ✓ On    Auto
```

**For Vercel:**
```
Type    Name    Content                         Proxy   TTL
──────────────────────────────────────────────────────────
CNAME   @       cname.vercel-dns.com           ✗ Off   Auto
CNAME   www     cname.vercel-dns.com           ✗ Off   Auto
```

### Step 4: Enable Security Features

**SSL/TLS Settings:**
1. Go to SSL/TLS tab
2. Set mode to "Full (strict)"
3. Enable "Always Use HTTPS"
4. Enable "Automatic HTTPS Rewrites"

**Firewall Rules:**
1. Go to Security → WAF
2. Enable "Bot Fight Mode"
3. Add rate limiting:
   - `/api/*` → 100 requests per minute
   - `/admin/*` → 20 requests per minute

**Page Rules:**
1. Go to Rules → Page Rules
2. Add rule for `api.advancia.com/*`:
   - Security Level: High
   - Cache Level: Bypass
3. Add rule for `advancia.com/*`:
   - Cache Level: Standard
   - Browser Cache TTL: 4 hours

### Step 5: Enable DDoS Protection
1. Go to Security → DDoS
2. Enable "HTTP DDoS Attack Protection"
3. Sensitivity: High

---

## 🔒 PHASE 4: SECURITY HARDENING

### Step 1: Setup Firewall on Droplet
```bash
# Install UFW
apt install -y ufw

# Allow SSH
ufw allow 22/tcp

# Allow HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Allow PostgreSQL (only from DigitalOcean private network)
ufw allow from 10.116.0.0/20 to any port 5432

# Enable firewall
ufw enable

# Check status
ufw status
```

### Step 2: Disable Root Login
```bash
# Create admin user
adduser admin
usermod -aG sudo admin

# Copy SSH key to admin
mkdir /home/admin/.ssh
cp /root/.ssh/authorized_keys /home/admin/.ssh/
chown -R admin:admin /home/admin/.ssh
chmod 700 /home/admin/.ssh
chmod 600 /home/admin/.ssh/authorized_keys

# Disable root SSH login
nano /etc/ssh/sshd_config

# Change these lines:
PermitRootLogin no
PasswordAuthentication no

# Restart SSH
systemctl restart sshd

# Test: SSH as admin before logging out as root!
# ssh admin@134.199.243.224
```

### Step 3: Setup Fail2Ban
```bash
apt install -y fail2ban

# Create local config
nano /etc/fail2ban/jail.local
```

**Paste this:**
```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
```

**Start Fail2Ban:**
```bash
systemctl enable fail2ban
systemctl start fail2ban
systemctl status fail2ban
```

---

## 📊 PHASE 5: MONITORING & BACKUPS

### Step 1: Setup Database Backups
```bash
# Create backup script
nano /var/www/advancia-api/backup-db.sh
```

**Paste this:**
```bash
#!/bin/bash
BACKUP_DIR="/var/www/advancia-api/backups"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="advancia_backup_$DATE.sql"

# Get DB URL from .env
source /var/www/advancia-api/.env

# Backup database
pg_dump $DATABASE_URL > $BACKUP_DIR/$FILENAME

# Compress
gzip $BACKUP_DIR/$FILENAME

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $FILENAME.gz"
```

**Make executable and add to cron:**
```bash
chmod +x /var/www/advancia-api/backup-db.sh

# Add to crontab (daily at 1 AM)
crontab -e

# Add:
0 1 * * * /var/www/advancia-api/backup-db.sh >> /var/www/advancia-api/logs/backup.log 2>&1
```

### Step 2: Setup Log Rotation
```bash
nano /etc/logrotate.d/advancia
```

**Paste this:**
```
/var/www/advancia-api/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 root root
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

---

## ✅ DEPLOYMENT VERIFICATION CHECKLIST

### Backend (DigitalOcean):
- [ ] Backend accessible at https://api.advancia.com/health
- [ ] PM2 shows 2 instances running
- [ ] Nginx serving requests
- [ ] SSL certificate valid
- [ ] Database connected
- [ ] Logs rotating properly
- [ ] Cron jobs scheduled
- [ ] Firewall configured

### Frontend (Vercel):
- [ ] Site accessible at https://advancia.com
- [ ] HTTPS enabled
- [ ] API calls working
- [ ] No console errors
- [ ] Build successful

### Cloudflare:
- [ ] DNS records propagated
- [ ] SSL/TLS mode: Full (strict)
- [ ] DDoS protection enabled
- [ ] Rate limiting active
- [ ] Firewall rules working

### Security:
- [ ] Root login disabled
- [ ] Fail2Ban running
- [ ] UFW firewall active
- [ ] SSL certificates auto-renewing
- [ ] Backups scheduled

---

## 🚀 POST-DEPLOYMENT TASKS

### 1. Create First Admin User
```bash
# SSH to droplet
ssh admin@134.199.243.224
cd /var/www/advancia-api

# Run Prisma Studio
npx prisma studio

# Or use database directly
# Create user with role: SUPER_ADMIN, status: ACTIVE
```

### 2. Test Registration Flow
1. Go to https://advancia.com/register
2. Register a test user
3. Check email received
4. Login to admin panel
5. Approve test user
6. Verify approval email sent
7. Test login

### 3. Monitor Logs
```bash
# PM2 logs
pm2 logs advancia-api

# Nginx access logs
tail -f /var/log/nginx/access.log

# Nginx error logs
tail -f /var/log/nginx/error.log

# Application logs
tail -f /var/www/advancia-api/logs/out.log
```

---

## 🆘 TROUBLESHOOTING

### Backend Not Responding:
```bash
# Check PM2 status
pm2 status

# Restart app
pm2 restart advancia-api

# Check logs
pm2 logs advancia-api --lines 100
```

### Database Connection Issues:
```bash
# Test connection
psql $DATABASE_URL

# Check .env file
cat /var/www/advancia-api/.env | grep DATABASE_URL
```

### Nginx Issues:
```bash
# Test config
nginx -t

# Reload config
systemctl reload nginx

# Check status
systemctl status nginx

# View error logs
tail -f /var/log/nginx/error.log
```

### SSL Certificate Issues:
```bash
# Check certificate
certbot certificates

# Renew manually
certbot renew

# Check auto-renewal
systemctl status certbot.timer
```

---

## 📞 MAINTENANCE COMMANDS

```bash
# Restart backend
pm2 restart advancia-api

# Reload backend (zero downtime)
pm2 reload advancia-api

# View logs
pm2 logs advancia-api

# Monitor PM2
pm2 monit

# Update backend code
cd /var/www/advancia-api
git pull  # if using git
npm install
pm2 reload advancia-api

# Manual database backup
/var/www/advancia-api/backup-db.sh

# Check disk usage
df -h

# Check memory
free -m

# Check running processes
htop
```

---

## 🎯 ESTIMATED TIMELINE

- **Phase 1 (Backend)**: 45-60 minutes
- **Phase 2 (Frontend)**: 15-20 minutes
- **Phase 3 (Cloudflare)**: 10-15 minutes
- **Phase 4 (Security)**: 20-30 minutes
- **Phase 5 (Monitoring)**: 15-20 minutes
- **Testing**: 15-20 minutes

**Total**: ~2-3 hours

---

## 💰 MONTHLY COSTS

- **DigitalOcean Droplet** (1GB RAM): $6/month
- **DigitalOcean PostgreSQL** (1GB RAM): $15/month
- **Vercel** (Hobby - Free): $0/month
- **Cloudflare** (Free): $0/month
- **Domain**: ~$12/year

**Total**: ~$21-27/month

---

## ✅ YOU'RE READY TO DEPLOY!

**Next Steps:**
1. Start with Phase 1 (Backend on DigitalOcean)
2. Then Phase 2 (Frontend on Vercel)
3. Configure Cloudflare (Phase 3)
4. Harden security (Phase 4)
5. Setup monitoring (Phase 5)

**Need help? Let me know which phase you're on!** 🚀
