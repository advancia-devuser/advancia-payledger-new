# Android Studio Setup Script for Windows - Enhanced Version
# Complete React Native Development Environment
# Run as Administrator in PowerShell

Write-Host "🤖 ANDROID STUDIO & REACT NATIVE SETUP" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ Please run as Administrator!" -ForegroundColor Red
    pause
    exit
}

Write-Host "✅ Running as Administrator - Starting setup..." -ForegroundColor Green

# Step 1: Install Chocolatey if not present
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing Chocolatey..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    refreshenv
    Write-Host "✅ Chocolatey installed" -ForegroundColor Green
} else {
    Write-Host "✅ Chocolatey already installed" -ForegroundColor Green
}

# Step 2: Install Java JDK 17
Write-Host "☕ Installing Java JDK 17..." -ForegroundColor Yellow
choco install jdk17 -y
refreshenv

# Step 3: Install Android Studio
Write-Host "📱 Installing Android Studio..." -ForegroundColor Yellow
choco install androidstudio -y
refreshenv

# Step 4: Install Node.js
Write-Host "📦 Installing Node.js..." -ForegroundColor Yellow
choco install nodejs -y
refreshenv

# Step 5: Install Python
Write-Host "🐍 Installing Python..." -ForegroundColor Yellow
choco install python3 -y
refreshenv

# Step 6: Install Git
Write-Host "📥 Installing Git..." -ForegroundColor Yellow
choco install git -y
refreshenv

# Step 7: Set Environment Variables
Write-Host "🔧 Setting up environment variables..." -ForegroundColor Yellow
$androidSdkPath = "$env:LOCALAPPDATA\Android\Sdk"
[Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidSdkPath, "User")
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $androidSdkPath, "User")

$platformToolsPath = $androidSdkPath + "\platform-tools"
$toolsPath = $androidSdkPath + "\tools"
$newPath = $env:Path + ";" + $platformToolsPath + ";" + $toolsPath
[Environment]::SetEnvironmentVariable("Path", $newPath, "User")

Write-Host "✅ Environment variables set" -ForegroundColor Green

# Step 8: Install React Native CLI
Write-Host "📱 Installing React Native CLI..." -ForegroundColor Yellow
npm install -g @react-native-community/cli

# Step 9: Install Expo CLI
Write-Host "🚀 Installing Expo CLI..." -ForegroundColor Yellow
npm install -g @expo/cli

# Step 10: Create enhanced desktop setup script
$desktopScript = @"
# Android Studio Emulator Setup - Enhanced
Write-Host "📱 Setting up Android Emulator..." -ForegroundColor Green

# Start Android Studio
Start-Process "$env:LOCALAPPDATA\Android\android-studio\bin\studio64.exe"

Write-Host "⏳ Please complete these steps in Android Studio:" -ForegroundColor Yellow
Write-Host "1. Complete initial setup wizard" -ForegroundColor White
Write-Host "2. Install Android SDK (API 33, API 34)" -ForegroundColor White
Write-Host "3. Install Android SDK Build-Tools" -ForegroundColor White
Write-Host "4. Install Android SDK Platform-Tools" -ForegroundColor White
Write-Host "5. Install Android Virtual Device (AVD)" -ForegroundColor White
Write-Host "6. Create AVD with these specs:" -ForegroundColor Cyan
Write-Host "   - Device: Pixel 6 or Pixel 6 Pro" -ForegroundColor White
Write-Host "   - System: API 33 (Android 13) or API 34 (Android 14)" -ForegroundColor White
Write-Host "   - Architecture: x86_64 or arm64-v8a" -ForegroundColor White
Write-Host "   - Storage: 2048 MB or higher" -ForegroundColor White
Write-Host "7. Start the emulator" -ForegroundColor White

Write-Host ""
Write-Host "🚀 After emulator is running, test React Native:" -ForegroundColor Green
Write-Host "cd mobile-app" -ForegroundColor Cyan
Write-Host "npm install" -ForegroundColor Cyan
Write-Host "npx react-native run-android" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 OR test with Expo:" -ForegroundColor Green
Write-Host "cd AdvanciaPayLedgerExpo" -ForegroundColor Cyan
Write-Host "npm install" -ForegroundColor Cyan
Write-Host "npx expo start" -ForegroundColor Cyan

pause
"@

$desktopScript | Out-File -FilePath "$env:USERPROFILE\Desktop\setup-android-emulator.ps1" -Encoding UTF8

# Step 11: Create verification script
$verificationScript = @"
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

pause
"@

$verificationScript | Out-File -FilePath "$env:USERPROFILE\Desktop\verify-react-native.ps1" -Encoding UTF8

# Step 12: Display completion message
Write-Host ""
Write-Host "🎉 SETUP COMPLETE!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Android Studio installed" -ForegroundColor Green
Write-Host "✅ Java JDK 17 installed" -ForegroundColor Green
Write-Host "✅ Node.js installed" -ForegroundColor Green
Write-Host "✅ Python 3 installed" -ForegroundColor Green
Write-Host "✅ Git installed" -ForegroundColor Green
Write-Host "✅ React Native CLI installed" -ForegroundColor Green
Write-Host "✅ Expo CLI installed" -ForegroundColor Green
Write-Host "✅ Environment variables configured" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Desktop scripts created:" -ForegroundColor Yellow
Write-Host "1. setup-android-emulator.ps1 - Android Studio and emulator setup" -ForegroundColor White
Write-Host "2. verify-react-native.ps1 - Environment verification" -ForegroundColor White
Write-Host ""
Write-Host "🔄 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Restart your computer" -ForegroundColor White
Write-Host "2. Run: setup-android-emulator.ps1" -ForegroundColor White
Write-Host "3. Run: verify-react-native.ps1" -ForegroundColor White
Write-Host ""
Write-Host "📱 Testing commands:" -ForegroundColor Yellow
Write-Host "- React Native: cd mobile-app && npx react-native run-android" -ForegroundColor White
Write-Host "- Expo: cd AdvanciaPayLedgerExpo && npx expo start" -ForegroundColor White

pause
