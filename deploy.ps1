#!/usr/bin/env powershell
# Advancia Pay Ledger - Complete Deployment Orchestrator

param(
    [string]$ApiToken = "",
    [string]$ZoneId = "",
    [string]$Domain = "advancia.io"
)

Clear-Host
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "ADVANCIA PAY LEDGER - CLOUDFLARE DEPLOYMENT" -ForegroundColor Cyan
Write-Host "Automated Setup Orchestrator" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

# Check if running in correct directory
if (-not (Test-Path "frontend")) {
    Write-Host "ERROR: Must run from project root directory" -ForegroundColor Red
    Write-Host "Expected: frontend/ directory present"
    exit 1
}

Write-Host "[OK] Project directory verified" -ForegroundColor Green
Write-Host ""

# ============================================================================
# PHASE 1: GET CREDENTIALS
# ============================================================================
Write-Host "=======================================================" -ForegroundColor Yellow
Write-Host "PHASE 1: CLOUDFLARE CREDENTIALS" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Yellow
Write-Host ""

if ($ApiToken -eq "") {
    Write-Host "You will need:" -ForegroundColor Cyan
    Write-Host "   1. API Token from: https://dash.cloudflare.com/profile/api-tokens"
    Write-Host "      Create Token, Edit Cloudflare Workers template"
    Write-Host "   2. Zone ID from: Your domain dashboard (right sidebar)"
    Write-Host ""
    
    $continue = Read-Host "Ready to continue? (yes/no)"
    if ($continue -ne "yes") {
        Write-Host "Cancelled" -ForegroundColor Red
        exit 0
    }
    
    Write-Host ""
    $ApiToken = Read-Host "Paste your API Token"
    
    if ($ApiToken -eq "") {
        Write-Host "API Token required" -ForegroundColor Red
        exit 1
    }
}

if ($ZoneId -eq "") {
    $ZoneId = Read-Host "Paste your Zone ID"
    
    if ($ZoneId -eq "") {
        Write-Host "Zone ID required" -ForegroundColor Red
        exit 1
    }
}

Write-Host "[OK] Credentials received" -ForegroundColor Green
Write-Host ""

# ============================================================================
# PHASE 2: TERRAFORM INITIALIZATION
# ============================================================================
Write-Host "=======================================================" -ForegroundColor Yellow
Write-Host "PHASE 2: TERRAFORM SETUP" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Yellow
Write-Host ""

# Check if Terraform exists
Write-Host "Checking Terraform..."
$terraformPath = Get-Command terraform -ErrorAction SilentlyContinue

if ($null -eq $terraformPath) {
    Write-Host "[ERROR] Terraform not found" -ForegroundColor Red
    Write-Host "Install from: https://www.terraform.io/downloads.html" -ForegroundColor Yellow
    Write-Host "Or via Chocolatey: choco install terraform" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Terraform found" -ForegroundColor Green
Write-Host ""

# Create terraform directory if missing
if (-not (Test-Path "frontend/terraform")) {
    New-Item -ItemType Directory -Path "frontend/terraform" | Out-Null
    Write-Host "[OK] Created terraform/ directory" -ForegroundColor Green
}

# Create terraform.tfvars
Write-Host "Creating terraform.tfvars..."
$tfvarsContent = "cloudflare_api_token = `"$ApiToken`"`nzone_id              = `"$ZoneId`"`ndomain               = `"$Domain`""

$tfvarsPath = "frontend/terraform/terraform.tfvars"
$tfvarsContent | Out-File -FilePath $tfvarsPath -Encoding UTF8 -Force

Write-Host "[OK] terraform.tfvars created" -ForegroundColor Green
Write-Host ""

# Initialize Terraform
Write-Host "Initializing Terraform..."
Push-Location frontend/terraform
terraform init 2>&1 | Out-Null
$initSuccess = $?
Pop-Location

if (-not $initSuccess) {
    Write-Host "[ERROR] Terraform init failed" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Terraform initialized" -ForegroundColor Green
Write-Host ""

# ============================================================================
# PHASE 3: TERRAFORM PLAN
# ============================================================================
Write-Host "=======================================================" -ForegroundColor Yellow
Write-Host "PHASE 3: REVIEW SECURITY RULES" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Configuration will add:" -ForegroundColor Cyan
Write-Host "   - OWASP Core Rules (SQLi, XSS, LFI, RFI)"
Write-Host "   - Rate Limiting (API: 100/10s, Login: 5/min, Payments: 50/min)"
Write-Host "   - 5 Custom Firewall Rules (Auth, SQLi, XSS, Bots, Geo)"
Write-Host "   - Bot Management (Block GPTBot, Claude, other AI crawlers)"
Write-Host "   - SSL/TLS 1.2+ Enforcement"
Write-Host "   - Security Headers & HSTS"
Write-Host ""

Write-Host "Estimated Cost: FREE (Cloudflare Free + Pro tier)" -ForegroundColor Green
Write-Host ""

$confirm = Read-Host "Apply these rules? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "❌ Cancelled" -ForegroundColor Red
    exit 0
}

Write-Host ""

# ============================================================================
# PHASE 4: TERRAFORM APPLY
# ============================================================================
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║ PHASE 4: DEPLOYING SECURITY RULES                          ║" -ForegroundColor Yellow
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""

Write-Host "🚀 Applying Terraform configuration..." -ForegroundColor Cyan
Push-Location frontend/terraform
terraform apply -auto-approve
$applySuccess = $?
Pop-Location

if (-not $applySuccess) {
    Write-Host "❌ Terraform apply failed" -ForegroundColor Red
    Write-Host "   Check credentials and try again" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✅ Security rules deployed!" -ForegroundColor Green
Write-Host ""

# ============================================================================
# PHASE 5: DEPLOYMENT SUMMARY
# ============================================================================
Write-Host "=======================================================" -ForegroundColor Green
Write-Host "CLOUDFLARE WAF DEPLOYMENT COMPLETE" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
Write-Host ""

Write-Host "Security Rules Active:" -ForegroundColor Green
Write-Host "   - OWASP Core Rule Set (SQLi, XSS, LFI, RFI)"
Write-Host "   - Rate Limiting: 100 req/10s on API"
Write-Host "   - Custom Firewall Rules: 5 active"
Write-Host "   - Bot Protection: AI crawlers blocked"
Write-Host "   - SSL/TLS: 1.2+ enforced"
Write-Host ""

Write-Host "Dashboard:" -ForegroundColor Green
Write-Host "   Security Log: https://dash.cloudflare.com/?to=/:account/:zone/security/event-log"
Write-Host "   Analytics: https://dash.cloudflare.com/?to=/:account/:zone/analytics/security"
Write-Host ""

# ============================================================================
# PHASE 6: PAGES DEPLOYMENT GUIDE
# ============================================================================
Write-Host "=======================================================" -ForegroundColor Yellow
Write-Host "NEXT STEP: DEPLOY FRONTEND TO CLOUDFLARE PAGES" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Cloudflare Pages Setup (MANUAL):" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to: https://dash.cloudflare.com/pages"
Write-Host "2. Click: 'Create a project' - 'Connect to Git'"
Write-Host "3. Select: GitHub - Authorize"
Write-Host "4. Search: 'pdtribe181-prog/advancia-payledger'"
Write-Host "5. Build settings:"
Write-Host "   - Root directory: frontend"
Write-Host "   - Build command: npm run build"
Write-Host "   - Build output directory: .next"
Write-Host "6. Click: 'Save and Deploy'"
Write-Host "7. Wait: 2-3 minutes for build to complete"
Write-Host ""

Write-Host "Your site will be live at:" -ForegroundColor Green
Write-Host "   https://advancia-payledger.pages.dev" -ForegroundColor Cyan
Write-Host ""

Write-Host "After deployment, verify security:" -ForegroundColor Yellow
Write-Host "   Run: ./verify-deployment.bat advancia-payledger.pages.dev"
Write-Host ""

Write-Host "DEPLOYMENT READY!" -ForegroundColor Green
Write-Host ""
Write-Host "Need help? Check these files:" -ForegroundColor Cyan
Write-Host "   - QUICK_START.md"
Write-Host "   - DEPLOYMENT_CHECKLIST.md"
Write-Host "   - SETUP_CLOUDFLARE_WAF.md"
Write-Host ""
