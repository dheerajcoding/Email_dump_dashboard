# Email Lead Sync Dashboard - Setup Script
# This script helps you set up the project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Email Lead Sync Dashboard - Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check MongoDB
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
$mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "✓ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "⚠ MongoDB not detected. Make sure it's installed and running." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Write-Host ""

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
Set-Location backend
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host ""
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location ../frontend
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

Set-Location ..

# Create .env file if it doesn't exist
Write-Host ""
if (-not (Test-Path "backend\.env")) {
    Write-Host "Creating backend/.env file..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "⚠ IMPORTANT: Edit backend/.env with your email credentials!" -ForegroundColor Yellow
} else {
    Write-Host "✓ backend/.env already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit backend/.env with your email credentials" -ForegroundColor White
Write-Host "2. Make sure MongoDB is running" -ForegroundColor White
Write-Host "3. Run: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "The application will be available at:" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
