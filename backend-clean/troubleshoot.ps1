#!/usr/bin/env pwsh
# Advancia Pay Ledger - Troubleshooting Script (PowerShell)
# Compatible with Windows, Linux, and macOS

Write-Host "🔍 Advancia Pay Ledger - Troubleshooting Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Color output functions
function Write-Success { param($msg) Write-Host "✓ $msg" -ForegroundColor Green }
function Write-Error { param($msg) Write-Host "✗ $msg" -ForegroundColor Red }
function Write-Warning { param($msg) Write-Host "⚠ $msg" -ForegroundColor Yellow }
function Write-Info { param($msg) Write-Host "ℹ $msg" -ForegroundColor Cyan }

# Check Node.js
Write-Host "📦 Checking Node.js..." -ForegroundColor White
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Success "Node.js installed: $nodeVersion"
        
        # Check version compatibility (>= 18.0.0)
        $versionNumber = [version]($nodeVersion -replace 'v', '')
        if ($versionNumber -ge [version]"18.0.0") {
            Write-Success "Version is compatible (>= 18.0.0)"
        } else {
            Write-Error "Node.js version too old. Need >= 18.0.0"
            Write-Host "   Install from: https://nodejs.org" -ForegroundColor Gray
        }
    }
} catch {
    Write-Error "Node.js not installed"
    Write-Host "   Install from: https://nodejs.org" -ForegroundColor Gray
}
Write-Host ""

# Check npm
Write-Host "📦 Checking npm..." -ForegroundColor White
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Success "npm installed: $npmVersion"
    }
} catch {
    Write-Error "npm not installed"
}
Write-Host ""

# Check PostgreSQL
Write-Host "🐘 Checking PostgreSQL..." -ForegroundColor White
try {
    $psqlVersion = psql --version 2>$null
    if ($psqlVersion) {
        Write-Success "PostgreSQL installed: $psqlVersion"
    }
} catch {
    Write-Warning "PostgreSQL not found locally"
    Write-Host "   You can use Docker instead: docker run -d postgres:14-alpine" -ForegroundColor Gray
}
Write-Host ""

# Check Docker
Write-Host "🐳 Checking Docker..." -ForegroundColor White
try {
    $dockerVersion = docker --version 2>$null
    if ($dockerVersion) {
        Write-Success "Docker installed: $dockerVersion"
    }
} catch {
    Write-Warning "Docker not installed (optional)"
}
Write-Host ""

# Check for .env file
Write-Host "⚙️  Checking configuration..." -ForegroundColor White
if (Test-Path ".env") {
    Write-Success ".env file exists"
    
    $envContent = Get-Content ".env" -Raw
    
    if ($envContent -match "DATABASE_URL=") {
        Write-Success "DATABASE_URL is set"
    } else {
        Write-Error "DATABASE_URL not found in .env"
    }
    
    if ($envContent -match "JWT_SECRET=") {
        Write-Success "JWT_SECRET is set"
    } else {
        Write-Error "JWT_SECRET not found in .env"
    }
    
    if ($envContent -match "SENTRY_DSN=") {
        Write-Success "SENTRY_DSN is set"
    } else {
        Write-Warning "SENTRY_DSN not found in .env (optional for development)"
    }
} else {
    Write-Error ".env file not found"
    Write-Host "   Run: Copy-Item .env.example .env" -ForegroundColor Gray
    Write-Host "   Then edit .env with your settings" -ForegroundColor Gray
}
Write-Host ""

# Check node_modules
Write-Host "📚 Checking dependencies..." -ForegroundColor White
if (Test-Path "node_modules") {
    Write-Success "node_modules exists"
} else {
    Write-Warning "node_modules not found"
    Write-Host "   Run: npm install" -ForegroundColor Gray
}
Write-Host ""

# Check Prisma
Write-Host "🔷 Checking Prisma..." -ForegroundColor White
if (Test-Path "node_modules\.bin\prisma" -or Test-Path "node_modules\.bin\prisma.cmd") {
    Write-Success "Prisma installed"
    
    if (Test-Path "node_modules\.prisma\client") {
        Write-Success "Prisma Client generated"
    } else {
        Write-Warning "Prisma Client not generated"
        Write-Host "   Run: npm run prisma:generate" -ForegroundColor Gray
    }
} else {
    Write-Error "Prisma not installed"
    Write-Host "   Run: npm install" -ForegroundColor Gray
}
Write-Host ""

# Check Sentry packages
Write-Host "📊 Checking Sentry..." -ForegroundColor White
if (Test-Path "node_modules\@sentry\node") {
    Write-Success "@sentry/node installed"
} else {
    Write-Warning "@sentry/node not installed"
    Write-Host "   Run: npm install" -ForegroundColor Gray
}
Write-Host ""

# Check TypeScript build
Write-Host "🔨 Checking TypeScript build..." -ForegroundColor White
if (Test-Path "dist") {
    Write-Success "dist folder exists"
} else {
    Write-Warning "dist folder not found"
    Write-Host "   Run: npm run build" -ForegroundColor Gray
}
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "🔧 Quick Fixes:" -ForegroundColor Yellow
Write-Host ""
Write-Host "If you see errors, try these in order:" -ForegroundColor White
Write-Host ""
Write-Host "1. Install dependencies:" -ForegroundColor Cyan
Write-Host "   npm install" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Setup environment:" -ForegroundColor Cyan
Write-Host "   Copy-Item .env.example .env" -ForegroundColor Gray
Write-Host "   # Then edit .env with your database URL and Sentry DSN" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Generate Prisma Client:" -ForegroundColor Cyan
Write-Host "   npm run prisma:generate" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Run migrations:" -ForegroundColor Cyan
Write-Host "   npm run prisma:migrate" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Seed database:" -ForegroundColor Cyan
Write-Host "   npm run prisma:seed" -ForegroundColor Gray
Write-Host ""
Write-Host "6. Start server:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Sentry Error Tracking:" -ForegroundColor Yellow
Write-Host "   - Dashboard: https://sentry.io/organizations/advancia-payledger/" -ForegroundColor Gray
Write-Host "   - DSN configured in .env: SENTRY_DSN" -ForegroundColor Gray
Write-Host "   - Automatic error reporting for 5xx errors" -ForegroundColor Gray
Write-Host "   - Performance monitoring enabled" -ForegroundColor Gray
Write-Host ""
