# Development Startup Script for Cu-Bytes
# This script:
# 1. Sets up/activates Python virtual environment
# 2. Initializes all databases
# 3. Starts Flask backend server
# 4. Installs frontend dependencies and starts Expo

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Starting Cu-Bytes Development Environment" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Get the project root directory
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# Step 1: Setup Python Virtual Environment
Write-Host "[1/6] Setting up Python virtual environment..." -ForegroundColor Yellow
$venvPath = Join-Path $projectRoot "backend\backenv"

if (-not (Test-Path $venvPath)) {
    Write-Host "Creating virtual environment..." -ForegroundColor Green
    $backendPath = Join-Path $projectRoot "backend"
    Set-Location $backendPath
    python -m venv backenv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to create virtual environment. Make sure Python is installed." -ForegroundColor Red
        exit 1
    }
    Set-Location $projectRoot
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Green
& "$venvPath\Scripts\Activate.ps1"

# Verify activation by checking Python path
$pythonPath = (Get-Command python -ErrorAction SilentlyContinue).Source
if ($pythonPath -and $pythonPath -like "*backenv*") {
    Write-Host "Virtual environment activated successfully." -ForegroundColor Green
} else {
    Write-Host "Warning: Virtual environment may not be activated properly. Continuing anyway..." -ForegroundColor Yellow
}

# Install/upgrade pip and install requirements
Write-Host "Installing Python dependencies..." -ForegroundColor Green
python -m pip install --upgrade pip
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to upgrade pip. Make sure Python is installed and accessible." -ForegroundColor Red
    exit 1
}

pip install -r backend\requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to install Python requirements." -ForegroundColor Red
    exit 1
}

# Step 2: Initialize Databases
Write-Host ""
Write-Host "[2/6] Initializing databases..." -ForegroundColor Yellow
Write-Host "Note: Initializing in correct order (profiles must be created before auth users)" -ForegroundColor Gray
Write-Host ""

$dbPath = Join-Path $projectRoot "backend\database"
$profilesDb = Join-Path $dbPath "profiles.db"
$authDb = Join-Path $dbPath "auth.db"
$foodDb = Join-Path $dbPath "food_data.db"
$loggingDb = Join-Path $dbPath "logging.db"

# Check if all databases exist
$allDbsExist = (Test-Path $profilesDb) -and (Test-Path $authDb) -and (Test-Path $foodDb) -and (Test-Path $loggingDb)

if ($allDbsExist) {
    Write-Host "All databases already exist. Skipping initialization." -ForegroundColor Green
    Write-Host "To reinitialize, delete the .db files in backend\database\ and run this script again." -ForegroundColor Gray
} else {
    Write-Host "Some databases are missing. Initializing..." -ForegroundColor Yellow
    Write-Host ""

    if (-not (Test-Path $profilesDb)) {
        Write-Host "Initializing user settings database (profiles)..." -ForegroundColor Green
        python -m backend.database.init_user_settings_db
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Warning: Failed to initialize user settings database." -ForegroundColor Yellow
        }
    } else {
        Write-Host "User settings database (profiles) already exists. Skipping." -ForegroundColor Gray
    }

    if (-not (Test-Path $authDb)) {
        Write-Host "Initializing auth database..." -ForegroundColor Green
        python -m backend.database.init_auth_db
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Warning: Failed to initialize auth database." -ForegroundColor Yellow
        }
    } else {
        Write-Host "Auth database already exists. Skipping." -ForegroundColor Gray
    }

    if (-not (Test-Path $foodDb)) {
        Write-Host "Initializing food database..." -ForegroundColor Green
        python -m backend.database.init_food_db
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Warning: Failed to initialize food database." -ForegroundColor Yellow
        }
    } else {
        Write-Host "Food database already exists. Skipping." -ForegroundColor Gray
    }

    if (-not (Test-Path $loggingDb)) {
        Write-Host "Initializing logging database..." -ForegroundColor Green
        python -m backend.database.init_logging_db
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Warning: Failed to initialize logging database." -ForegroundColor Yellow
        }
    } else {
        Write-Host "Logging database already exists. Skipping." -ForegroundColor Gray
    }
}

# Step 3: Start Flask Backend Server
Write-Host ""
Write-Host "[3/6] Starting Flask backend server..." -ForegroundColor Yellow
Write-Host "Flask server will run in background on http://127.0.0.1:5000" -ForegroundColor Green

# Start Flask in a new PowerShell window
$flaskScript = @"
cd '$projectRoot'
& '$venvPath\Scripts\Activate.ps1'
python -m backend.app
pause
"@

$flaskScript | Out-File -FilePath "$env:TEMP\start_flask.ps1" -Encoding UTF8
Start-Process powershell -ArgumentList "-NoExit", "-File", "$env:TEMP\start_flask.ps1"

# Wait a moment for Flask to start
Start-Sleep -Seconds 3

# Step 4: Setup Frontend Dependencies
Write-Host ""
Write-Host "[4/6] Installing frontend dependencies..." -ForegroundColor Yellow
$frontendPath = Join-Path $projectRoot "frontend\cu-bytes"
Set-Location $frontendPath

if (-not (Test-Path "node_modules")) {
    Write-Host "Running npm install..." -ForegroundColor Green
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to install frontend dependencies." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "node_modules already exists. Skipping npm install." -ForegroundColor Green
    Write-Host "Run 'npm install' manually if you need to update dependencies." -ForegroundColor Gray
}

# Step 5: Start Frontend (Expo)
Write-Host ""
Write-Host "[5/6] Starting Expo development server..." -ForegroundColor Yellow
Write-Host "Expo will open in a new window/tab." -ForegroundColor Green

# Start Expo in a new PowerShell window
$expoScript = @"
cd '$frontendPath'
npm start
pause
"@

$expoScript | Out-File -FilePath "$env:TEMP\start_expo.ps1" -Encoding UTF8
Start-Process powershell -ArgumentList "-NoExit", "-File", "$env:TEMP\start_expo.ps1"

# Step 6: Open Browser
Write-Host ""
Write-Host "[6/6] Opening browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Open Flask API health check
Start-Process "http://127.0.0.1:5000/api/health"

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend API: http://127.0.0.1:5000" -ForegroundColor Cyan
Write-Host "API Health: http://127.0.0.1:5000/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Expo development server should open automatically." -ForegroundColor Cyan
Write-Host "Check the PowerShell windows for Flask and Expo logs." -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit this script (servers will continue running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
