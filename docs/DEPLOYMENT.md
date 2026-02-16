# Deployment Guide - Advancia PayLedger

## Table of Contents

- [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
- [Backend Deployment](#backend-deployment)
- [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
- [Environment Configuration](#environment-configuration)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring & Logging](#monitoring--logging)

## Frontend Deployment (Vercel)

### Prerequisites

- Vercel account (free tier available)
- GitHub repository connected to Vercel
- Domain name (optional)

### Step-by-Step Deployment

#### Option 1: Vercel Dashboard (Recommended)

1. **Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Choose the `frontend` folder as root directory

3. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://api.advanciapayledger.com
   NEXT_PUBLIC_APP_URL=https://www.advanciapayledger.com
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~45 seconds)
   - Access your deployed site

#### Option 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy from frontend directory**
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Follow prompts**
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No (first time)
   - Project name: advancia-payledger
   - Directory: `./`
   - Production: Yes

### Custom Domain Setup

1. **In Vercel Dashboard**
   - Go to Project Settings → Domains
   - Add domain: `www.advanciapayledger.com`

2. **Configure DNS**
   Add these records in your domain registrar:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Verify Domain**
   - Wait for DNS propagation (5-30 minutes)
   - Vercel will auto-issue SSL certificate

## Backend Deployment

### Option 1: VPS/Cloud Server (DigitalOcean, AWS EC2, etc.)

#### 1. Server Setup

```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 24.x
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Install MongoDB (or use Atlas)
# Install Nginx for reverse proxy
apt install -y nginx
```

#### 2. Deploy Backend Code

```bash
# Clone repository
git clone https://github.com/advancia-devuser/advancia-payledger-new.git
cd advancia-payledger-new/backend

# Install dependencies
npm install

# Create .env file
nano .env
# Add your environment variables

# Build TypeScript
npm run build

# Start with PM2
pm2 start dist/index.js --name advancia-backend
pm2 save
pm2 startup
```

#### 3. Configure Nginx

```bash
# Create Nginx config
nano /etc/nginx/sites-available/advancia-api
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name api.advanciapayledger.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/advancia-api /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Install SSL with Let's Encrypt
apt install certbot python3-certbot-nginx -y
certbot --nginx -d api.advanciapayledger.com
```

### Option 2: Vercel (Serverless Functions)

**Note**: Backend would need to be refactored into serverless functions.

```bash
cd backend
vercel --prod
```

### Option 3: Heroku

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create advancia-backend

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
# ... add all env vars

# Deploy
git push heroku master

# Check logs
heroku logs --tail
```

## Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Cluster

1. **Sign up** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Create Cluster**
   - Choose FREE tier (M0)
   - Select cloud provider (AWS recommended)
   - Choose region closest to your backend server
   - Cluster name: `advancia-cluster`

### 2. Configure Database Access

1. **Create Database User**
   - Security → Database Access
   - Add New Database User
   - Username: `advancia_admin`
   - Password: Generate secure password
   - Database User Privileges: Read and write to any database

2. **Network Access**
   - Security → Network Access
   - Add IP Address
   - Allow access from anywhere: `0.0.0.0/0` (for testing)
   - Or add specific IPs for production security

### 3. Get Connection String

1. **Connect to Cluster**
   - Deployment → Database → Connect
   - Connect your application
   - Copy connection string:
   ```
   mongodb+srv://advancia_admin:<password>@advancia-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

2. **Update .env file**
   ```
   MONGODB_URI=mongodb+srv://advancia_admin:your_password@advancia-cluster.xxxxx.mongodb.net/advanciapayledger?retryWrites=true&w=majority
   ```

### 4. Initialize Collections

Collections are automatically created when first accessed. Alternatively, run:

```bash
# Start backend in development
npm run dev

# Collections will be created on first API call
```

## Environment Configuration

### Production Environment Variables

#### Frontend (.env.production)

```env
NEXT_PUBLIC_API_URL=https://api.advanciapayledger.com
NEXT_PUBLIC_APP_URL=https://www.advanciapayledger.com
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_production_project_id
NEXT_PUBLIC_INFURA_KEY=your_production_infura_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
```

#### Backend (.env)

```env
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/advancia
MONGODB_DB_NAME=advanciapayledger
FRONTEND_URL=https://www.advanciapayledger.com
CORS_ORIGIN=https://www.advanciapayledger.com
JWT_SECRET=super_secret_production_key_change_this
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_SECRET
RESEND_API_KEY=re_your_production_key
FROM_EMAIL=noreply@advanciapayledger.com
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your_project_id
WALLET_PRIVATE_KEY=your_secure_private_key
API_RATE_LIMIT=100
```

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ master ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Vercel CLI
        run: npm install -g vercel
        
      - name: Deploy to Vercel
        run: |
          cd frontend
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/advancia-backend
            git pull origin master
            npm install
            npm run build
            pm2 restart advancia-backend
```

## Monitoring & Logging

### Vercel Analytics

Automatically enabled for production deployments. View in Vercel Dashboard.

### Backend Monitoring (PM2)

```bash
# View logs
pm2 logs advancia-backend

# Monitor processes
pm2 monit

# View status
pm2 status
```

### Error Tracking (Sentry - Optional)

1. **Sign up** at [sentry.io](https://sentry.io)
2. **Install SDK**
   ```bash
   npm install @sentry/node
   ```
3. **Initialize in backend**
   ```typescript
   import * as Sentry from '@sentry/node';
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

## Health Checks

### Frontend Health
```bash
curl https://www.advanciapayledger.com
```

### Backend Health
```bash
curl https://api.advanciapayledger.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-15T10:30:00.000Z",
  "database": "connected"
}
```

## Rollback Procedures

### Frontend Rollback (Vercel)

1. Go to Vercel Dashboard → Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

### Backend Rollback

```bash
# SSH into server
ssh root@your-server-ip

# Go to backend directory
cd /var/www/advancia-backend

# Checkout previous version
git log --oneline
git checkout <commit-hash>

# Rebuild and restart
npm run build
pm2 restart advancia-backend
```

## Troubleshooting

### Common Issues

**1. Build Failures**
- Check Node.js version (should be 18.x+)
- Verify all dependencies are installed
- Check for TypeScript errors

**2. Database Connection Issues**
- Verify MongoDB URI is correct
- Check network access settings in MongoDB Atlas
- Ensure IP whitelist includes your server

**3. CORS Errors**
- Verify `CORS_ORIGIN` matches frontend URL
- Check backend is running and accessible

**4. SSL Certificate Issues**
- Ensure DNS records are correctly configured
- Wait for DNS propagation (up to 48 hours)
- Try reissuing certificate with `certbot renew`

---

**Need Help?** Contact devops@advanciapayledger.com
