# Deploy to Hostinger VPS - Step by Step

## Option 0: Supabase + Cloudflare Pages (No VPS) — Recommended if VPS is unstable

This project supports a **Supabase-first** mode (no backend server required) using:
- Supabase Auth (signup/login)
- Supabase table `registered_users` for the admin-only list

### Step A: Create Supabase DB objects

In Supabase → SQL Editor, run:
- `supabase/REGISTERED_USERS.sql`

### Step B: Supabase Auth settings (demo recommended)

For a simple demo flow:
- Supabase → Authentication → Settings → disable “Confirm email” (optional but recommended)

### Step C: Deploy frontend to Cloudflare Pages

Cloudflare → Pages → Create project (connect GitHub) and set:
- **Root directory**: `frontend`
- **Build command**: `npm run build`
- **Build output directory**: `.next`

Add these Environment Variables in Cloudflare Pages:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ADMIN_EMAILS=admin@advanciapayledger.com`

Optional (recommended): force a single canonical domain so both domains work cleanly:
- `CANONICAL_HOST=advanciapayledger.com`

### Step D: Attach both domains

In Cloudflare Pages → Custom domains add:
- `advanciapayledger.com`
- `www.advanciapayledger.com`
- `advancia.us`
- `www.advancia.us`

Set the primary domain to `advanciapayledger.com`.

Important: In Cloudflare DNS, remove any `A/AAAA` records for these hostnames that point to the VPS IP.

## Your VPS Details
- **IP:** 76.13.77.8
- **Password:** *(do not store plaintext passwords in repository files)*

Use SSH keys or your password manager for credentials. If a password was previously committed, rotate it immediately.

## Option 1: Demo Deploy (No Database) — Recommended

This repository’s default demo stack uses **in-memory storage** (no Postgres/Mongo required):
- Backend API: port **4000**
- Frontend: port **3000**

For a demo, prefer running Node directly with a process manager (PM2) instead of Docker.

### One-command deploy (Recommended)

After extracting the repo to `/root/advanciapayledger-new`:

```bash
cd /root/advanciapayledger-new
chmod +x scripts/vps-demo-deploy.sh scripts/vps-demo-verify.sh

# Optional: set PUBLIC_HOST so CORS is strict instead of '*'
PUBLIC_HOST=76.13.77.8 ./scripts/vps-demo-deploy.sh

# Verify
./scripts/vps-demo-verify.sh
```

### Step 1: Package your project
Run this on your Windows machine:

```powershell
cd C:\Users\mucha.DESKTOP-H7T9NPM\Downloads\mdsiles\myproject$new
tar -czf advancia-deploy.tar.gz advanciapayledger-new/
```

### Step 2: Upload to VPS
```powershell
scp advancia-deploy.tar.gz root@76.13.77.8:/root/
```

### Step 3: SSH into VPS and deploy
```bash
ssh root@76.13.77.8

# Extract files
cd /root
tar -xzf advancia-deploy.tar.gz
cd advanciapayledger-new

# Install Node.js (example: Node 24.x) + build tools
apt-get update
apt-get install -y curl ca-certificates git build-essential
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt-get install -y nodejs

# Install dependencies
cd backend
npm ci
npm run build

# Create backend env (demo only)
cat > .env << 'EOF'
PORT=4000
NODE_ENV=production
CORS_ORIGIN=http://76.13.77.8:3000
JWT_SECRET=change-me-for-demo
DEMO_SEED=false
# Admin can see registered users at /admin
ADMIN_EMAILS=admin@advanciapayledger.com
EOF

cd ../frontend
npm ci
npm run build

# Install PM2 and start services
npm install -g pm2
pm2 start "npm --prefix /root/advanciapayledger-new/backend start" --name advancia-backend
BACKEND_URL=http://127.0.0.1:4000 pm2 start "npm --prefix /root/advanciapayledger-new/frontend start -- -p 3000" --name advancia-frontend
pm2 save
pm2 startup

# Check status/logs
pm2 status
pm2 logs advancia-backend
```

Your app will be available at:
- Frontend: http://76.13.77.8:3000
- Backend API: http://76.13.77.8:4000

## Option 2: Docker (Not recommended for demo)

There is a full Docker + Postgres + Redis stack under `backend-deploy/`, but it’s for a more complex deployment.
For “no real database, just demo”, Option 1 is simpler and aligns with the current in-memory backend.

## Option 3: Setup Nginx for custom domain

### Cloudflare DNS (required)

In Cloudflare → DNS:
- Add an `A` record:
	- **Name**: your subdomain (example: `app`)
	- **IPv4**: your VPS IP
	- **Proxy**: ON (orange cloud) is fine

Wait for DNS to propagate.

```bash
# From repo root on the VPS:
cd /root/advanciapayledger-new
chmod +x scripts/vps-nginx-domain.sh

# Configure Nginx to proxy:
#   /      -> frontend (3000)
#   /api/* -> backend (4000)
DOMAIN=app.yourdomain.com ./scripts/vps-nginx-domain.sh

# Optional: enable SSL (recommended)
EMAIL=you@example.com DOMAIN=app.yourdomain.com ./scripts/vps-nginx-domain.sh
```

## Troubleshooting

If Docker fails to build:
```bash
docker compose down
docker compose up -d --build --no-cache
docker logs advancia-backend
docker logs advancia-frontend
```

If ports are in use:
```bash
# Check what's using the port
netstat -tulpn | grep :3000
# Kill the process or change ports in docker-compose.yml
```

## Security Note
⚠️ Change your VPS root password after deployment:
```bash
passwd
```
