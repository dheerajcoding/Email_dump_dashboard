# Pre-Deployment Verification Script
# Run this before deploying to ensure everything is configured correctly

Write-Host "🔍 Checking Deployment Readiness..." -ForegroundColor Cyan
Write-Host ""

$errors = 0
$warnings = 0

# Check if in correct directory
Write-Host "📁 Checking project structure..." -ForegroundColor Yellow
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Are you in the project root?" -ForegroundColor Red
    $errors++
} else {
    Write-Host "✅ Project root found" -ForegroundColor Green
}

if (-not (Test-Path "backend/server.js")) {
    Write-Host "❌ Error: backend/server.js not found" -ForegroundColor Red
    $errors++
} else {
    Write-Host "✅ Backend files found" -ForegroundColor Green
}

if (-not (Test-Path "frontend/package.json")) {
    Write-Host "❌ Error: frontend/package.json not found" -ForegroundColor Red
    $errors++
} else {
    Write-Host "✅ Frontend files found" -ForegroundColor Green
}

Write-Host ""

# Check for .env files (should not be committed)
Write-Host "🔐 Checking environment files..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "⚠️  Warning: .env file found in root (should not be committed)" -ForegroundColor Yellow
    $warnings++
}

if (Test-Path "backend/.env") {
    Write-Host "ℹ️  backend/.env exists (okay for local dev, ensure it's in .gitignore)" -ForegroundColor Blue
}

if (Test-Path "frontend/.env") {
    Write-Host "ℹ️  frontend/.env exists (okay for local dev, ensure it's in .gitignore)" -ForegroundColor Blue
}

Write-Host ""

# Check .gitignore
Write-Host "📝 Checking .gitignore..." -ForegroundColor Yellow
if (Test-Path ".gitignore") {
    $gitignore = Get-Content ".gitignore" -Raw
    if ($gitignore -match "\.env" -and $gitignore -match "node_modules") {
        Write-Host "✅ .gitignore properly configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Warning: .gitignore might be missing important entries" -ForegroundColor Yellow
        $warnings++
    }
} else {
    Write-Host "❌ Error: .gitignore not found" -ForegroundColor Red
    $errors++
}

Write-Host ""

# Check for deployment files
Write-Host "🚀 Checking deployment files..." -ForegroundColor Yellow
if (Test-Path "render.yaml") {
    Write-Host "✅ render.yaml found" -ForegroundColor Green
} else {
    Write-Host "❌ Error: render.yaml not found" -ForegroundColor Red
    $errors++
}

if (Test-Path "DEPLOYMENT.md") {
    Write-Host "✅ DEPLOYMENT.md found" -ForegroundColor Green
} else {
    Write-Host "⚠️  Warning: DEPLOYMENT.md not found" -ForegroundColor Yellow
    $warnings++
}

Write-Host ""

# Check package.json scripts
Write-Host "📦 Checking package.json scripts..." -ForegroundColor Yellow
$package = Get-Content "package.json" | ConvertFrom-Json
if ($package.scripts.build -and $package.scripts.start) {
    Write-Host "✅ Build and start scripts found" -ForegroundColor Green
} else {
    Write-Host "❌ Error: Missing required scripts in package.json" -ForegroundColor Red
    $errors++
}

Write-Host ""

# Check git status
Write-Host "🔄 Checking git status..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
    
    $gitStatus = git status --porcelain 2>$null
    if ($gitStatus) {
        Write-Host "ℹ️  You have uncommitted changes" -ForegroundColor Blue
    } else {
        Write-Host "✅ Working directory clean" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  Warning: Git not initialized. Run 'git init' before deploying" -ForegroundColor Yellow
    $warnings++
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan

# Final summary
if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "🎉 All checks passed! You're ready to deploy!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Push to GitHub: git push" -ForegroundColor White
    Write-Host "2. Go to https://dashboard.render.com" -ForegroundColor White
    Write-Host "3. Create new Web Service and connect your repo" -ForegroundColor White
    Write-Host "4. Add environment variables (see DEPLOYMENT.md)" -ForegroundColor White
    Write-Host "5. Deploy!" -ForegroundColor White
} elseif ($errors -eq 0) {
    Write-Host "⚠️  Ready to deploy with $warnings warning(s)" -ForegroundColor Yellow
    Write-Host "Review warnings above before deploying" -ForegroundColor Yellow
} else {
    Write-Host "❌ Not ready to deploy! Found $errors error(s) and $warnings warning(s)" -ForegroundColor Red
    Write-Host "Fix the errors above before deploying" -ForegroundColor Red
}

Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 For detailed deployment instructions, see DEPLOYMENT.md" -ForegroundColor Blue
Write-Host "📋 For quick checklist, see DEPLOY_CHECKLIST.md" -ForegroundColor Blue
