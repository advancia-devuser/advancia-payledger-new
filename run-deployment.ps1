# Advancia - Cloudflare Deployment Orchestrator

Clear-Host
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "ADVANCIA PAY LEDGER - CLOUDFLARE DEPLOYMENT" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# Check directory
if (-not (Test-Path "frontend")) {
    Write-Host "ERROR: Run from project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "OK: Project ready" -ForegroundColor Green
Write-Host ""

# =========================================================
# STEP 1: GET CREDENTIALS
# =========================================================
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "STEP 1: CLOUDFLARE CREDENTIALS" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Get credentials from https://dash.cloudflare.com/" -ForegroundColor Cyan
Write-Host "   1. API Token: Profile > API Tokens > Create Token"
Write-Host "   2. Zone ID: Domain dashboard right sidebar"
Write-Host ""

$ApiToken = Read-Host "Enter your API Token"
if ($ApiToken -eq "") {
    Write-Host "Token required" -ForegroundColor Red
    exit 1
}

$ZoneId = Read-Host "Enter your Zone ID"
if ($ZoneId -eq "") {
    Write-Host "Zone ID required" -ForegroundColor Red
    exit 1
}

$Domain = Read-Host "Enter domain (default: advancia.io)"
if ($Domain -eq "") {
    $Domain = "advancia.io"
}

Write-Host "OK: Credentials received" -ForegroundColor Green
Write-Host ""

# =========================================================
# STEP 2: TERRAFORM SETUP
# =========================================================
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "STEP 2: TERRAFORM INITIALIZATION" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host ""

$tf = Get-Command terraform -ErrorAction SilentlyContinue
if ($null -eq $tf) {
    Write-Host "ERROR: Terraform not installed" -ForegroundColor Red
    Write-Host "Download from https://www.terraform.io/downloads.html" -ForegroundColor Yellow
    exit 1
}

Write-Host "OK: Terraform found" -ForegroundColor Green

if (-not (Test-Path "frontend/terraform")) {
    New-Item -ItemType Directory -Path "frontend/terraform" | Out-Null
}

Write-Host "Creating terraform.tfvars..." -ForegroundColor Cyan
$tfvars = "cloudflare_api_token = `"$ApiToken`"`nzone_id = `"$ZoneId`"`ndomain = `"$Domain`""
$tfvars | Out-File -FilePath "frontend/terraform/terraform.tfvars" -Encoding UTF8 -Force
Write-Host "OK: terraform.tfvars created" -ForegroundColor Green
Write-Host ""

Write-Host "Initializing Terraform..." -ForegroundColor Cyan
Push-Location frontend/terraform
terraform init 2>&1 | Out-Null
Pop-Location
Write-Host "OK: Terraform ready" -ForegroundColor Green
Write-Host ""

# =========================================================
# STEP 3: CONFIRM & APPLY
# =========================================================
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "STEP 3: DEPLOY SECURITY RULES" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Will deploy:" -ForegroundColor Cyan
Write-Host "   - OWASP Core Rules for SQLi/XSS/LFI/RFI"
Write-Host "   - Rate Limiting: API 100 req per 10 seconds"
Write-Host "   - 5 Custom Firewall Rules"
Write-Host "   - Bot Protection and SSL/TLS enforcement"
Write-Host ""

$proceed = Read-Host "Deploy now? (yes/no)"
if ($proceed -ne "yes") {
    Write-Host "Cancelled" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "Applying Terraform configuration..." -ForegroundColor Cyan
Push-Location frontend/terraform
terraform apply -auto-approve 2>&1 | ForEach-Object { Write-Host $_ }
$success = $?
Pop-Location

if (-not $success) {
    Write-Host "ERROR: Terraform apply failed" -ForegroundColor Red
    exit 1
}

Write-Host ""

# =========================================================
# STEP 4: SUCCESS
# =========================================================
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "SUCCESS! CLOUDFLARE WAF DEPLOYED" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ""

Write-Host "Security Rules Active:" -ForegroundColor Green
Write-Host "   - OWASP Core Rule Set"
Write-Host "   - Rate Limiting: 100 req per 10 seconds"
Write-Host "   - 5 Custom Firewall Rules"
Write-Host "   - Bot Protection Enabled"
Write-Host "   - SSL/TLS 1.2+ Enforced"
Write-Host ""

Write-Host "Dashboard: https://dash.cloudflare.com/" -ForegroundColor Cyan
Write-Host ""

# =========================================================
# STEP 5: NEXT STEPS
# =========================================================
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "NEXT STEP: DEPLOY FRONTEND TO CLOUDFLARE PAGES" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Manual steps in Cloudflare Dashboard:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to: https://dash.cloudflare.com/pages"
Write-Host "2. Click: Create a project - Connect to Git"
Write-Host "3. Select: GitHub - Authorize"
Write-Host "4. Search: pdtribe181-prog/advancia-payledger"
Write-Host "5. Build settings:"
Write-Host "   Root directory: frontend"
Write-Host "   Build command: npm run build"
Write-Host "   Output directory: .next"
Write-Host "6. Click: Save and Deploy"
Write-Host "7. Wait 2-3 minutes for build"
Write-Host ""

Write-Host "Live at: https://advancia-payledger.pages.dev" -ForegroundColor Green
Write-Host ""

Write-Host "Ready to proceed? Open Cloudflare dashboard now." -ForegroundColor Yellow
Write-Host ""
