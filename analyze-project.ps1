# Project Analysis Script - Check for Duplicates and Empty Files
Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host "PROJECT ANALYSIS REPORT" -ForegroundColor Cyan
Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host ""

# Initialize arrays
$emptyFiles = @()
$duplicates = @{}
$filesByHash = @{}
$filesByName = @{}

# Get all files recursively
Write-Host "Scanning project files..." -ForegroundColor Yellow
$allFiles = Get-ChildItem -Path . -File -Recurse -ErrorAction SilentlyContinue | 
    Where-Object { $_.FullName -notmatch '\\node_modules\\' -and 
                   $_.FullName -notmatch '\\\.git\\' -and
                   $_.FullName -notmatch '\\dist\\' -and
                   $_.FullName -notmatch '\\build\\' }

Write-Host "Found $($allFiles.Count) files (excluding node_modules, .git, dist, build)" -ForegroundColor Green
Write-Host ""

# Check for empty files
Write-Host "Checking for empty files..." -ForegroundColor Yellow
foreach ($file in $allFiles) {
    if ($file.Length -eq 0) {
        $emptyFiles += $file.FullName.Replace((Get-Location).Path + "\", "")
    }
}

# Check for duplicate content (by hash)
Write-Host "Checking for duplicate file content..." -ForegroundColor Yellow
foreach ($file in $allFiles) {
    try {
        # Only hash files smaller than 10MB to avoid memory issues
        if ($file.Length -lt 10MB -and $file.Length -gt 0) {
            $hash = (Get-FileHash -Path $file.FullName -Algorithm MD5).Hash
            $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "")
            
            if ($filesByHash.ContainsKey($hash)) {
                $filesByHash[$hash] += $relativePath
            } else {
                $filesByHash[$hash] = @($relativePath)
            }
        }
    } catch {
        # Skip files that can't be hashed
    }
}

# Filter to only duplicates
$duplicatesByContent = $filesByHash.GetEnumerator() | Where-Object { $_.Value.Count -gt 1 }

# Check for duplicate filenames (different locations)
Write-Host "Checking for duplicate filenames..." -ForegroundColor Yellow
foreach ($file in $allFiles) {
    $name = $file.Name
    $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "")
    
    if ($filesByName.ContainsKey($name)) {
        $filesByName[$name] += $relativePath
    } else {
        $filesByName[$name] = @($relativePath)
    }
}

$duplicatesByName = $filesByName.GetEnumerator() | Where-Object { $_.Value.Count -gt 1 }

# Generate Report
Write-Host ""
Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host "RESULTS" -ForegroundColor Cyan
Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host ""

# Empty Files
Write-Host "1. EMPTY FILES ($($emptyFiles.Count) found)" -ForegroundColor Yellow
Write-Host "-" * 80
if ($emptyFiles.Count -gt 0) {
    foreach ($file in $emptyFiles) {
        Write-Host "   - $file" -ForegroundColor Red
    }
} else {
    Write-Host "   No empty files found!" -ForegroundColor Green
}
Write-Host ""

# Duplicate Content
Write-Host "2. DUPLICATE FILE CONTENT ($($duplicatesByContent.Count) groups found)" -ForegroundColor Yellow
Write-Host "-" * 80
if ($duplicatesByContent.Count -gt 0) {
    foreach ($group in $duplicatesByContent) {
        Write-Host "   Group (identical content):" -ForegroundColor Magenta
        foreach ($file in $group.Value) {
            $size = (Get-Item $file -ErrorAction SilentlyContinue).Length
            Write-Host "     - $file (${size} bytes)" -ForegroundColor Red
        }
        Write-Host ""
    }
} else {
    Write-Host "   No duplicate file content found!" -ForegroundColor Green
}
Write-Host ""

# Duplicate Filenames
Write-Host "3. DUPLICATE FILENAMES ($($duplicatesByName.Count) names found)" -ForegroundColor Yellow
Write-Host "-" * 80
if ($duplicatesByName.Count -gt 0) {
    foreach ($group in $duplicatesByName) {
        Write-Host "   Filename: $($group.Key)" -ForegroundColor Magenta
        foreach ($file in $group.Value) {
            Write-Host "     - $file" -ForegroundColor Yellow
        }
        Write-Host ""
    }
} else {
    Write-Host "   No duplicate filenames found!" -ForegroundColor Green
}
Write-Host ""

# Summary
Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host "Total Files Scanned: $($allFiles.Count)" -ForegroundColor White
Write-Host "Empty Files: $($emptyFiles.Count)" -ForegroundColor $(if ($emptyFiles.Count -gt 0) { "Red" } else { "Green" })
Write-Host "Duplicate Content Groups: $($duplicatesByContent.Count)" -ForegroundColor $(if ($duplicatesByContent.Count -gt 0) { "Red" } else { "Green" })
Write-Host "Duplicate Filenames: $($duplicatesByName.Count)" -ForegroundColor $(if ($duplicatesByName.Count -gt 0) { "Yellow" } else { "Green" })
Write-Host ""

# File Type Distribution
Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host "FILE TYPE DISTRIBUTION" -ForegroundColor Cyan
Write-Host "=" * 80 -ForegroundColor Cyan
$fileTypes = $allFiles | Group-Object Extension | Sort-Object Count -Descending | Select-Object -First 20
foreach ($type in $fileTypes) {
    $ext = if ($type.Name) { $type.Name } else { "(no extension)" }
    Write-Host "$($ext): $($type.Count) files" -ForegroundColor Cyan
}
Write-Host ""

# Directory Statistics
Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host "TOP DIRECTORIES BY FILE COUNT" -ForegroundColor Cyan
Write-Host "=" * 80 -ForegroundColor Cyan
$directories = $allFiles | ForEach-Object { Split-Path $_.FullName -Parent } | 
    Group-Object | Sort-Object Count -Descending | Select-Object -First 15
foreach ($dir in $directories) {
    $shortPath = $dir.Name.Replace((Get-Location).Path + "\", "")
    Write-Host "$($dir.Count) files - $shortPath" -ForegroundColor Cyan
}
Write-Host ""

Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host "Analysis complete!" -ForegroundColor Green
Write-Host "=" * 80 -ForegroundColor Cyan
