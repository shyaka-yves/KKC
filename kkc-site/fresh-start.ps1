# Fresh Git Start - Remove History with Large Files
# Run this from D:\KKC

Write-Host "Creating fresh Git repository..." -ForegroundColor Yellow
Write-Host "This will remove all Git history but keep your code." -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Continue? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Cancelled." -ForegroundColor Red
    exit
}

# Backup current state
Write-Host "Backing up current .git folder..." -ForegroundColor Cyan
if (Test-Path ".git.backup") {
    Remove-Item -Recurse -Force ".git.backup"
}
Copy-Item -Recurse ".git" ".git.backup"

# Remove old .git
Write-Host "Removing old Git history..." -ForegroundColor Cyan
Remove-Item -Recurse -Force ".git"

# Initialize fresh repo
Write-Host "Initializing fresh repository..." -ForegroundColor Cyan
git init
git add .
git commit -m "Initial commit - cleaned repository"

# Set remote
Write-Host "Setting remote..." -ForegroundColor Cyan
git remote add origin https://github.com/shyaka-yves/KKC.git

# Push (force to overwrite remote)
Write-Host ""
Write-Host "Ready to push!" -ForegroundColor Green
Write-Host "Run: git push -u origin main --force" -ForegroundColor Green
Write-Host ""
Write-Host "Note: This will overwrite the remote repository." -ForegroundColor Yellow
Write-Host "If you want to keep the backup, don't delete .git.backup" -ForegroundColor Yellow
