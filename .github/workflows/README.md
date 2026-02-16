# GitHub Actions Workflows

This directory contains CI/CD workflows for automated testing and deployment.

## Workflows

### `deploy.yml` - Main Deployment Pipeline

**Triggers:**
- Push to `master` or `main` branch
- Pull requests to `master` or `main` branch

**Jobs:**

1. **test-backend** - Tests backend code
   - Installs dependencies
   - Runs linter
   - Runs tests

2. **test-frontend** - Tests frontend code
   - Installs dependencies
   - Builds Next.js application
   - Verifies build success

3. **deploy-backend** - Deploys backend to production
   - Only runs on push to master
   - SSH into server
   - Pull latest code
   - Install dependencies
   - Run database migrations
   - Restart PM2 process

4. **deploy-frontend** - Deploys frontend to Vercel
   - Only runs on push to master
   - Deploys to Vercel production

5. **deploy-email-worker** - Deploys Cloudflare Email Worker
   - Only runs on push to master
   - Deploys worker using Wrangler CLI

6. **notify-deployment** - Sends deployment notifications
   - Sends Slack notification (if configured)
   - Sends Discord notification (if configured)

## Required Secrets

Configure these in GitHub repository settings → Secrets and variables → Actions:

### Backend Deployment
- `SERVER_HOST` - Production server IP/hostname
- `SERVER_USER` - SSH username
- `SSH_PRIVATE_KEY` - SSH private key for authentication

### Frontend Deployment
- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `NEXT_PUBLIC_API_URL` - Backend API URL

### Email Worker Deployment
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID (74ecde4d46d4b399c7295cf599d2886b)

### Notifications (Optional)
- `SLACK_WEBHOOK_URL` - Slack webhook for notifications
- `DISCORD_WEBHOOK_URL` - Discord webhook for notifications

## Setup Instructions

### 1. Configure GitHub Secrets

```bash
# Go to GitHub repository
# Settings → Secrets and variables → Actions → New repository secret

# Add each secret listed above
```

### 2. Prepare Backend Server

```bash
# SSH into your server
ssh user@your-server.com

# Create deployment directory
sudo mkdir -p /var/www/advancia-backend
sudo chown $USER:$USER /var/www/advancia-backend

# Clone repository
cd /var/www/advancia-backend
git clone https://github.com/advancia-devuser/advanciapayledger-1.git .

# Install dependencies
cd backend-clean
npm install

# Set up environment
cp .env.example .env
# Edit .env with production values


# No database migrations in demo mode
# (This repo’s demo backend uses in-memory storage; no PostgreSQL/Prisma required)

# Install PM2
npm install -g pm2

# Start application
pm2 start src/index.ts --name advancia-backend
pm2 save
pm2 startup
```

### 3. Configure Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
cd frontend-clean
vercel link

# Get project details
vercel project ls
# Note the Project ID and Org ID

# Add to GitHub secrets:
# VERCEL_TOKEN - Get from vercel.com/account/tokens
# VERCEL_ORG_ID - From vercel project ls
# VERCEL_PROJECT_ID - From vercel project ls
```

### 4. Configure Cloudflare Worker

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Get account ID
wrangler whoami
# Note the Account ID

# Add to GitHub secrets:
# CLOUDFLARE_API_TOKEN - Your existing token
# CLOUDFLARE_ACCOUNT_ID - From wrangler whoami
```

## Testing the Workflow

### Test Locally

```bash
# Install act (GitHub Actions local runner)
# https://github.com/nektos/act

# Run workflow locally
act push
```

### Test on GitHub

```bash
# Make a small change
echo "# Test" >> README.md

# Commit and push
git add README.md
git commit -m "Test CI/CD pipeline"
git push origin master

# Check Actions tab on GitHub
# https://github.com/advancia-devuser/advanciapayledger-1/actions
```

## Workflow Status Badges

Add to your README.md:

```markdown
![Deploy Status](https://github.com/advancia-devuser/advanciapayledger-1/workflows/Deploy%20Advancia%20Pay%20Ledger/badge.svg)
```

## Troubleshooting

### Backend Deployment Fails

**Issue:** SSH connection fails
```bash
# Verify SSH key is correct
# Check server firewall allows GitHub Actions IPs
# Test SSH connection manually
```

**Issue:** PM2 restart fails
```bash
# SSH into server
pm2 list
pm2 logs advancia-backend
# Check for errors
```

### Frontend Deployment Fails

**Issue:** Vercel token invalid
```bash
# Generate new token at vercel.com/account/tokens
# Update GitHub secret
```

**Issue:** Build fails
```bash
# Check build logs in GitHub Actions
# Verify environment variables are set
# Test build locally: npm run build
```

### Email Worker Deployment Fails

**Issue:** Wrangler authentication fails
```bash
# Verify CLOUDFLARE_API_TOKEN has correct permissions
# Check CLOUDFLARE_ACCOUNT_ID is correct
```

## Manual Deployment

If automated deployment fails, deploy manually:

### Backend
```bash
ssh user@server
cd /var/www/advancia-backend
git pull
npm install
pm2 restart advancia-backend
```

### Frontend
```bash
cd frontend-clean
vercel --prod
```

### Email Worker
```bash
wrangler deploy cloudflare-email-worker.js
```

## Monitoring

**GitHub Actions:**
- https://github.com/advancia-devuser/advanciapayledger-1/actions

**Vercel Deployments:**
- https://vercel.com/dashboard

**Cloudflare Workers:**
- https://dash.cloudflare.com → Workers & Pages

**Backend Logs:**
```bash
ssh user@server
pm2 logs advancia-backend
```

## Best Practices

1. **Always test locally before pushing**
2. **Use feature branches for development**
3. **Only push to master when ready to deploy**
4. **Monitor deployment logs**
5. **Keep secrets secure and rotated**
6. **Test rollback procedures**

## Rollback Procedure

### Backend
```bash
ssh user@server
cd /var/www/advancia-backend
git log --oneline -10  # Find previous commit
git checkout <commit-hash>
npm install
pm2 restart advancia-backend
```

### Frontend
```bash
# Go to Vercel dashboard
# Find previous deployment
# Click "Promote to Production"
```

## Support

For issues with CI/CD pipeline:
- Check GitHub Actions logs
- Review this documentation
- Contact: admin@advanciapayledger.com
