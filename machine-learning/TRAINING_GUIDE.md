# Food Recognition Model Training Guide

This guide explains how to train the food recognition model using the automated training script.

## Overview

The food recognition model is a deep learning classifier that can identify different types of food from images. It uses transfer learning with pre-trained models (ResNet50, EfficientNet, or MobileNet) fine-tuned on food datasets.

### What the Model Does

- **Input**: Food images (JPG, PNG, etc.)
- **Output**: Food category classification (e.g., "pizza", "burger", "sushi")
- **Architecture**: Deep convolutional neural network based on pre-trained models
- **Training**: Fine-tuned on food datasets (Food-101, UEC Food-100, UEC Food-256)

The model is designed for the CU-Bytes food tracking application, where users can scan food items and automatically log nutritional information.

## Prerequisites

- **Python 3.8+** installed
- **Git** (for cloning the repository)
- **NVIDIA GPU** (optional, but highly recommended for faster training)
  - CUDA 12.1 compatible GPU
  - CUDA Toolkit installed (for GPU training)

### Windows Users

If you get a PowerShell execution policy error when running `train.ps1`, run this command first:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Alternatively, you can use Git Bash or WSL to run the `train.sh` script instead.

### System Requirements

- **Minimum**: CPU-only training (very slow, not recommended)
- **Recommended**: NVIDIA GPU with 4GB+ VRAM
- **Optimal**: NVIDIA GPU with 8GB+ VRAM (RTX 3060, RTX 3070, etc.)

## Quick Start

### 1. Navigate to the Machine Learning Directory

```bash
cd machine-learning
```

### 2. Run the Training Script

**On Linux/Mac (or Git Bash/WSL on Windows):**

```bash
./train.sh
```

**On Windows (PowerShell):**

```powershell
.\train.ps1
```

This will:
- Create a Python virtual environment
- Install all dependencies (including PyTorch with GPU/CPU detection)
- Download configured datasets
- Start training with default settings

### 3. Monitor Training

Training progress is logged to TensorBoard. In a separate terminal:

```bash
# Activate the virtual environment first
source mlenv/bin/activate  # On Linux/Mac
# or
mlenv\Scripts\activate      # On Windows

# Start TensorBoard
tensorboard --logdir models/runs
```

Then open `http://localhost:6006` in your browser to view training metrics.

## Training Script Options

Both `train.sh` (Linux/Mac) and `train.ps1` (Windows) support the same options for customizing training:

### Basic Options

**Linux/Mac:**
```bash
# Custom batch size and epochs
./train.sh --batch-size 16 --epochs 30

# Use a different model architecture
./train.sh --model efficientnet_b0

# Adjust learning rate and image size
./train.sh --lr 0.001 --image-size 256
```

**Windows:**
```powershell
# Custom batch size and epochs
.\train.ps1 -BatchSize 16 -Epochs 30

# Use a different model architecture
.\train.ps1 -Model efficientnet_b0

# Adjust learning rate and image size
.\train.ps1 -LearningRate 0.001 -ImageSize 256
```

### Advanced Options

**Linux/Mac:**
```bash
# Resume training from a checkpoint
./train.sh --resume models/checkpoints/checkpoint_epoch_10.pth

# Freeze backbone for fine-tuning (faster, less memory)
./train.sh --freeze-backbone

# Test GPU before training
./train.sh --test-gpu

# Use custom datasets config
./train.sh --config custom_datasets_config.json

# Skip setup (use existing environment)
./train.sh --skip-setup

# Skip dataset download (use existing datasets)
./train.sh --skip-download
```

**Windows:**
```powershell
# Resume training from a checkpoint
.\train.ps1 -Resume models\checkpoints\checkpoint_epoch_10.pth

# Freeze backbone for fine-tuning
.\train.ps1 -FreezeBackbone

# Test GPU before training
.\train.ps1 -TestGPU

# Use custom datasets config
.\train.ps1 -ConfigFile custom_datasets_config.json

# Skip setup (use existing environment)
.\train.ps1 -SkipSetup

# Skip dataset download (use existing datasets)
.\train.ps1 -SkipDownload
```

### All Options

| Option | Description | Default |
|--------|-------------|---------|
| `--model` | Model architecture (resnet50, efficientnet_b0, mobilenet_v3_small) | resnet50 |
| `--batch-size` | Batch size for training | 32 |
| `--epochs` | Number of training epochs | 50 |
| `--lr` | Learning rate | 0.0001 |
| `--image-size` | Image size for training | 224 |
| `--resume` | Resume from checkpoint path | - |
| `--freeze-backbone` | Freeze backbone layers | false |
| `--test-gpu` | Test GPU setup before training | false |
| `--config` | Path to datasets config file | datasets_config.json |
| `--venv-name` | Virtual environment name | mlenv |
| `--skip-setup` | Skip environment setup | false |
| `--skip-download` | Skip dataset download | false |
| `-h, --help` | Show help message | - |

## Examples

### Example 1: Quick Test Run

Train for a few epochs to test the setup:

**Linux/Mac:**
```bash
./train.sh --epochs 5 --batch-size 16
```

**Windows:**
```powershell
.\train.ps1 -Epochs 5 -BatchSize 16
```

### Example 2: GPU Training with EfficientNet

Train EfficientNet model on GPU with optimized settings:

**Linux/Mac:**
```bash
./train.sh --model efficientnet_b0 --batch-size 32 --epochs 50 --test-gpu
```

**Windows:**
```powershell
.\train.ps1 -Model efficientnet_b0 -BatchSize 32 -Epochs 50 -TestGPU
```

### Example 3: Resume Training

Continue training from a checkpoint:

**Linux/Mac:**
```bash
./train.sh --resume models/checkpoints/checkpoint_epoch_20.pth --epochs 50
```

**Windows:**
```powershell
.\train.ps1 -Resume models\checkpoints\checkpoint_epoch_20.pth -Epochs 50
```

### Example 4: Low Memory Training

If you have limited GPU memory:

**Linux/Mac:**
```bash
./train.sh --batch-size 8 --image-size 128 --freeze-backbone
```

**Windows:**
```powershell
.\train.ps1 -BatchSize 8 -ImageSize 128 -FreezeBackbone
```

### Example 5: CPU Training

Train on CPU (much slower):

**Linux/Mac:**
```bash
./train.sh --batch-size 4 --epochs 10
```

**Windows:**
```powershell
.\train.ps1 -BatchSize 4 -Epochs 10
```

Note: The script automatically detects CPU/GPU and installs the appropriate PyTorch version.

## Dataset Configuration

Datasets are configured in `datasets_config.json`. By default, the following datasets are enabled:

- **Food-101**: 101 food categories (primary dataset)

To customize datasets:

1. Edit `datasets_config.json`
2. Set `"enabled": false` for datasets you don't want to use
3. Add new datasets following the existing format

## Training Output

After training completes, you'll find:

- **Checkpoints**: `models/checkpoints/checkpoint_epoch_*.pth`
  - Saved after each epoch
  - Contains model weights, optimizer state, and training metrics

- **Best Model**: `models/best_model.pth`
  - Model with highest validation accuracy
  - Use this for inference/deployment

- **Class Names**: `models/class_names.json`
  - List of all food categories the model can recognize

- **TensorBoard Logs**: `models/runs/`
  - Training/validation loss and accuracy over time
  - View with: `tensorboard --logdir models/runs`

## Troubleshooting

### GPU Not Detected

If GPU is not detected:

1. Check NVIDIA drivers are installed: `nvidia-smi`
2. Verify CUDA is installed: `nvcc --version`
3. The script will automatically fall back to CPU training

### Out of Memory Errors

If you get CUDA out of memory errors:

- Reduce batch size: `--batch-size 8` or `--batch-size 4`
- Reduce image size: `--image-size 128`
- Use freeze backbone: `--freeze-backbone`
- Use a smaller model: `--model mobilenet_v3_small`
