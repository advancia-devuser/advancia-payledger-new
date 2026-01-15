# Test Cloudflare API permissions
$API_TOKEN = "5tovG0IhoVoeZ2y-fNaEyFkmTBahLJUiIvlhihQ-"
$ZONE_ID = "0bff66558872c58ed5b8b7942acc34d9"

$headers = @{
    "Authorization" = "Bearer $API_TOKEN"
    "Content-Type" = "application/json"
}

Write-Host "Testing API token permissions..." -ForegroundColor Blue

# Test 1: Token verification
Write-Host "1. Token verification..." -ForegroundColor Yellow
try {
    $verify = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/user/tokens/verify" -Method Get -Headers $headers
    Write-Host "   Token verified: $($verify.result.id)" -ForegroundColor Green
    Write-Host "   Permissions:" -ForegroundColor Green
    $verify.result.policies | ForEach-Object {
        Write-Host "     - $($_.permission.id): $($_.effect)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}

# Test 2: Zone access
Write-Host "2. Zone access..." -ForegroundColor Yellow
try {
    $zone = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZONE_ID" -Method Get -Headers $headers
    Write-Host "   Zone: $($zone.result.name)" -ForegroundColor Green
    Write-Host "   Status: $($zone.result.status)" -ForegroundColor Green
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}

# Test 3: Email routing permissions
Write-Host "3. Email routing permissions..." -ForegroundColor Yellow
try {
    $routing = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/email/routing" -Method Get -Headers $headers
    Write-Host "   Email routing enabled: $($routing.result.enabled)" -ForegroundColor Green
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}

# Test 4: Email addresses
Write-Host "4. Email addresses permissions..." -ForegroundColor Yellow
try {
    $addresses = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/email/routing/addresses" -Method Get -Headers $headers
    Write-Host "   Can read addresses: $($addresses.success)" -ForegroundColor Green
    if ($addresses.result) {
        Write-Host "   Existing addresses:" -ForegroundColor Gray
        $addresses.result | ForEach-Object {
            Write-Host "     - $($_.email)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}

# Test 5: Email rules
Write-Host "5. Email rules permissions..." -ForegroundColor Yellow
try {
    $rules = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/email/routing/rules" -Method Get -Headers $headers
    Write-Host "   Can read rules: $($rules.success)" -ForegroundColor Green
    if ($rules.result) {
        Write-Host "   Existing rules: $($rules.result.Count)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}
