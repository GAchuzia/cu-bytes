# Azure Keep Alive Script for CU-Bytes
#
# Use this script to prevent cold starts by warming up and keeping the backend
# and ML model active on Azure.
#
# This script will:
# 1. Send an initial request to the /ml/predict endpoint to load the ML model into memory
# 2. Periodically ping the /api/health endpoint to prevent the app from being deallocated

$urlHealth = "https://cu-bytes-e2cnaff9e2cgg5hk.eastus2-01.azurewebsites.net/api/health"
$urlML = "https://cu-bytes-e2cnaff9e2cgg5hk.eastus2-01.azurewebsites.net/ml/predict"

# Any valid path to an image
$imagePath = "$PSScriptRoot\backend\tests\cu_pizza_cheese.png"

Write-Host "Starting Azure keep-alive script..." -ForegroundColor Cyan

# Step 1: Warm up ML model
try {
    Write-Host "Warming up ML model..." -ForegroundColor Yellow

    curl.exe -X POST -F "image=@$imagePath" $urlML

    Write-Host "ML warm-up success" -ForegroundColor Green
}
catch {
    Write-Host "ML warm-up failed" -ForegroundColor Red
    Write-Host $_
}

# Step 2: Prevent the app from going idle
while ($true) {
    $time = Get-Date -Format "HH:mm:ss"

    try {
        $response = Invoke-WebRequest -Uri $urlHealth -TimeoutSec 30 -UseBasicParsing
        Write-Host "[$time] Ping success: $($response.StatusCode)" -ForegroundColor Green
    }
    catch {
        Write-Host "[$time] Ping failed" -ForegroundColor Red
        Write-Host $_
    }

    # Sleep for 15 minutes (Azure timeout after 20 minutes of inactivity)
    Start-Sleep -Seconds 900
}
