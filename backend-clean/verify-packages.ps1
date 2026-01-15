# Package Verification Script
# Verifies that unused packages are removed and new packages are added

Write-Host "🔍 Verifying Package Cleanup..." -ForegroundColor Cyan
Write-Host ""

$removedPackages = @("firebase-admin", "node-vault", "twitter-api-v2")
$addedPackages = @("qrcode", "@types/qrcode")

# Check removed packages
Write-Host "Checking REMOVED packages:" -ForegroundColor Yellow
foreach ($pkg in $removedPackages) {
    $nodeModulesPath = "node_modules\$pkg"
    if (Test-Path $nodeModulesPath) {
        Write-Host "  ❌ $pkg - Still exists in node_modules" -ForegroundColor Red
    } else {
        Write-Host "  ✅ $pkg - Removed" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Checking ADDED packages:" -ForegroundColor Yellow
foreach ($pkg in $addedPackages) {
    $nodeModulesPath = "node_modules\$($pkg.Replace('@types/', ''))"
    if (Test-Path $nodeModulesPath) {
        Write-Host "  ✅ $pkg - Installed" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $pkg - Not found in node_modules" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Checking package.json:" -ForegroundColor Yellow
$packageJson = Get-Content package.json | ConvertFrom-Json

# Check removed in package.json
foreach ($pkg in $removedPackages) {
    if ($packageJson.dependencies.PSObject.Properties.Name -contains $pkg) {
        Write-Host "  ❌ $pkg - Still in dependencies" -ForegroundColor Red
    } elseif ($packageJson.devDependencies.PSObject.Properties.Name -contains $pkg) {
        Write-Host "  ❌ $pkg - Still in devDependencies" -ForegroundColor Red
    } else {
        Write-Host "  ✅ $pkg - Removed from package.json" -ForegroundColor Green
    }
}

# Check added in package.json
foreach ($pkg in $addedPackages) {
    $isInDeps = $packageJson.dependencies.PSObject.Properties.Name -contains $pkg
    $isInDevDeps = $packageJson.devDependencies.PSObject.Properties.Name -contains $pkg
    
    if ($isInDeps -or $isInDevDeps) {
        Write-Host "  ✅ $pkg - In package.json" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $pkg - Missing from package.json" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "  Run 'npm install' if you see any issues above"
Write-Host ""
