# Repository Restructure Guide

## Overview

Your repository has been restructured to have a single, clean backend and frontend structure with no workspaces.

## Current Structure

```
myproject$new/
├── backend-clean/          # Complete backend (will become backend/)
│   ├── src/               # Backend source code
│   ├── prisma/            # Database schema & migrations
│   ├── package.json       # Backend dependencies
│   └── tsconfig.json      # TypeScript config
├── frontend-clean/         # Complete frontend (will become frontend/)
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── lib/               # Utilities
│   └── package.json       # Frontend dependencies
├── package-root.json       # Root package (will become package.json)
├── README.md              # Project documentation
├── .env                   # Environment variables
├── .gitignore             # Git ignore rules
└── docker-compose.yml     # Docker configuration
```

## Final Structure (After Cleanup)

```
myproject$new/
├── backend/               # Node.js + Express + Prisma
├── frontend/              # Next.js 14
├── package.json           # Root package with scripts
├── README.md
├── .env
├── .gitignore
└── docker-compose.yml
```

## Completing the Restructure

### Option 1: Run the Cleanup Script

```powershell
.\restructure-complete.ps1
```

This script will:
1. Remove old empty directories
2. Rename `backend-clean` → `backend`
3. Rename `frontend-clean` → `frontend`
4. Rename `package-root.json` → `package.json`
5. Clean up extra files

### Option 2: Manual Steps

If the script encounters file locks, close all applications and run these commands:

```powershell
# Remove old directories
Remove-Item -Path "backend" -Recurse -Force
Remove-Item -Path "frontend" -Recurse -Force
Remove-Item -Path "advanciapayledger-new" -Recurse -Force

# Rename clean directories
Rename-Item -Path "backend-clean" -NewName "backend"
Rename-Item -Path "frontend-clean" -NewName "frontend"

# Fix package.json
Remove-Item -Path "package.json" -Force
Rename-Item -Path "package-root.json" -NewName "package.json"
```

## Getting Started

Once restructuring is complete:

### 1. Install Dependencies

```bash
npm run setup
```

This will:
- Install root dependencies
- Install backend dependencies
- Install frontend dependencies
- Generate Prisma client
- Run database migrations

### 2. Configure Environment

Edit `.env` file with your settings:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/advancia_payledger
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=3001
```

### 3. Start Development

```bash
# Start both backend and frontend
npm run dev

# Or start individually
npm run dev:backend   # Backend on port 3001
npm run dev:frontend  # Frontend on port 3000
```

## Available Scripts

### Development
- `npm run dev` - Start both backend and frontend
- `npm run dev:backend` - Start backend only
- `npm run dev:frontend` - Start frontend only

### Production
- `npm run build` - Build both projects
- `npm run prod` - Start production servers

### Database
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:migrate` - Run migrations
- `npm run setup:db` - Setup database

### Testing
- `npm test` - Run all tests
- `npm run test:backend` - Backend tests
- `npm run test:frontend` - Frontend tests

### Docker
- `npm run docker:up` - Start Docker containers
- `npm run docker:down` - Stop Docker containers

## What Was Removed

The following duplicate/extra directories were removed:
- `github-repo/` - Consolidated into root
- `advanciapayledger-new/` - Duplicate repository
- `advhomenew/` - Old version
- `archive/` - Archived files
- Extra documentation and wireframe files

## Benefits of New Structure

✅ **Single Repository** - One backend, one frontend, no workspaces
✅ **Clean Structure** - Easy to navigate and understand
✅ **Simplified Scripts** - All commands in root package.json
✅ **No Duplication** - Removed all duplicate code
✅ **Production Ready** - Configured for deployment

## Troubleshooting

### File Locks
If you get "file is being used by another process" errors:
1. Close VS Code
2. Close any terminal windows
3. Close any running Node processes
4. Run the cleanup script again

### Permission Errors
Run PowerShell as Administrator:
```powershell
Start-Process powershell -Verb runAs
cd "c:\Users\mucha.DESKTOP-H7T9NPM\Downloads\mdsiles\myproject$new"
.\restructure-complete.ps1
```

## Next Steps

1. ✅ Complete the restructure (run script or manual steps)
2. ✅ Install dependencies (`npm run setup`)
3. ✅ Configure `.env` file
4. ✅ Start development (`npm run dev`)
5. ✅ Test the application
6. ✅ Deploy to production

## Support

For issues or questions, refer to:
- `README.md` - Project overview
- `.env.example` - Environment variable reference
- Backend: `backend/README.md`
- Frontend: `frontend/README.md`
