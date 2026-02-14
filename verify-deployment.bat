@echo off
REM Windows Deployment Verification Script
REM Checks if all recommended security measures are working

echo.
echo ==========================================
echo Advancia Pay Ledger - Security Verification
echo ==========================================
echo.

setlocal enabledelayedexpansion

set DOMAIN=%1
if "%DOMAIN%"=="" set DOMAIN=advancia-payledger.pages.dev

echo Testing domain: %DOMAIN%
echo.

REM Test 1: Frontend is live
echo Checking frontend availability...
curl -I https://%DOMAIN% >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Frontend is live
) else (
    echo [FAILED] Frontend not responding
)

REM Test 2: OWASP Protection
echo.
echo Checking OWASP protection...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" "https://%DOMAIN%/api?id=1' OR '1'='1"
echo [INFO] Check for 403 (blocked) response above

REM Test 3: Rate Limiting
echo.
echo Checking rate limiting...
echo Sending 110 requests...
setlocal enabledelayedexpansion
set count=0
for /L %%A in (1,1,110) do (
    curl -s -o nul "https://%DOMAIN%/api/test" >nul 2>&1
    set /a count+=1
)
echo [OK] Sent %count% requests (check for 429 responses in Cloudflare logs)

REM Test 4: SSL/TLS
echo.
echo Checking SSL/TLS configuration...
curl -I https://%DOMAIN% 2>nul | findstr /i "strict-transport-security"
if %errorlevel%==0 (
    echo [OK] HSTS enabled (SSL/TLS enforced)
) else (
    echo [INFO] HSTS may not be visible in basic check
)

REM Test 5: Response Time
echo.
echo Checking response time...
for /f %%A in ('curl -w "%%{time_total}" -o nul -s https://%DOMAIN%') do (
    echo [OK] Response time: %%A seconds
)

echo.
echo ==========================================
echo Verification Summary
echo ==========================================
echo.
echo Next Steps:
echo 1. Check Cloudflare Dashboard: https://dash.cloudflare.com/
echo 2. Go to: Security ^> Event Log
echo 3. Verify blocked requests are logged
echo 4. Monitor for 24 hours
echo 5. Adjust rate limits if needed
echo.
echo Your site is live at: https://%DOMAIN%
echo.
