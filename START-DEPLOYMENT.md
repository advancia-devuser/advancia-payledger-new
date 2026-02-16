# 🚀 START HERE - Deployment Guide

**Choose your deployment path:**

---

## ⭐ Recommended: Cloudflare Pages + Supabase

**Best for:** Production deployment, no server management, free hosting

**Time:** ~10 minutes  
**Cost:** $0/month  
**Difficulty:** ⭐ Easy

👉 **[Follow the Deployment Checklist](./DEPLOY_CHECKLIST.md)**

Or read the **[Complete Cloudflare Pages Guide](./DEPLOY_CLOUDFLARE.md)**

### What you get:
- ✅ Both domains work: `advanciapayledger.com` + `advancia.us`
- ✅ Automatic SSL/HTTPS
- ✅ Global CDN (fast worldwide)
- ✅ Clean user dashboards
- ✅ Admin-only user visibility
- ✅ Auto-deploy on git push
- ✅ No server maintenance

---

## 🖥️ Alternative: VPS Deployment

**Best for:** Full control, custom backend

**Time:** ~30 minutes  
**Cost:** ~$5/month  
**Difficulty:** ⭐⭐⭐ Advanced

👉 **[VPS Deployment Instructions](./VPS_DEPLOY_INSTRUCTIONS.md)**

### What you get:
- ✅ Self-hosted backend + frontend
- ✅ Full server access
- ✅ In-memory or database storage
- ✅ Custom domain via Nginx

---

## 🧑‍💻 Local Development

**Quick start:**

```bash
# Supabase mode (recommended)
cd frontend
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
npm install
npm run dev
```

**Or demo mode (no database):**

```bash
npm run setup:demo
npm run demo
```

Frontend: http://localhost:3000  
Backend: http://localhost:4000

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md) | ✅ Step-by-step deployment checklist |
| [DEPLOY_CLOUDFLARE.md](./DEPLOY_CLOUDFLARE.md) | 📖 Complete Cloudflare Pages guide |
| [VPS_DEPLOY_INSTRUCTIONS.md](./VPS_DEPLOY_INSTRUCTIONS.md) | 🖥️ VPS deployment (advanced) |
| [README.md](./README.md) | 📘 Full project documentation |
| [supabase/REGISTERED_USERS.sql](./supabase/REGISTERED_USERS.sql) | 🗄️ Database setup for Supabase |
| [frontend/.env.example](./frontend/.env.example) | ⚙️ Environment variables template |

---

## 🆘 Need Help?

- **Can't decide?** → Use Cloudflare Pages + Supabase (free, easy, fast)
- **Build fails?** → Check the troubleshooting section in deployment docs
- **Questions?** → Open an issue on GitHub

---

**Ready to deploy? Start with the [Deployment Checklist](./DEPLOY_CHECKLIST.md)** ✅
