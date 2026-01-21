# Food Recognition ML Pipeline - Automated Training Script (PowerShell)
# This script automates the complete ML pipeline: environment setup, dataset download, and training

param(
    [string]$Model = "resnet50",
    [int]$BatchSize = 32,
    [int]$Epochs = 50,
    [double]$LearningRate = 0.0001,
    [int]$ImageSize = 224,
    [string]$Resume = "",
    [switch]$FreezeBackbone = $false,
    [switch]$TestGPU = $false,
    [string]$ConfigFile = "datasets_config.json",
    [string]$VenvName = "mlenv",
    [switch]$SkipSetup = $false,
    [switch]$SkipDownload = $false,
    [switch]$Help = $false
)

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# Show help
if ($Help) {
    Write-Host "Usage: .\train.ps1 [OPTIONS]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Model MODEL           Model architecture (resnet50, efficientnet_b0, mobilenet_v3_small) [default: resnet50]"
    Write-Host "  -BatchSize SIZE        Batch size [default: 32]"
    Write-Host "  -Epochs NUM            Number of training epochs [default: 50]"
    Write-Host "  -LearningRate RATE     Learning rate [default: 0.0001]"
    Write-Host "  -ImageSize SIZE        Image size for training [default: 224]"
    Write-Host "  -Resume PATH           Resume training from checkpoint"
    Write-Host "  -FreezeBackbone        Freeze backbone for fine-tuning"
    Write-Host "  -TestGPU               Test GPU setup before training"
    Write-Host "  -ConfigFile PATH       Path to datasets config file [default: datasets_config.json]"
    Write-Host "  -VenvName NAME         Virtual environment name [default: mlenv]"
    Write-Host "  -SkipSetup             Skip environment setup (use existing venv)"
    Write-Host "  -SkipDownload          Skip dataset download (use existing datasets)"
    Write-Host "  -Help                  Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\train.ps1                                    # Full pipeline with defaults"
    Write-Host "  .\train.ps1 -BatchSize 16 -Epochs 30         # Custom batch size and epochs"
    Write-Host "  .\train.ps1 -Model efficientnet_b0            # Use EfficientNet model"
    Write-Host "  .\train.ps1 -Resume models\checkpoints\...    # Resume from checkpoint"
    exit 0
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Food Recognition ML Pipeline" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Setup Python Virtual Environment
if (-not $SkipSetup) {
    Write-Host "[1/4] Setting up Python virtual environment..." -ForegroundColor Yellow
    
    $VenvPath = Join-Path $ScriptDir $VenvName
    
    if (-not (Test-Path $VenvPath)) {
        Write-Host "Creating virtual environment: $VenvName" -ForegroundColor Green
        python -m venv $VenvName
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Error: Failed to create virtual environment" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Virtual environment already exists: $VenvName" -ForegroundColor Green
    }
    
    # Activate virtual environment
    Write-Host "Activating virtual environment..." -ForegroundColor Green
    & "$VenvPath\Scripts\Activate.ps1"
    
    # Upgrade pip
    Write-Host "Upgrading pip..." -ForegroundColor Green
    python -m pip install --upgrade pip --quiet
    
    # Install PyTorch (with GPU/CPU detection)
    Write-Host "Detecting hardware for PyTorch installation..." -ForegroundColor Green
    $hasGPU = $false
    try {
        $null = nvidia-smi 2>&1
        if ($LASTEXITCODE -eq 0) {
            $hasGPU = $true
        }
    } catch {
        $hasGPU = $false
    }
    
    if ($hasGPU) {
        Write-Host "NVIDIA GPU detected. Installing PyTorch with CUDA support..." -ForegroundColor Green
        pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121 --quiet
    } else {
        Write-Host "No NVIDIA GPU detected. Installing PyTorch CPU version..." -ForegroundColor Yellow
        pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu --quiet
    }
    
    # Install other requirements
    Write-Host "Installing Python dependencies..." -ForegroundColor Green
    pip install -r requirements.txt --quiet
    
    Write-Host "Environment setup complete!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[1/4] Skipping environment setup..." -ForegroundColor Yellow
    # Still activate existing venv
    $VenvPath = Join-Path $ScriptDir $VenvName
    & "$VenvPath\Scripts\Activate.ps1"
    Write-Host ""
}

# Step 2: Download Datasets
if (-not $SkipDownload) {
    Write-Host "[2/4] Downloading datasets..." -ForegroundColor Yellow
    
    $ConfigPath = Join-Path $ScriptDir $ConfigFile
    if (-not (Test-Path $ConfigPath)) {
        Write-Host "Error: Config file not found: $ConfigPath" -ForegroundColor Red
        exit 1
    }
    
    python setup.py --setup --config $ConfigPath
    
    Write-Host "Dataset download complete!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[2/4] Skipping dataset download..." -ForegroundColor Yellow
    Write-Host ""
}

# Step 3: Test GPU (optional)
if ($TestGPU) {
    Write-Host "[3/4] Testing GPU setup..." -ForegroundColor Yellow
    python setup.py --test-gpu
    Write-Host ""
}

# Step 4: Start Training
Write-Host "[4/4] Starting training..." -ForegroundColor Yellow
Write-Host "Configuration:" -ForegroundColor Green
Write-Host "  Model: $Model"
Write-Host "  Batch Size: $BatchSize"
Write-Host "  Epochs: $Epochs"
Write-Host "  Learning Rate: $LearningRate"
Write-Host "  Image Size: $ImageSize"
if ($Resume) {
    Write-Host "  Resuming from: $Resume"
}
if ($FreezeBackbone) {
    Write-Host "  Freeze Backbone: Yes"
}
Write-Host ""

# Build training command
$TrainCmd = "python train.py --model $Model --batch-size $BatchSize --epochs $Epochs --lr $LearningRate --image-size $ImageSize --datasets-config $ConfigFile"

if ($Resume) {
    $TrainCmd += " --resume $Resume"
}

if ($FreezeBackbone) {
    $TrainCmd += " --freeze-backbone"
}

if ($TestGPU) {
    $TrainCmd += " --test-gpu"
}

# Run training
Write-Host "Starting training..." -ForegroundColor Green
Write-Host ""
Invoke-Expression $TrainCmd

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Training pipeline completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Checkpoints saved to: models\checkpoints\" -ForegroundColor Green
Write-Host "Best model saved to: models\best_model.pth" -ForegroundColor Green
Write-Host "TensorBoard logs: models\runs\" -ForegroundColor Green
Write-Host ""
Write-Host "To view training progress, run:"
Write-Host "  tensorboard --logdir models\runs" -ForegroundColor Green
Write-Host ""
