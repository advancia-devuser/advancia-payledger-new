# 🚀 Cloudflare Pages + Supabase Deployment Checklist

Quick reference for deploying to production. **Time: ~10 minutes**

---

## ☁️ Supabase Setup

### 1. Create Project
- [ ] Go to [app.supabase.com](https://app.supabase.com)
- [ ] Click **New Project**
- [ ] Name: `advancia-payledger`
- [ ] Password: (choose strong password)
- [ ] Region: (closest to your users)
- [ ] Click **Create new project**
- [ ] Wait ~2 minutes for provisioning

### 2. Copy Your Keys
- [ ] Go to **Settings** → **API**
- [ ] Copy **Project URL** → `https://xxxxx.supabase.co`
- [ ] Copy **anon public** key → `eyJhbGci...`
- [ ] Save both in a text file temporarily

### 3. Run SQL Setup
- [ ] Go to **SQL Editor**
- [ ] Click **New query**
- [ ] Open `supabase/REGISTERED_USERS.sql` from this repo
- [ ] Copy all SQL code
- [ ] Paste in Supabase SQL Editor
- [ ] Click **Run** (green play button)
- [ ] Verify: "Success. No rows returned"

### 4. Configure Auth (Optional but Recommended)
- [ ] Go to **Authentication** → **Providers**
- [ ] Verify **Email** is enabled (green toggle)
- [ ] Go to **Authentication** → **Email Auth**
- [ ] Toggle **OFF**: "Confirm email"
- [ ] Click **Save**

**Why?** Users can login immediately after signup (for demo/testing)

---

## ☁️ Cloudflare Pages

### 1. Connect GitHub
- [ ] Go to [dash.cloudflare.com](https://dash.cloudflare.com)
- [ ] Click **Workers & Pages**
- [ ] Click **Create application**
- [ ] Click **Pages** tab
- [ ] Click **Connect to Git**
- [ ] Authorize Cloudflare with GitHub
- [ ] Select repo: `advancia-payledger-new`

### 2. Build Configuration
- [ ] **Production branch**: `main`
- [ ] **Framework preset**: None (or Next.js)
- [ ] **Root directory**: `frontend`
- [ ] **Build command**: `npm run build`
- [ ] **Build output directory**: `.next`

### 3. Environment Variables
Click **Add variable** for each:

| Variable Name | Value |
|--------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Paste your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Paste your Supabase anon key |
| `NEXT_PUBLIC_ADMIN_EMAILS` | `admin@advanciapayledger.com` |
| `CANONICAL_HOST` | `advanciapayledger.com` |

- [ ] Click **Save and Deploy**

### 4. Wait for Build
- [ ] First build takes ~2-3 minutes
- [ ] Status should show: ✅ **Deployed**
- [ ] Copy the Pages URL: `https://xxxx.pages.dev`

---

## 🌐 Custom Domains

### 1. Add Primary Domain
- [ ] In Pages project → **Custom domains**
- [ ] Click **Set up a custom domain**
- [ ] Enter: `advanciapayledger.com`
- [ ] Click **Continue**
- [ ] Cloudflare will auto-configure DNS
- [ ] Wait 1-2 minutes for activation

### 2. Add www Subdomain
- [ ] Click **Set up a custom domain** again
- [ ] Enter: `www.advanciapayledger.com`
- [ ] Click **Continue**
- [ ] Wait for activation

### 3. Add Secondary Domain
- [ ] Click **Set up a custom domain** again
- [ ] Enter: `advancia.us`
- [ ] Click **Continue**

- [ ] Click **Set up a custom domain** again
- [ ] Enter: `www.advancia.us`
- [ ] Click **Continue**

### 4. Set Primary
- [ ] Next to `advanciapayledger.com` → click ⋮ (three dots)
- [ ] Click **Set as primary domain**

### 5. Clean Up Old DNS (Important!)
- [ ] Go to Cloudflare **DNS** for `advanciapayledger.com`
- [ ] Delete any `A` or `AAAA` records pointing to `76.13.77.8`
- [ ] Keep only Pages `CNAME` records
- [ ] Repeat for `advancia.us`

---

## ✅ Test Deployment

### Test All Domains
Visit each URL — should all redirect to `https://advanciapayledger.com`:

- [ ] `https://advanciapayledger.com` → ✅ Shows homepage
- [ ] `https://www.advanciapayledger.com` → ✅ Redirects to primary
- [ ] `https://advancia.us` → ✅ Redirects to primary
- [ ] `https://www.advancia.us` → ✅ Redirects to primary

### Test Auth Flow
- [ ] Go to `https://advanciapayledger.com/dashboard`
- [ ] Click **Register**
- [ ] Fill form: email + password + name
- [ ] Click **Register**
- [ ] Should show: "Welcome, [Your Name]!"
- [ ] See clean dashboard with 0 balances
- [ ] Click **Logout**

### Test Admin Panel
- [ ] Go to `https://advanciapayledger.com/dashboard`
- [ ] Login as: `admin@advanciapayledger.com` (create account if not exists)
- [ ] Visit `https://advanciapayledger.com/admin`
- [ ] Should see table with registered users
- [ ] See your account email + name + user ID

### Test Non-Admin
- [ ] Logout
- [ ] Register new account with different email
- [ ] Visit `/admin`
- [ ] Should see: "Not authorized"

---

## 🔍 Verify Supabase

### Check Users Table
- [ ] Go to Supabase → **Table Editor**
- [ ] Click `registered_users` table
- [ ] Should see rows for each registered user
- [ ] Columns: `user_id`, `email`, `first_name`, `last_name`, `created_at`

### Check Auth
- [ ] Go to Supabase → **Authentication** → **Users**
- [ ] Should see all users who registered
- [ ] Email, created date, last sign-in

---

## 🎉 Done!

Your app is now live at:
- **Primary**: `https://advanciapayledger.com`
- **Secondary**: `https://advancia.us` (redirects)

**Cost: $0/month** (Cloudflare + Supabase free tiers)

---

## 🆘 Troubleshooting

### Build failed
- [ ] Check build logs in Cloudflare Pages deployment
- [ ] Verify all 4 env vars are set correctly
- [ ] Retry deployment

### Can't login
- [ ] Open browser console (F12)
- [ ] Check for errors
- [ ] Verify Supabase URL/key in Pages env vars
- [ ] Check Supabase → Logs → Auth Logs

### Admin panel says "Not authorized"
- [ ] Login email must be: `admin@advanciapayledger.com`
- [ ] Verify `NEXT_PUBLIC_ADMIN_EMAILS` env var is set
- [ ] Redeploy Pages after adding env var

### Domains not working
- [ ] Wait 5-15 minutes for DNS propagation
- [ ] Check Cloudflare → DNS records
- [ ] Use `nslookup advanciapayledger.com` to verify

### Still seeing VPS site
- [ ] Delete old DNS A records in Cloudflare
- [ ] Clear browser cache
- [ ] Wait for DNS TTL (up to 1 hour)

---

## 📝 Notes

- SSL/HTTPS is automatic (Cloudflare manages certificates)
- No server maintenance required
- Free SSL, CDN, analytics included
- Auto-scaling (handles traffic spikes)
- Git push = auto deploy (after first setup)

---

**Need help?** See [DEPLOY_CLOUDFLARE.md](./DEPLOY_CLOUDFLARE.md) for detailed instructions.
