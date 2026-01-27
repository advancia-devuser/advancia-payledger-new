# Android Studio Setup Script for Windows
# Run as Administrator in PowerShell

Write-Host "ANDROID STUDIO SETUP" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "Please run as Administrator!" -ForegroundColor Red
    pause
    exit
}

Write-Host "Running as Administrator" -ForegroundColor Green

# Step 1: Install Chocolatey
Write-Host "Installing Chocolatey..." -ForegroundColor Yellow
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
refreshenv

# Step 2: Install Java JDK
Write-Host "Installing Java JDK..." -ForegroundColor Yellow
choco install jdk17 -y
refreshenv

# Step 3: Install Android Studio
Write-Host "Installing Android Studio..." -ForegroundColor Yellow
choco install androidstudio -y
refreshenv

# Step 4: Set Environment Variables
Write-Host "Setting environment variables..." -ForegroundColor Yellow
$androidSdkPath = "$env:LOCALAPPDATA\Android\Sdk"
[Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidSdkPath, "User")
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $androidSdkPath, "User")
Write-Host "Environment variables set" -ForegroundColor Green

# Step 5: Create Desktop Setup Script
$desktopScript = @"
# Android Studio Emulator Setup
Write-Host "Setting up Android Emulator..." -ForegroundColor Green
Start-Process "$env:LOCALAPPDATA\Android\android-studio\bin\studio64.exe"
Write-Host "Complete these steps in Android Studio:" -ForegroundColor Yellow
Write-Host "1. Complete initial setup wizard" -ForegroundColor White
Write-Host "2. Install Android SDK (API 33)" -ForegroundColor White
Write-Host "3. Create AVD (Virtual Device)" -ForegroundColor White
Write-Host "4. Choose Pixel 6 with API 33" -ForegroundColor White
Write-Host "5. Start the emulator" -ForegroundColor White
Write-Host "After emulator is running, test: cd mobile-app; npm run android" -ForegroundColor Green
pause
"@

$desktopScript | Out-File -FilePath "$env:USERPROFILE\Desktop\setup-android-emulator.ps1" -Encoding UTF8

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "Please restart your computer" -ForegroundColor Yellow
Write-Host "Then run the desktop script to set up emulator" -ForegroundColor Yellow
Write-Host "Desktop script location: $env:USERPROFILE\Desktop\setup-android-emulator.ps1" -ForegroundColor Cyan

pause
