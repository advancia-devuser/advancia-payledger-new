# React Native Environment Verification
Write-Host "🔍 Verifying React Native development environment..." -ForegroundColor Green

Write-Host "☕ Checking Java..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1
    Write-Host "✅ Java: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Java not found" -ForegroundColor Red
}

Write-Host "📦 Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found" -ForegroundColor Red
}

Write-Host "📱 Checking Android SDK..." -ForegroundColor Yellow
if (Test-Path $env:ANDROID_HOME) {
    Write-Host "✅ Android SDK found at: $env:ANDROID_HOME" -ForegroundColor Green
} else {
    Write-Host "❌ Android SDK not found" -ForegroundColor Red
}

Write-Host "🔧 Checking React Native CLI..." -ForegroundColor Yellow
try {
    $rnCliVersion = npx react-native --version
    Write-Host "✅ React Native CLI: $rnCliVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ React Native CLI not found" -ForegroundColor Red
}

Write-Host "🚀 Checking Expo CLI..." -ForegroundColor Yellow
try {
    $expoVersion = npx expo --version
    Write-Host "✅ Expo CLI: $expoVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Expo CLI not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "📱 Running React Native doctor..." -ForegroundColor Yellow
npx react-native doctor

pause
