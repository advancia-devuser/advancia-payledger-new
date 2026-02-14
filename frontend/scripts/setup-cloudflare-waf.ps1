# PowerShell script to set up Cloudflare WAF security
# Run: ./setup-cloudflare-waf.ps1

Write-Host "=========================================="
Write-Host "Cloudflare WAF Security Setup"
Write-Host "Advancia Pay Ledger"
Write-Host "=========================================="

# Check if Terraform is installed
if (-not (Get-Command terraform -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Terraform not found. Installing via Chocolatey..."
    if (Get-Command choco -ErrorAction SilentlyContinue) {
        choco install terraform -y
    } else {
        Write-Host "Please install Terraform from: https://www.terraform.io/downloads.html"
        exit 1
    }
}

# Get Cloudflare credentials
Write-Host ""
Write-Host "📝 Enter your Cloudflare credentials:"
$apiToken = Read-Host "Enter API Token"
$zoneId = Read-Host "Enter Zone ID"
$domain = Read-Host "Enter Domain (e.g., advancia.io)"

# Create terraform.tfvars
$tfvarsContent = @"
cloudflare_api_token = "$apiToken"
zone_id              = "$zoneId"
domain               = "$domain"
"@

Write-Host ""
Write-Host "💾 Creating terraform.tfvars..."
if (-not (Test-Path "terraform")) {
    New-Item -ItemType Directory -Path "terraform" | Out-Null
}
$tfvarsContent | Out-File -FilePath "terraform\terraform.tfvars" -Encoding UTF8

Write-Host ""
Write-Host "⚙️  Initializing Terraform..."
Set-Location terraform
terraform init

Write-Host ""
Write-Host "📋 Terraform Plan (showing what will be created):"
terraform plan

Write-Host ""
$confirm = Read-Host "Do you want to apply these changes? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "❌ Cancelled. No changes applied."
    Set-Location ..
    exit 0
}

Write-Host ""
Write-Host "🚀 Applying Cloudflare WAF configuration..."
terraform apply -auto-approve

Set-Location ..

Write-Host ""
Write-Host "✅ Cloudflare WAF Security Setup Complete!"
Write-Host ""
Write-Host "========== SUMMARY =========="
Write-Host "✓ OWASP Core Rule Set: ENABLED"
Write-Host "✓ Rate Limiting: CONFIGURED"
Write-Host "  - API: 100 req/10sec"
Write-Host "  - Login: 5 req/min"
Write-Host "  - Payments: 50 req/min"
Write-Host "✓ Firewall Rules: 5 custom rules"
Write-Host "  - SQL Injection blocking"
Write-Host "  - XSS protection"
Write-Host "  - Authorization enforcement"
Write-Host "  - AI bot blocking"
Write-Host "  - Geo-restrictions"
Write-Host "✓ Bot Management: ENABLED"
Write-Host "✓ SSL/TLS: CONFIGURED (1.2+)"
Write-Host "✓ Cache: OPTIMIZED"
Write-Host ""
Write-Host "🔗 View in Cloudflare Dashboard:"
Write-Host "   https://dash.cloudflare.com/"
Write-Host ""
Write-Host "📊 Monitor at:"
Write-Host "   Security → WAF → Security Events"
Write-Host ""
