Add-Type -AssemblyName System.IO.Compression.FileSystem

Write-Host "=== Examining files (14).zip ===" -ForegroundColor Green
$zip14 = [System.IO.Compression.ZipFile]::OpenRead("c:\Users\mucha.DESKTOP-H7T9NPM\Downloads\mdsiles\myproject`$new\files (14).zip")
Write-Host "Total entries: $($zip14.Entries.Count)"
$zip14.Entries | Select-Object FullName, Length, LastWriteTime | Format-Table -AutoSize
$zip14.Dispose()

Write-Host "`n=== Examining files (15).zip ===" -ForegroundColor Green
$zip15 = [System.IO.Compression.ZipFile]::OpenRead("c:\Users\mucha.DESKTOP-H7T9NPM\Downloads\mdsiles\myproject`$new\files (15).zip")
Write-Host "Total entries: $($zip15.Entries.Count)"
$zip15.Entries | Select-Object FullName, Length, LastWriteTime | Format-Table -AutoSize
$zip15.Dispose()
