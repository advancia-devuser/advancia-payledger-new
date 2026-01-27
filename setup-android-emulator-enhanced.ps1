# Enhanced Android Studio Emulator Setup
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
Write-Host "Scan QR code with Expo Go app" -ForegroundColor Cyan

Write-Host ""
Write-Host "🔧 Additional setup commands:" -ForegroundColor Yellow
Write-Host "adb devices" -ForegroundColor Cyan
Write-Host "npx react-native doctor" -ForegroundColor Cyan
Write-Host "npx expo doctor" -ForegroundColor Cyan

pause
