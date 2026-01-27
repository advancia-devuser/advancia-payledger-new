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
try {
    if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
        Write-Host "📦 Installing Chocolatey..." -ForegroundColor Yellow
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        refreshenv
    } else {
        Write-Host "✅ Chocolatey already installed" -ForegroundColor Green
    }
}
catch {
    Write-Host "❌ Chocolatey installation failed" -ForegroundColor Red
    Write-Host "Please install manually from: https://chocolatey.org/install" -ForegroundColor Yellow
}

# Step 2: Install Java JDK
try {
    Write-Host "☕ Installing Java JDK..." -ForegroundColor Yellow
    choco install jdk17 -y
    refreshenv
    Write-Host "✅ Java JDK installed" -ForegroundColor Green
}
catch {
    Write-Host "❌ Java JDK installation failed" -ForegroundColor Red
    Write-Host "Please install manually: choco install jdk17 -y" -ForegroundColor Yellow
}

# Step 3: Install Android Studio
try {
    Write-Host "📱 Installing Android Studio..." -ForegroundColor Yellow
    choco install androidstudio -y
    refreshenv
    Write-Host "✅ Android Studio installed" -ForegroundColor Green
}
catch {
    Write-Host "❌ Android Studio installation failed" -ForegroundColor Red
    Write-Host "Please install manually: choco install androidstudio -y" -ForegroundColor Yellow
}

# Step 4: Set Environment Variables
try {
    Write-Host "🔧 Setting up environment variables..." -ForegroundColor Yellow
    
    $androidSdkPath = "$env:LOCALAPPDATA\Android\Sdk"
    [Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidSdkPath, "User")
    [Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $androidSdkPath, "User")
    
    $platformToolsPath = $androidSdkPath + "\platform-tools"
    $toolsPath = $androidSdkPath + "\tools"
    $newPath = $env:Path + ";" + $platformToolsPath + ";" + $toolsPath
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    
    Write-Host "✅ Environment variables set" -ForegroundColor Green
}
catch {
    Write-Host "❌ Environment variables setup failed" -ForegroundColor Red
    Write-Host "Please set manually: ANDROID_HOME, ANDROID_SDK_ROOT, and update PATH" -ForegroundColor Yellow
}

# Step 5: Create Desktop Setup Script
try {
    $desktopScriptContent = @"
# Android Studio Emulator Setup
# Run this after Android Studio installation

Write-Host "📱 Setting up Android Emulator..." -ForegroundColor Green

# Start Android Studio
Start-Process "`$env:LOCALAPPDATA\Android\android-studio\bin\studio64.exe"

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

    $desktopScriptContent | Out-File -FilePath "$env:USERPROFILE\Desktop\setup-android-emulator.ps1" -Encoding UTF8
    Write-Host "✅ Created emulator setup script on Desktop" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to create desktop script" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Setup process completed!" -ForegroundColor Green
Write-Host "🔄 Please restart your computer" -ForegroundColor Yellow
Write-Host "📱 Then run the desktop script to set up emulator" -ForegroundColor Yellow

Write-Host ""
Write-Host "🎯 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Restart computer" -ForegroundColor White
Write-Host "2. Run: $env:USERPROFILE\Desktop\setup-android-emulator.ps1" -ForegroundColor White
Write-Host "3. Test: cd mobile-app; npm run android" -ForegroundColor White

Write-Host ""
Write-Host "📁 Installation locations:" -ForegroundColor Yellow
Write-Host "- Android Studio: $env:LOCALAPPDATA\Android\android-studio" -ForegroundColor White
Write-Host "- Android SDK: $env:LOCALAPPDATA\Android\Sdk" -ForegroundColor White

pause
