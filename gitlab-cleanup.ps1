# GitLab to GitHub Cleanup Script
# This script replaces all GitLab references with GitHub equivalents

$gitRepoPath = "c:\Users\mucha.DESKTOP-H7T9NPM\Downloads\mdsiles\myproject`$new\github-repo"

# Find all .md files
$mdFiles = Get-ChildItem -Path $gitRepoPath -Recurse -Include *.md -File | Where-Object { $_.FullName -notmatch '\\node_modules\\' -and $_.FullName -notmatch '\\.git\\' }

Write-Host "Found $($mdFiles.Count) markdown files to process"
Write-Host ""

$totalReplacements = 0
$filesModified = @()

foreach ($file in $mdFiles) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    
    if (-not $content) {
        continue
    }
    
    $originalContent = $content
    $fileReplacements = 0
    
    # Replace GitLab URLs
    $content = $content -replace 'https://gitlab\.com/advanciapayledger-group/advanciapayledger-new', 'https://github.com/advancia-devuser/advanciapayledger-new'
    $content = $content -replace 'https://gitlab\.com/advanciadevuser/advanciapayledger-new', 'https://github.com/advancia-devuser/advanciapayledger-new'
    $content = $content -replace 'https://gitlab\.com/advanciadevuser/advancia-pay-ledger', 'https://github.com/advancia-devuser/advancia-pay-ledger'
    $content = $content -replace 'git@gitlab\.com:advanciadevuser/advanciapayledger-new\.git', 'git@github.com:advancia-devuser/advanciapayledger-new.git'
    
    # Replace GitLab terms
    $content = $content -replace 'GitLab CI/CD', 'GitHub Actions'
    $content = $content -replace 'GitLab CI', 'GitHub Actions'
    $content = $content -replace 'GitLab pipeline', 'GitHub Actions workflow'
    $content = $content -replace 'GitLab runner', 'GitHub Actions runner'
    $content = $content -replace '\.gitlab-ci\.yml', '.github/workflows/ci-cd.yml'
    $content = $content -replace 'merge request', 'pull request'
    $content = $content -replace 'Merge request', 'Pull request'
    $content = $content -replace 'Merge Requests', 'Pull Requests'
    
    # Special cases - keep specific references if they're just mentions
    # Replace remaining GitLab references
    $content = $content -replace '\*\*GitLab Repository\*\*:', '**GitHub Repository**:'
    $content = $content -replace 'GitLab Repository:', 'GitHub Repository:'
    $content = $content -replace '\*\*New GitLab\*\*:', '**GitHub Repository**:'
    $content = $content -replace '\*\*Old GitLab\*\*:', '**Old Repository** (deprecated):'
    $content = $content -replace 'from GitLab', 'from GitHub'
    $content = $content -replace 'to GitLab', 'to GitHub'
    $content = $content -replace 'on GitLab', 'on GitHub'
    $content = $content -replace 'GitLab Settings', 'GitHub Settings'
    $content = $content -replace 'GitLab Admin', 'GitHub Admin'
    $content = $content -replace 'GitLab Project', 'GitHub Repository'
    $content = $content -replace 'Primary GitLab', 'GitHub Repository'
    $content = $content -replace 'GitLab \+ GitHub', 'GitHub'
    $content = $content -replace 'Dual repository sync \(GitLab \+ GitHub\)', 'GitHub repository configured'
    $content = $content -replace 'consolidated to GitLab', 'consolidated to GitHub'
    $content = $content -replace 'Remote: GitLab \(primary\)', 'Remote: GitHub (primary)'
    $content = $content -replace 'Deploy via GitHub/GitLab', 'Deploy via GitHub'
    $content = $content -replace 'GitHub and GitLab', 'GitHub'
    $content = $content -replace 'Code pushed to GitHub and GitLab', 'Code pushed to GitHub'
    
    # Count replacements
    if ($content -ne $originalContent) {
        $fileReplacements = ($originalContent.Length - $content.Length) / 10
        $totalReplacements += $fileReplacements
        $filesModified += $file.Name
        
        # Save the file
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Modified: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "CLEANUP COMPLETE" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Files modified: $($filesModified.Count)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Modified files:" -ForegroundColor Yellow
foreach ($fname in $filesModified) {
    Write-Host "  - $fname" -ForegroundColor Gray
}
Write-Host ""
