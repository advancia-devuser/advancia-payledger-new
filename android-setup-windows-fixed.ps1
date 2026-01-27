# Android Studio Setup Script for Windows
# Run as Administrator in PowerShell

Write-Host "🤖 ANDROID STUDIO AUTOMATED SETUP" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

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
} else {
    Write-Host "✅ Chocolatey already installed" -ForegroundColor Green
}

# Step 2: Install Java JDK
Write-Host "☕ Installing Java JDK..." -ForegroundColor Yellow
choco install jdk17 -y
refreshenv

# Step 3: Install Android Studio
Write-Host "📱 Installing Android Studio..." -ForegroundColor Yellow
choco install androidstudio -y
refreshenv

# Step 4: Set Environment Variables
Write-Host "🔧 Setting up environment variables..." -ForegroundColor Yellow

$androidSdkPath = "$env:LOCALAPPDATA\Android\Sdk"
[Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidSdkPath, "User")
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $androidSdkPath, "User")

$newPath = $env:Path + ";" + $androidSdkPath + "\platform-tools;" + $androidSdkPath + "\tools"
[Environment]::SetEnvironmentVariable("Path", $newPath, "User")

# Step 5: Create Desktop Setup Script
$desktopScript = @"
# Android Studio Emulator Setup
# Run this after Android Studio installation

Write-Host "📱 Setting up Android Emulator..." -ForegroundColor Green

# Start Android Studio
Start-Process "$env:LOCALAPPDATA\Android\android-studio\bin\studio64.exe"

Write-Host "⏳ Please complete these steps in Android Studio:" -ForegroundColor Yellow
Write-Host "1. Complete initial setup wizard" -ForegroundColor White
Write-Host "2. Install Android SDK (API 33)" -ForegroundColor White
Write-Host "3. Create AVD (Virtual Device)" -ForegroundColor White
Write-Host "4. Choose Pixel 6 with API 33" -ForegroundColor White
Write-Host "5. Start the emulator" -ForegroundColor White

Write-Host "🚀 After emulator is running, test React Native:" -ForegroundColor Green
Write-Host "cd mobile-app; npm run android" -ForegroundColor Cyan

pause
"@

$desktopScript | Out-File -FilePath "$env:USERPROFILE\Desktop\setup-android-emulator.ps1" -Encoding UTF8

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host "📁 Created emulator setup script on Desktop" -ForegroundColor Green
Write-Host "🔄 Please restart your computer" -ForegroundColor Yellow
Write-Host "📱 Then run the desktop script to set up emulator" -ForegroundColor Yellow

Write-Host ""
Write-Host "🎯 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Restart computer" -ForegroundColor White
Write-Host "2. Run: $env:USERPROFILE\Desktop\setup-android-emulator.ps1" -ForegroundColor White
Write-Host "3. Test: cd mobile-app; npm run android" -ForegroundColor White

pause
