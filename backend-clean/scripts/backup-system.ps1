# Advancia PayLedger - Backup System
# PowerShell script for Windows environments

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("full", "db", "config", "snapshot")]
    [string]$BackupType = "full",
    
    [Parameter(Mandatory=$false)]
    [string]$BackupDir = ".\backups"
)

$ErrorActionPreference = "Stop"
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)

Write-Host "🔄 Advancia PayLedger Backup System" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Backup Type: $BackupType"
Write-Host "Timestamp: $timestamp"
Write-Host ""

# Create backup directories
$backupPaths = @(
    "$BackupDir\db",
    "$BackupDir\config",
    "$BackupDir\snapshots",
    "$BackupDir\logs"
)

foreach ($path in $backupPaths) {
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "📁 Created: $path" -ForegroundColor Green
    }
}

function Backup-Database {
    Write-Host "`n📦 Backing up database..." -ForegroundColor Yellow
    
    $dbBackupFile = "$BackupDir\db\db-backup-$timestamp.sql"
    
    # Check for DATABASE_URL
    $dbUrl = $env:DATABASE_URL
    if (-not $dbUrl) {
        Write-Host "⚠️  DATABASE_URL not set. Skipping database backup." -ForegroundColor Yellow
        return
    }
    
    try {
        # Use pg_dump if available
        $pgDump = Get-Command pg_dump -ErrorAction SilentlyContinue
        if ($pgDump) {
            & pg_dump $dbUrl > $dbBackupFile
            Write-Host "✅ Database backed up to: $dbBackupFile" -ForegroundColor Green
        } else {
            Write-Host "⚠️  pg_dump not found. Install PostgreSQL tools for database backups." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Database backup failed: $_" -ForegroundColor Red
    }
}

function Backup-Config {
    Write-Host "`n📋 Backing up configuration files..." -ForegroundColor Yellow
    
    $configBackupDir = "$BackupDir\config\config-$timestamp"
    New-Item -ItemType Directory -Path $configBackupDir -Force | Out-Null
    
    $configFiles = @(
        "backend\.env.example",
        "backend\.env.template",
        "backend\package.json",
        "backend\tsconfig.json",
        "backend\prisma\schema.prisma",
        "frontend\package.json",
        "frontend\next.config.js",
        "frontend\tailwind.config.js",
        "frontend\tsconfig.json",
        "docker-compose.yml",
        "docker-compose.prod.yml",
        ".gitlab-ci.yml"
    )
    
    foreach ($file in $configFiles) {
        $sourcePath = Join-Path $projectRoot $file
        if (Test-Path $sourcePath) {
            $destPath = Join-Path $configBackupDir (Split-Path $file -Leaf)
            Copy-Item $sourcePath $destPath -Force
            Write-Host "  ✅ $file" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  Not found: $file" -ForegroundColor Yellow
        }
    }
    
    Write-Host "✅ Config backed up to: $configBackupDir" -ForegroundColor Green
}

function Backup-Snapshot {
    Write-Host "`n📸 Creating project snapshot..." -ForegroundColor Yellow
    
    $snapshotFile = "$BackupDir\snapshots\snapshot-$timestamp.zip"
    
    $excludeDirs = @(
        "node_modules",
        ".git",
        "dist",
        ".next",
        "backups",
        "*.log"
    )
    
    try {
        # Create temporary directory for snapshot
        $tempDir = "$env:TEMP\advancia-snapshot-$timestamp"
        New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
        
        # Copy files excluding node_modules, .git, etc.
        $items = Get-ChildItem $projectRoot -Recurse -Force | Where-Object {
            $path = $_.FullName
            $exclude = $false
            foreach ($dir in $excludeDirs) {
                if ($path -like "*\$dir\*" -or $path -like "*\$dir") {
                    $exclude = $true
                    break
                }
            }
            -not $exclude
        }
        
        foreach ($item in $items) {
            $relativePath = $item.FullName.Substring($projectRoot.Length + 1)
            $destPath = Join-Path $tempDir $relativePath
            
            if ($item.PSIsContainer) {
                New-Item -ItemType Directory -Path $destPath -Force -ErrorAction SilentlyContinue | Out-Null
            } else {
                $destDir = Split-Path $destPath -Parent
                if (-not (Test-Path $destDir)) {
                    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
                }
                Copy-Item $item.FullName $destPath -Force -ErrorAction SilentlyContinue
            }
        }
        
        # Create zip archive
        Compress-Archive -Path "$tempDir\*" -DestinationPath $snapshotFile -Force
        
        # Cleanup temp directory
        Remove-Item $tempDir -Recurse -Force
        
        $size = (Get-Item $snapshotFile).Length / 1MB
        Write-Host "✅ Snapshot created: $snapshotFile ($([math]::Round($size, 2)) MB)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Snapshot failed: $_" -ForegroundColor Red
    }
}

function Write-BackupLog {
    param([string]$Message)
    
    $logFile = "$BackupDir\logs\backup-log.txt"
    $logEntry = "[$timestamp] $Message"
    Add-Content -Path $logFile -Value $logEntry
}

# Execute backup based on type
switch ($BackupType) {
    "full" {
        Backup-Database
        Backup-Config
        Backup-Snapshot
        Write-BackupLog "Full backup completed"
    }
    "db" {
        Backup-Database
        Write-BackupLog "Database backup completed"
    }
    "config" {
        Backup-Config
        Write-BackupLog "Config backup completed"
    }
    "snapshot" {
        Backup-Snapshot
        Write-BackupLog "Snapshot backup completed"
    }
}

Write-Host "`n✅ Backup completed successfully!" -ForegroundColor Green
Write-Host "Backup location: $BackupDir" -ForegroundColor Cyan
