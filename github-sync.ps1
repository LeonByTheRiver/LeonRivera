# Leon Rivera — GitHub Sync Script
# This script links your local project to GitHub and pushes changes.

$RepoUrl = "https://github.com/LeonByTheRiver/LeonRivera.git"
$MyEmail = "mr.leon.by.the.river@gmail.com"
$MyName  = "LeonByTheRiver"

Write-Host "--- LEON RIVERA GITHUB SYNC ---" -ForegroundColor Cyan

# 1. Check if Git is installed
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Git is not installed on your system." -ForegroundColor Red
    Write-Host "Please download and install Git from: https://git-scm.com/" -ForegroundColor Yellow
    exit
}

# 2. Set Identity (if not already set)
$CurrentEmail = git config user.email
if ([string]::IsNullOrWhitespace($CurrentEmail)) {
    Write-Host "Setting git identity..." -ForegroundColor Gray
    git config --global user.email $MyEmail
    git config --global user.name $MyName
}

# 3. Initialize Git if not already done
if (!(Test-Path .git)) {
    Write-Host "Initializing Git repository..." -ForegroundColor Green
    git init
    git branch -M main
}

# 4. Add Remote Origin if missing
$RemoteCheck = git remote get-url origin 2>$null
if ($null -eq $RemoteCheck) {
    Write-Host "Connecting to GitHub repository ($RepoUrl)..." -ForegroundColor Green
    git remote add origin $RepoUrl
}

# 5. Stage and Commit changes
Write-Host "Staging changes..." -ForegroundColor Gray
git add .

$Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$CommitMsg = "Update: Site content ($Timestamp)"

Write-Host "Committing changes..." -ForegroundColor Gray
# We use --allow-empty in case there are no changes to avoid errors
git commit -m $CommitMsg --allow-empty

# 6. Push to GitHub
Write-Host "Pushing to GitHub (main branch)..." -ForegroundColor Green
# The -u flag ensures 'main' is tracked
git push -u origin main

Write-Host "-------------------------------" -ForegroundColor Cyan
Write-Host "Sync Complete!" -ForegroundColor Green
Write-Host "Your site should be live soon at: https://leonbytheriver.github.io/LeonRivera/" -ForegroundColor Yellow
Write-Host "Press Enter to exit..."
Read-Host
