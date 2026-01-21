#!/bin/bash

# Food Recognition ML Pipeline - Automated Training Script
# This script automates the complete ML pipeline: environment setup, dataset download, and training

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Default values
VENV_NAME="mlenv"
MODEL="resnet50"
BATCH_SIZE=32
EPOCHS=50
LEARNING_RATE=0.0001
IMAGE_SIZE=224
RESUME=""
FREEZE_BACKBONE=false
TEST_GPU=false
CONFIG_FILE="datasets_config.json"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --model)
            MODEL="$2"
            shift 2
            ;;
        --batch-size)
            BATCH_SIZE="$2"
            shift 2
            ;;
        --epochs)
            EPOCHS="$2"
            shift 2
            ;;
        --lr)
            LEARNING_RATE="$2"
            shift 2
            ;;
        --image-size)
            IMAGE_SIZE="$2"
            shift 2
            ;;
        --resume)
            RESUME="$2"
            shift 2
            ;;
        --freeze-backbone)
            FREEZE_BACKBONE=true
            shift
            ;;
        --test-gpu)
            TEST_GPU=true
            shift
            ;;
        --config)
            CONFIG_FILE="$2"
            shift 2
            ;;
        --venv-name)
            VENV_NAME="$2"
            shift 2
            ;;
        --skip-setup)
            SKIP_SETUP=true
            shift
            ;;
        --skip-download)
            SKIP_DOWNLOAD=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --model MODEL           Model architecture (resnet50, efficientnet_b0, mobilenet_v3_small) [default: resnet50]"
            echo "  --batch-size SIZE       Batch size [default: 32]"
            echo "  --epochs NUM            Number of training epochs [default: 50]"
            echo "  --lr RATE               Learning rate [default: 0.0001]"
            echo "  --image-size SIZE       Image size for training [default: 224]"
            echo "  --resume PATH           Resume training from checkpoint"
            echo "  --freeze-backbone       Freeze backbone for fine-tuning"
            echo "  --test-gpu              Test GPU setup before training"
            echo "  --config PATH           Path to datasets config file [default: datasets_config.json]"
            echo "  --venv-name NAME        Virtual environment name [default: mlenv]"
            echo "  --skip-setup            Skip environment setup (use existing venv)"
            echo "  --skip-download         Skip dataset download (use existing datasets)"
            echo "  -h, --help              Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                                    # Full pipeline with defaults"
            echo "  $0 --batch-size 16 --epochs 30       # Custom batch size and epochs"
            echo "  $0 --model efficientnet_b0            # Use EfficientNet model"
            echo "  $0 --resume models/checkpoints/...    # Resume from checkpoint"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Food Recognition ML Pipeline${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 1: Setup Python Virtual Environment
if [ "$SKIP_SETUP" != true ]; then
    echo -e "${YELLOW}[1/4] Setting up Python virtual environment...${NC}"
    
    if [ ! -d "$VENV_NAME" ]; then
        echo -e "${GREEN}Creating virtual environment: $VENV_NAME${NC}"
        python3 -m venv "$VENV_NAME" || python -m venv "$VENV_NAME"
    else
        echo -e "${GREEN}Virtual environment already exists: $VENV_NAME${NC}"
    fi
    
    # Activate virtual environment
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
        source "$VENV_NAME/Scripts/activate"
    else
        source "$VENV_NAME/bin/activate"
    fi
    
    echo -e "${GREEN}Virtual environment activated${NC}"
    
    # Upgrade pip
    echo -e "${GREEN}Upgrading pip...${NC}"
    pip install --upgrade pip --quiet
    
    # Install PyTorch (with GPU/CPU detection)
    echo -e "${GREEN}Detecting hardware for PyTorch installation...${NC}"
    if command -v nvidia-smi &> /dev/null; then
        echo -e "${GREEN}NVIDIA GPU detected. Installing PyTorch with CUDA support...${NC}"
        pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121 --quiet
    else
        echo -e "${YELLOW}No NVIDIA GPU detected. Installing PyTorch CPU version...${NC}"
        pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu --quiet
    fi
    
    # Install other requirements
    echo -e "${GREEN}Installing Python dependencies...${NC}"
    pip install -r requirements.txt --quiet
    
    echo -e "${GREEN}Environment setup complete!${NC}"
    echo ""
else
    echo -e "${YELLOW}[1/4] Skipping environment setup...${NC}"
    # Still activate existing venv
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
        source "$VENV_NAME/Scripts/activate"
    else
        source "$VENV_NAME/bin/activate"
    fi
    echo ""
fi

# Step 2: Download Datasets
if [ "$SKIP_DOWNLOAD" != true ]; then
    echo -e "${YELLOW}[2/4] Downloading datasets...${NC}"
    
    CONFIG_PATH="$SCRIPT_DIR/$CONFIG_FILE"
    if [ ! -f "$CONFIG_PATH" ]; then
        echo -e "${RED}Error: Config file not found: $CONFIG_PATH${NC}"
        exit 1
    fi
    
    python setup.py --setup --config "$CONFIG_PATH"
    
    echo -e "${GREEN}Dataset download complete!${NC}"
    echo ""
else
    echo -e "${YELLOW}[2/4] Skipping dataset download...${NC}"
    echo ""
fi

# Step 3: Test GPU (optional)
if [ "$TEST_GPU" = true ]; then
    echo -e "${YELLOW}[3/4] Testing GPU setup...${NC}"
    python setup.py --test-gpu
    echo ""
fi

# Step 4: Start Training
echo -e "${YELLOW}[4/4] Starting training...${NC}"
echo -e "${GREEN}Configuration:${NC}"
echo -e "  Model: $MODEL"
echo -e "  Batch Size: $BATCH_SIZE"
echo -e "  Epochs: $EPOCHS"
echo -e "  Learning Rate: $LEARNING_RATE"
echo -e "  Image Size: $IMAGE_SIZE"
[ -n "$RESUME" ] && echo -e "  Resuming from: $RESUME"
[ "$FREEZE_BACKBONE" = true ] && echo -e "  Freeze Backbone: Yes"
echo ""

# Build training command
TRAIN_CMD="python train.py --model $MODEL --batch-size $BATCH_SIZE --epochs $EPOCHS --lr $LEARNING_RATE --image-size $IMAGE_SIZE --datasets-config $CONFIG_FILE"

if [ -n "$RESUME" ]; then
    TRAIN_CMD="$TRAIN_CMD --resume $RESUME"
fi

if [ "$FREEZE_BACKBONE" = true ]; then
    TRAIN_CMD="$TRAIN_CMD --freeze-backbone"
fi

if [ "$TEST_GPU" = true ]; then
    TRAIN_CMD="$TRAIN_CMD --test-gpu"
fi

# Run training
echo -e "${GREEN}Starting training...${NC}"
echo ""
eval $TRAIN_CMD

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Training pipeline completed!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Checkpoints saved to: ${GREEN}models/checkpoints/${NC}"
echo -e "Best model saved to: ${GREEN}models/best_model.pth${NC}"
echo -e "TensorBoard logs: ${GREEN}models/runs/${NC}"
echo ""
echo -e "To view training progress, run:"
echo -e "  ${GREEN}tensorboard --logdir models/runs${NC}"
echo ""
