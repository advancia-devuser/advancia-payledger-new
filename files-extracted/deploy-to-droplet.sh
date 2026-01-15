#!/bin/bash

# ============================================================================
# ADVANCIA PAY LEDGER - AUTOMATED DEPLOYMENT TO DIGITALOCEAN
# ============================================================================

set -e  # Exit on error

echo "🚀 Advancia Pay Ledger - DigitalOcean Deployment Script"
echo "========================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DROPLET_IP="134.199.243.224"
APP_DIR="/var/www/advancia-api"
DOMAIN="api.advancia.com"

# Step 1: Check prerequisites
echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"

if ! command -v ssh &> /dev/null; then
    echo -e "${RED}Error: SSH not found. Please install OpenSSH client.${NC}"
    exit 1
fi

if [ ! -f "dist/index.js" ]; then
    echo -e "${RED}Error: Backend not built. Run 'npm run build' first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites checked${NC}"
echo ""

# Step 2: Collect environment variables
echo -e "${YELLOW}Step 2: Environment Configuration${NC}"
echo "Please provide the following information:"
echo ""

read -p "Database URL (PostgreSQL): " DATABASE_URL
read -p "JWT Secret (press Enter for random): " JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -hex 32)
    echo "Generated JWT Secret: $JWT_SECRET"
fi

read -p "Resend API Key: " RESEND_API_KEY
read -p "Email From (e.g., Advancia <noreply@advancia.com>): " EMAIL_FROM
read -p "Frontend URL (e.g., https://advancia.com): " FRONTEND_URL

echo ""
echo -e "${GREEN}✓ Configuration collected${NC}"
echo ""

# Step 3: Create .env file
echo -e "${YELLOW}Step 3: Creating .env file...${NC}"

cat > .env.production << EOF
# Database
DATABASE_URL="$DATABASE_URL"

# JWT
JWT_SECRET="$JWT_SECRET"

# Email
RESEND_API_KEY="$RESEND_API_KEY"
EMAIL_FROM="$EMAIL_FROM"

# URLs
FRONTEND_URL="$FRONTEND_URL"
API_URL="https://$DOMAIN"

# Server
NODE_ENV="production"
PORT=3001
EOF

echo -e "${GREEN}✓ .env file created${NC}"
echo ""

# Step 4: Upload files to droplet
echo -e "${YELLOW}Step 4: Uploading files to droplet...${NC}"

# Create temp directory
mkdir -p deploy-package

# Copy necessary files
cp -r dist deploy-package/
cp -r prisma deploy-package/
cp package.json deploy-package/
cp package-lock.json deploy-package/
cp .env.production deploy-package/.env

# Create PM2 ecosystem config
cat > deploy-package/ecosystem.config.js << 'EOF'
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
EOF

# Create backup script
cat > deploy-package/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/www/advancia-api/backups"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="advancia_backup_$DATE.sql"

source /var/www/advancia-api/.env
pg_dump $DATABASE_URL > $BACKUP_DIR/$FILENAME
gzip $BACKUP_DIR/$FILENAME
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $FILENAME.gz"
EOF

chmod +x deploy-package/backup-db.sh

# Upload to droplet
echo "Uploading to $DROPLET_IP..."
scp -r deploy-package root@$DROPLET_IP:/tmp/

echo -e "${GREEN}✓ Files uploaded${NC}"
echo ""

# Step 5: Run setup on droplet
echo -e "${YELLOW}Step 5: Running setup on droplet...${NC}"

ssh root@$DROPLET_IP << 'ENDSSH'
set -e

echo "Installing system dependencies..."

# Update system
apt update

# Install Node.js 20 if not installed
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
fi

# Install PostgreSQL client if not installed
if ! command -v psql &> /dev/null; then
    apt install -y postgresql-client
fi

echo "✓ System dependencies installed"

# Create app directory
mkdir -p /var/www/advancia-api/{logs,backups}

# Move uploaded files
cd /tmp/deploy-package
cp -r * /var/www/advancia-api/
cd /var/www/advancia-api

# Install Node dependencies
echo "Installing Node.js dependencies..."
npm install --production

# Run Prisma migrations
echo "Running database migrations..."
npx prisma migrate deploy
npx prisma generate

echo "✓ Backend setup complete"

# Stop existing PM2 processes
pm2 delete advancia-api || true

# Start application
echo "Starting application..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root

echo "✓ Application started"

# Setup Nginx if not configured
if [ ! -f /etc/nginx/sites-available/advancia-api ]; then
    echo "Configuring Nginx..."
    
    cat > /etc/nginx/sites-available/advancia-api << 'NGINXEOF'
server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER;

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
    }
}
NGINXEOF

    # Create symbolic link
    ln -sf /etc/nginx/sites-available/advancia-api /etc/nginx/sites-enabled/
    
    # Test and reload Nginx
    nginx -t && systemctl reload nginx
    
    echo "✓ Nginx configured"
fi

# Setup cron for auto-approval
(crontab -l 2>/dev/null | grep -v "auto-approve"; echo "0 * * * * cd /var/www/advancia-api && node -e \"require('./dist/services/auto-approval.service').startAutoApprovalCron()\" >> /var/www/advancia-api/logs/cron.log 2>&1") | crontab -

# Setup cron for backups
(crontab -l 2>/dev/null | grep -v "backup-db.sh"; echo "0 1 * * * /var/www/advancia-api/backup-db.sh >> /var/www/advancia-api/logs/backup.log 2>&1") | crontab -

echo "✓ Cron jobs configured"

# Check status
pm2 status

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Application Status:"
pm2 status
echo ""
echo "Test the API:"
echo "curl http://localhost:3001/health"
ENDSSH

# Replace DOMAIN_PLACEHOLDER
ssh root@$DROPLET_IP "sed -i 's/DOMAIN_PLACEHOLDER/$DOMAIN/g' /etc/nginx/sites-available/advancia-api && nginx -t && systemctl reload nginx"

echo -e "${GREEN}✓ Droplet setup complete${NC}"
echo ""

# Step 6: Setup SSL (if certbot installed)
echo -e "${YELLOW}Step 6: Setting up SSL...${NC}"

ssh root@$DROPLET_IP << ENDSSH2
if command -v certbot &> /dev/null; then
    echo "Certbot found. Setting up SSL..."
    certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@advancia.com
    echo "✓ SSL configured"
else
    echo "Certbot not found. Install with: apt install -y certbot python3-certbot-nginx"
    echo "Then run: certbot --nginx -d $DOMAIN"
fi
ENDSSH2

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ DEPLOYMENT SUCCESSFUL!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Backend deployed to: https://$DOMAIN"
echo "Droplet IP: $DROPLET_IP"
echo ""
echo "Next steps:"
echo "1. Configure DNS to point $DOMAIN to $DROPLET_IP"
echo "2. If SSL not configured, run: certbot --nginx -d $DOMAIN"
echo "3. Deploy frontend to Vercel"
echo "4. Configure Cloudflare"
echo ""
echo "Monitor application:"
echo "  ssh root@$DROPLET_IP"
echo "  pm2 status"
echo "  pm2 logs advancia-api"
echo ""
echo "Manual backup:"
echo "  ssh root@$DROPLET_IP '/var/www/advancia-api/backup-db.sh'"
echo ""

# Cleanup
rm -rf deploy-package

echo -e "${GREEN}Deployment script finished!${NC}"
