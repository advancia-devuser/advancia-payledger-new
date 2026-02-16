# Deploy to Cloudflare Pages + Supabase

**No VPS required** — This guide deploys the frontend to Cloudflare Pages with Supabase Auth + DB.

## ✅ Prerequisites

1. [Supabase account](https://supabase.com) (free tier works)
2. [Cloudflare account](https://cloudflare.com) with domains `advanciapayledger.com` and `advancia.us`
3. GitHub repo connected

---

## Step 1: Supabase Setup

### A. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create new project
3. Note your **Project URL** and **anon (public) key**

### B. Run SQL Setup

1. Supabase → **SQL Editor**
2. Copy/paste entire file: `supabase/REGISTERED_USERS.sql`
3. Click **Run**

This creates:
- `registered_users` table (admin-only visible)
- Trigger to auto-insert on signup
- Row-level security policies

### C. Configure Auth (Recommended)

For demo/testing, disable email confirmation:

1. Supabase → **Authentication** → **Providers** → enable **Email**
2. Supabase → **Authentication** → **Email Auth** → **Confirm email** → toggle OFF

*(This lets users login immediately after signup without email verification)*

### D. Get Your Keys

Copy these for Cloudflare Pages env vars:

- **NEXT_PUBLIC_SUPABASE_URL**: `https://xxxxx.supabase.co`
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (anon/public key)

---

## Step 2: Cloudflare Pages

### A. Create Pages Project

1. Cloudflare → **Pages** → **Create a project**
2. **Connect to Git** → select your GitHub repo
3. **Production branch**: `main`

### B. Build Settings

- **Framework preset**: None (or Next.js if available)
- **Root directory**: `frontend`
- **Build command**: `npm run build`
- **Build output directory**: `.next`

### C. Environment Variables

Add these in **Settings** → **Environment variables** → **Production**:

| Variable | Value | Example |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | `eyJhbGci...` |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Admin email(s), comma-separated | `admin@advanciapayledger.com` |
| `CANONICAL_HOST` | Primary domain (redirects others) | `advanciapayledger.com` |

### D. Deploy

Click **Save and Deploy**

First build takes ~2-3 minutes.

---

## Step 3: Custom Domains

### A. Add Both Domains

In Cloudflare Pages → **Custom domains**:

1. Add `advanciapayledger.com`
2. Add `www.advanciapayledger.com`
3. Add `advancia.us`
4. Add `www.advancia.us`

Cloudflare will auto-create DNS records.

### B. Set Primary Domain

- **Primary domain**: `advanciapayledger.com`

The `CANONICAL_HOST` env var will redirect:
- `advancia.us` → `advanciapayledger.com`
- `www.advanciapayledger.com` → `advanciapayledger.com`
- `www.advancia.us` → `advanciapayledger.com`

### C. Clean Up Old DNS

In Cloudflare → **DNS** (for each domain):

- Remove any `A` or `AAAA` records pointing to the VPS IP (`76.13.77.8`)
- Keep only the Pages-managed `CNAME` records

---

## Step 4: Verify Deployment

### Test URLs

Visit all 4 domains — they should all redirect to `https://advanciapayledger.com`:

- ✅ `https://advanciapayledger.com`
- ✅ `https://www.advanciapayledger.com` → redirects
- ✅ `https://advancia.us` → redirects
- ✅ `https://www.advancia.us` → redirects

### Test Auth Flow

1. Go to `/dashboard`
2. Click **Register**
3. Create account (email + password)
4. Should login immediately (if email confirmation disabled in Supabase)
5. See clean dashboard with empty balances
6. Logout

### Test Admin Panel

1. Login as `admin@advanciapayledger.com`
2. Go to `/admin`
3. Should see list of registered users
4. Non-admin emails won't see the list (access denied)

---

## Supabase Admin Panel Check

Verify the trigger is working:

1. Supabase → **Table Editor** → `registered_users`
2. You should see rows for every user who registered
3. Admin can query this; frontend RLS blocks non-admin reads

---

## Optional: Analytics & Monitoring

### Cloudflare Web Analytics (free)

1. Cloudflare → **Web Analytics** → add site
2. Add the analytics script to `frontend/app/layout.tsx` (optional)

### Supabase Logs

1. Supabase → **Logs** → **Postgres Logs** (check for auth/DB errors)
2. Supabase → **Auth** → **Users** (see all signups)

---

## Troubleshooting

### Build fails on Cloudflare Pages

1. Check **Build logs** in Pages deployment
2. Common issues:
   - Missing env vars → re-add them in Pages settings
   - Node version mismatch → Pages usually auto-detects from `package.json` engines

### Supabase Auth not working

1. Verify Supabase URL/key are correct in Pages env vars
2. Check browser console for errors
3. Supabase → **Auth** → **Users** to see if signup attempted
4. Supabase → **Logs** → **Auth Logs** for detailed errors

### Admin panel shows "Not authorized"

1. Login email must exactly match `NEXT_PUBLIC_ADMIN_EMAILS`
2. Email is case-insensitive in the code
3. Check browser console for token/auth errors

### Domains not redirecting

1. Verify `CANONICAL_HOST=advanciapayledger.com` is set in Pages env vars
2. Redeploy after adding the env var (Pages builds are immutable)
3. Clear browser cache or test in incognito

### Old VPS still serving traffic

1. Delete or disable DNS `A` records pointing to `76.13.77.8`
2. DNS propagation can take 5-60 minutes
3. Use `nslookup advanciapayledger.com` to verify DNS points to Cloudflare

---

## Security Notes

- ✅ Supabase anon key is **safe to expose** in frontend (RLS enforces security)
- ✅ Never commit `.env` files with secrets
- ✅ Admin emails list is public in `NEXT_PUBLIC_ADMIN_EMAILS`, but that's OK (RLS checks actual JWT)
- ✅ Supabase service role key must **never** go in frontend env vars

---

## Cost Estimate

| Service | Tier | Cost |
|---------|------|------|
| Cloudflare Pages | Free | $0/month (500 builds/month) |
| Cloudflare DNS | Free | $0/month |
| Supabase | Free | $0/month (up to 50k MAU, 500 MB DB) |
| **Total** | | **$0/month** for demo/small projects |

---

## What's Next?

- Add more features to the dashboard
- Integrate payments (e.g., Stripe) if needed
- Add transaction history (store in Supabase tables)
- Set up monitoring alerts (Cloudflare + Supabase)

**No VPS management, no backend server, fully serverless.** 🚀
