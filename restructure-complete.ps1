# Restructure Repository - Complete Cleanup Script
# Run this script to finalize the repository structure

Write-Host "=== Advancia Pay Ledger - Repository Restructure ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Remove old empty directories
Write-Host "Step 1: Removing old directories..." -ForegroundColor Yellow
if (Test-Path "backend") {
    Remove-Item -Path "backend" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Removed old backend directory" -ForegroundColor Green
}
if (Test-Path "frontend") {
    Remove-Item -Path "frontend" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Removed old frontend directory" -ForegroundColor Green
}
if (Test-Path "advanciapayledger-new") {
    Remove-Item -Path "advanciapayledger-new" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Removed advanciapayledger-new directory" -ForegroundColor Green
}

# Step 2: Rename clean directories
Write-Host ""
Write-Host "Step 2: Renaming clean directories..." -ForegroundColor Yellow
if (Test-Path "backend-clean") {
    Rename-Item -Path "backend-clean" -NewName "backend" -Force
    Write-Host "  ✓ Renamed backend-clean to backend" -ForegroundColor Green
}
if (Test-Path "frontend-clean") {
    Rename-Item -Path "frontend-clean" -NewName "frontend" -Force
    Write-Host "  ✓ Renamed frontend-clean to frontend" -ForegroundColor Green
}

# Step 3: Fix package.json
Write-Host ""
Write-Host "Step 3: Updating root package.json..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Remove-Item -Path "package.json" -Force
}
if (Test-Path "package-root.json") {
    Rename-Item -Path "package-root.json" -NewName "package.json" -Force
    Write-Host "  ✓ Updated root package.json" -ForegroundColor Green
}

# Step 4: Remove extra markdown files (optional)
Write-Host ""
Write-Host "Step 4: Cleaning up extra documentation files..." -ForegroundColor Yellow
$extraDocs = @(
    "Advancia-Investor-Email-Templates.md",
    "Advancia-Investor-Executive-Summary.docx",
    "Advancia-Investor-One-Pager.html",
    "Advancia-Investor-Outreach-Action-Plan.md",
    "Advancia-Scalability-Plan.md",
    "advancia-vision-2126",
    "advancia_2126.html",
    "console-app",
    "files (21).zip",
    "files-extracted",
    "website-structure-app",
    "wireframes"
)

foreach ($item in $extraDocs) {
    if (Test-Path $item) {
        Remove-Item -Path $item -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  ✓ Removed $item" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "=== Restructure Complete! ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your repository now has a clean structure:" -ForegroundColor White
Write-Host "  📁 backend/     - Node.js + Express + Prisma backend" -ForegroundColor White
Write-Host "  📁 frontend/    - Next.js 14 frontend" -ForegroundColor White
Write-Host "  📄 package.json - Root package with scripts" -ForegroundColor White
Write-Host "  📄 README.md    - Project documentation" -ForegroundColor White
Write-Host "  📄 .env         - Environment variables" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Run: npm run setup" -ForegroundColor White
Write-Host "  2. Configure your .env file" -ForegroundColor White
Write-Host "  3. Run: npm run dev" -ForegroundColor White
Write-Host ""
