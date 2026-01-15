# Deploy Advancia Pay Ledger Frontend to Vercel
Write-Host "🚀 Deploying Advancia Pay Ledger Frontend to Vercel..." -ForegroundColor Cyan

# Get the script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Navigate to frontend directory
$frontendPath = Join-Path $scriptPath "github-repo\frontend"

if (Test-Path $frontendPath) {
    Write-Host "✓ Found frontend directory" -ForegroundColor Green
    Set-Location $frontendPath
    
    Write-Host "`n📦 Deploying to Vercel (Production)..." -ForegroundColor Cyan
    Write-Host "This may take a few minutes..." -ForegroundColor Yellow
    
    # Deploy to Vercel production
    vercel --prod
    
    Write-Host "`n✅ Deployment initiated!" -ForegroundColor Green
    Write-Host "Check the Vercel dashboard for deployment status." -ForegroundColor Cyan
} else {
    Write-Host "❌ Frontend directory not found at: $frontendPath" -ForegroundColor Red
    exit 1
}
