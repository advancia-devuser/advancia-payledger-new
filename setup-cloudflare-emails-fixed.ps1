# Cloudflare Email Routing Setup Script - PowerShell Version
# Domain: advanciapayledger.com
# Zone ID: 0bff66558872c58ed5b8b7942acc34d9

# ⚠️ CHANGE THIS TO YOUR REAL EMAIL!
$DESTINATION_EMAIL = Read-Host "Enter your email address (e.g., your-email@gmail.com)"

$ZONE_ID = "0bff66558872c58ed5b8b7942acc34d9"
$API_TOKEN = "5tovG0IhoVoeZ2y-fNaEyFkmTBahLJUiIvlhihQ-"
$DOMAIN = "advanciapayledger.com"

Write-Host "============================================" -ForegroundColor Blue
Write-Host "Cloudflare Email Routing Setup" -ForegroundColor Blue
Write-Host "============================================" -ForegroundColor Blue
Write-Host ""

if ([string]::IsNullOrWhiteSpace($DESTINATION_EMAIL)) {
    Write-Host "[ERROR] Email address is required!" -ForegroundColor Red
    exit 1
}

if ($DESTINATION_EMAIL -notmatch "@") {
    Write-Host "[ERROR] Please enter a valid email address!" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Verifying Cloudflare API token..." -ForegroundColor Blue
$headers = @{
    "Authorization" = "Bearer $API_TOKEN"
    "Content-Type" = "application/json"
}

try {
    $verify = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/user/tokens/verify" -Method Get -Headers $headers
    if ($verify.success) {
        Write-Host "[SUCCESS] API token verified successfully" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] API token verification failed" -ForegroundColor Red
        Write-Host $verify
        exit 1
    }
} catch {
    Write-Host "[ERROR] Failed to verify API token: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[INFO] Enabling email routing for zone..." -ForegroundColor Blue
try {
    $enable = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/email/routing/enable" -Method Post -Headers $headers
    if ($enable.success) {
        Write-Host "[SUCCESS] Email routing enabled" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] Email routing response: $($enable.errors)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[WARNING] Email routing may already be enabled" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[INFO] Creating destination address: $DESTINATION_EMAIL" -ForegroundColor Blue
$destinationBody = @{
    email = $DESTINATION_EMAIL
} | ConvertTo-Json

try {
    $destination = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/email/routing/addresses" -Method Post -Headers $headers -Body $destinationBody
    if ($destination.success) {
        Write-Host "[SUCCESS] Destination address created" -ForegroundColor Green
        Write-Host "[WARNING] Check your email for verification link!" -ForegroundColor Yellow
    } else {
        Write-Host "[INFO] Destination address may already exist" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[INFO] Destination address may already exist" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press Enter after you've verified your email..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "[INFO] Creating email forwarding rules..." -ForegroundColor Blue

$emails = @("livechat", "support", "billing", "admin", "noreply", "info")

foreach ($email in $emails) {
    $ruleBody = @{
        matchers = @(
            @{
                type = "literal"
                field = "to"
                value = "$email@$DOMAIN"
            }
        )
        actions = @(
            @{
                type = "forward"
                value = @($DESTINATION_EMAIL)
            }
        )
        enabled = $true
        name = "Forward $email to destination"
    } | ConvertTo-Json -Depth 10

    try {
        $result = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/email/routing/rules" -Method Post -Headers $headers -Body $ruleBody
        if ($result.success) {
            Write-Host "[SUCCESS] Created: $email@$DOMAIN" -ForegroundColor Green
        } else {
            Write-Host "[ERROR] Failed: $email@$DOMAIN - $($result.errors)" -ForegroundColor Red
        }
    } catch {
        Write-Host "[ERROR] Failed: $email@$DOMAIN - $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "[INFO] Fetching all email routing rules..." -ForegroundColor Blue
try {
    $rules = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/email/routing/rules" -Method Get -Headers $headers
    
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "Setup Complete!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Active Email Addresses:" -ForegroundColor Blue
    
    if ($rules.result) {
        foreach ($rule in $rules.result) {
            if ($rule.matchers -and $rule.matchers.Count -gt 0) {
                $toEmail = $rule.matchers[0].value
                Write-Host "  $toEmail -> $DESTINATION_EMAIL" -ForegroundColor Green
            }
        }
    }
    
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Test by sending email to: livechat@$DOMAIN"
    Write-Host "  2. Update Tawk.to with: livechat@$DOMAIN"
    Write-Host "  3. Update backend email config"
    Write-Host ""
    Write-Host "All emails will forward to: $DESTINATION_EMAIL" -ForegroundColor Green
} catch {
    $errorMsg = $_.Exception.Message
    Write-Host "[ERROR] Failed to fetch rules: $errorMsg" -ForegroundColor Red
}
