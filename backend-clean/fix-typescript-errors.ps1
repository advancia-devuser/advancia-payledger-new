# Fix TypeScript implicit 'any' type errors
$files = @(
    "src/services/adminAnalytics.ts",
    "src/services/advancedPaymentProcessing.ts",
    "src/services/blockchainService.ts",
    "src/services/crypto-safety.service.ts",
    "src/services/currencyService.ts"
)

foreach ($file in $files) {
    $filePath = Join-Path $PSScriptRoot $file
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Fix common patterns
        $content = $content -replace '\.map\(\(sum,', '.map((sum: any,'
        $content = $content -replace '\.map\(\(pm\)', '.map((pm: any)'
        $content = $content -replace '\.map\(\(sb\)', '.map((sb: any)'
        $content = $content -replace '\.map\(\(rd\)', '.map((rd: any)'
        $content = $content -replace '\.map\(\(u\)', '.map((u: any)'
        $content = $content -replace '\.map\(\(user\)', '.map((user: any)'
        $content = $content -replace '\.map\(\(cb\)', '.map((cb: any)'
        $content = $content -replace '\.map\(\(tx\)', '.map((tx: any)'
        $content = $content -replace '\.map\(\(log\)', '.map((log: any)'
        $content = $content -replace '\.map\(\(stat\)', '.map((stat: any)'
        $content = $content -replace '\.map\(\(contract\)', '.map((contract: any)'
        $content = $content -replace '\.forEach\(\(currency\)', '.forEach((currency: any)'
        $content = $content -replace '\.then\(\(logs\)', '.then((logs: any)'
        $content = $content -replace 'async \(tx\) =>', 'async (tx: any) =>'
        $content = $content -replace '\(sum, pm\) =>', '(sum: any, pm: any) =>'
        $content = $content -replace '\(sum, rd\) =>', '(sum: any, rd: any) =>'
        $content = $content -replace '\(sum, cb\) =>', '(sum: any, cb: any) =>'
        
        Set-Content $filePath -Value $content -NoNewline
        Write-Host "Fixed: $file" -ForegroundColor Green
    } else {
        Write-Host "Not found: $file" -ForegroundColor Yellow
    }
}

Write-Host "`nAll service files fixed!" -ForegroundColor Cyan
