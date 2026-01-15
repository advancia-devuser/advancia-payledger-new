# 💳 Advancia Pay Ledger

**The complete cryptocurrency payment platform with built-in healthcare management.**

Process crypto payments across 5+ blockchains. Manage medical facilities. Track everything in real-time. All in one system.

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/advancia-devuser/advanciapayledger-new)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-green?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.0-purple?logo=prisma)](https://www.prisma.io/)

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/advancia-devuser/advanciapayledger-new.git
cd advanciapayledger-new

# Backend setup
cd backend
npm install
cp .env.example .env

# Edit .env with your DATABASE_URL and JWT_SECRET
npm run prisma:generate
npm run prisma:migrate
npm run dev

# Frontend setup (in another terminal)
cd frontend
npm install
npm run dev
```

**📚 Full documentation**: [docs/README.md](docs/README.md)

---

## 📊 Project Overview

### Tech Stack

- **Backend**: Node.js 24.x, TypeScript, Express, Prisma ORM
- **Database**: PostgreSQL with comprehensive schema
- **Frontend**: Next.js 14+, React, Tailwind CSS, shadcn/ui
- **Blockchain**: Multi-chain (Ethereum, Polygon, BSC, Arbitrum, Optimism, Stellar)
- **Payments**: Stripe, NOWPayments, crypto wallets
- **Deployment**: DigitalOcean (backend), Vercel (frontend)

### Features

- 🔐 **Authentication**: JWT, 2FA/TOTP, OAuth, session management, SMS verification
- 💰 **Payments**: Stripe, NOWPayments, crypto payments, multi-currency wallets
- 🏥 **Healthcare**: Medical facility management, appointment booking, bed tracking
- 📊 **Analytics**: Real-time KPIs, dashboards, transaction reporting
- 🔒 **Security**: Fraud detection, audit logs, bot protection, compliance
- 🎨 **UI/UX**: Modern design system, responsive layouts, accessibility
- 📱 **Mobile**: Progressive Web App (PWA) support
- ⚡ **Real-time**: Live transaction monitoring, instant notifications

---

## 📁 Project Structure

```
advanciapayledger-new/
├── backend/                # Node.js + Express + Prisma
│   ├── src/
│   │   ├── routes/        # API endpoints (40+ routes)
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Security, auth, validation
│   │   └── lib/           # Core libraries
│   ├── prisma/            # Database schema (80+ models)
│   └── tests/             # Backend tests
├── frontend/              # Next.js 14+ app
│   ├── app/              # App router
│   ├── components/       # React components (50+)
│   └── lib/              # Client utilities
├── docs/                 # 📚 Complete documentation
├── contracts/            # Smart contracts
├── scripts/              # Utility scripts
└── tests/                # E2E tests
```

---

## 🗄️ Database

**80+ Prisma models** covering:

- User management & authentication
- Financial transactions & ledger
- Cryptocurrency operations
- Healthcare (appointments, facilities, beds)
- Payment processing
- Compliance & security
- Notifications & communications
- Analytics & reporting

**View schema**: [backend/prisma/schema.prisma](backend/prisma/schema.prisma)

---

## 🔗 Important Links

- **📚 Documentation**: [docs/README.md](docs/README.md)
- **🚀 Quick Start**: [docs/setup/QUICK_START.md](docs/setup/QUICK_START.md)
- **🏗️ Architecture**: [docs/architecture/](docs/architecture/)
- **🔐 Security**: [docs/architecture/SECURITY.md](docs/architecture/SECURITY.md)
- **🧪 Testing**: [docs/development/TESTING_GUIDE.md](docs/development/TESTING_GUIDE.md)

---

## 🛠️ Development

### Prerequisites

- Node.js 18.x or higher (24.x recommended)
- PostgreSQL 14+
- npm 9+ or yarn

### Environment Variables

```bash
# Minimum required
DATABASE_URL=postgresql://user:pass@localhost:5432/advancia_payledger
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=3001
```

See [.env.example](backend/.env.example) for complete list.

### Available Commands

**Backend**:
```bash
npm run dev              # Development server
npm run build            # Build TypeScript
npm run start:prod       # Production server
npm test                 # Run tests
npm run prisma:studio    # Database GUI
npm run prisma:migrate   # Run migrations
```

**Frontend**:
```bash
npm run dev      # Next.js dev server
npm run build    # Production build
npm run start    # Production server
```

---

## 💼 Healthcare Management

**Complete medical facility operations**:

- Appointment scheduling and booking
- Bed availability tracking (6 bed types)
- Facility management across multiple locations
- Staff coordination and assignments
- Patient record management
- Real-time availability updates

---

## 🔐 Security

- JWT authentication with refresh tokens
- 2FA/TOTP with backup codes
- IP blocking and rate limiting
- Bot detection with ML
- Fraud scoring system
- Comprehensive audit logging
- Role-based access control
- API key management
- Encryption at rest

---

## 📦 Deployment

Configured for:

- **DigitalOcean**: Backend deployment (Node.js + PostgreSQL)
- **Vercel**: Frontend deployment (Next.js)
- **GitHub Actions**: CI/CD pipeline for automated testing and deployment

**📋 Complete Deployment Guides**: 
- [DigitalOcean Droplet Deployment](DROPLET_DEPLOYMENT_GUIDE.md)
- [DigitalOcean Infrastructure Analysis](DIGITALOCEAN_INFRASTRUCTURE_ANALYSIS.md)
- [Deployment Checklist](DEPLOYMENT_CHECKLIST_FINAL.md)

Includes:

- Environment setup (Dev, Staging, Production)
- CI/CD pipeline configuration
- Zero-downtime deployment process
- Rollback strategies
- Monitoring and alerts
- Pre-launch checklist

---

## 🧪 Testing

- **Unit tests**: Jest + TypeScript
- **Integration tests**: Supertest + Prisma
- **E2E tests**: Playwright
- **Coverage**: NYC

Run tests:
```bash
npm test
```

---

## 📝 Documentation

Complete documentation in [docs/](docs/) folder:

- Setup guides
- Architecture documentation
- API reference
- Feature guides
- Development standards
- Deployment guides
- Troubleshooting

**Start here**: [docs/README.md](docs/README.md)

---

## 🤝 Contributing

1. Read [Contributing Guide](docs/development/CONTRIBUTING.md)
2. Follow [Coding Standards](docs/development/CODING_STANDARDS.md)
3. Create feature branch: `git checkout -b feature/amazing-feature`
4. Make changes and commit: `git commit -m 'feat: Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open pull request on GitHub

---

## 📜 License

Proprietary - All rights reserved

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/advancia-devuser/advanciapayledger-new/issues)
- **Documentation**: [docs/](docs/)
- **Troubleshooting**: [docs/operations/TROUBLESHOOTING.md](docs/operations/TROUBLESHOOTING.md)

---

## 🎯 Status

- ✅ **Backend**: Fully implemented with 40+ API routes
- ✅ **Frontend**: Complete with admin dashboard, payment flows, and landing pages
- ✅ **Database**: PostgreSQL with Prisma ORM
- ✅ **Documentation**: Comprehensive guides and deployment strategy
- ✅ **Repository**: GitHub-based with CI/CD
- ✅ **Deployment Strategy**: Interactive HTML guide with checklists
- 🚀 **Ready**: Staging deployment ready

---

## 📊 Recent Updates

### January 14, 2025

- ✅ Migrated to GitHub as primary repository
- ✅ Updated all documentation and references
- ✅ Configured automated CI/CD pipeline with GitHub Actions
- ✅ Ready for deployment

### January 9, 2025

- ✅ Complete frontend implementation (1,690+ files)
- ✅ Interactive deployment strategy document
- ✅ Typography system and documentation
- ✅ Admin dashboard and debugging tools
- ✅ Marketing content and collateral

### January 3, 2025

- ✅ Prisma ORM migration completed
- ✅ Documentation reorganized
- ✅ Backend verified and working

---

**Built with ❤️ by the Advancia team**

_For detailed information, see the [complete documentation](docs/README.md)_
