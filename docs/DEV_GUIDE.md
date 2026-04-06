# CU-Bytes Developer Guide

## Table of Contents

- [Prerequisites](#prerequisites)
- [Developer Setup](#developer-setup)
  - [Manual Setup](#manual-setup)
- [Backend Setup](#backend-setup)
  - [1. Create Virtual Environment](#1-create-virtual-environment)
  - [2. Activate Virtual Environment](#2-activate-virtual-environment)
  - [3. Install Dependencies](#3-install-dependencies)
  - [4. Configure Environment](#4-configure-environment)
  - [5. Run Backend Server](#5-run-backend-server)
- [Frontend Setup](#frontend-setup)
  - [1. Navigate to Frontend Directory](#1-navigate-to-frontend-directory)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Start Development Server](#4-start-development-server)
- [Machine Learning Setup](#machine-learning-setup)
  - [Quick Start](#quick-start)
  - [File Structure](#file-structure)
  - [File Descriptions](#file-descriptions)
    - [`config.py` - Configuration Management](#configpy---configuration-management)
    - [`datasets.py` - Dataset Loading](#datasetspy---dataset-loading)
    - [`download.py` - Dataset Downloads](#downloadpy---dataset-downloads)
    - [`setup.py` - Environment Setup](#setuppy---environment-setup)
    - [`train.py` - Model Training](#trainpy---model-training)
  - [Configuration](#configuration)
    - [`datasets_config.json`](#datasets_configjson)
  - [Usage](#usage)
    - [Complete Workflow](#complete-workflow)
    - [Monitoring Training](#monitoring-training)
  - [Troubleshooting](#troubleshooting)
    - ["No module named 'torch'"](#no-module-named-torch)
    - ["CUDA out of memory"](#cuda-out-of-memory)
    - ["Dataset path does not exist"](#dataset-path-does-not-exist)
    - ["No datasets were successfully loaded"](#no-datasets-were-successfully-loaded)
  - [Common Workflows](#common-workflows)
    - [Quick Test](#quick-test)
    - [Full Training](#full-training)
    - [Resume Training](#resume-training)
- [Running the Application](#running-the-application)
  - [1. Start Backend Server](#1-start-backend-server)
  - [2. Start Frontend Development Server](#2-start-frontend-development-server)
  - [3. Access Application](#3-access-application)

## Prerequisites

- Python 3.8+ (for backend and ML)
- Node.js 16+ and npm (for frontend)
- Git
- Windows/macOS/Linux

## 🚀 Developer Setup

### 🔧 Manual Setup

**1️⃣ Clone the repo**

```bash
git clone https://github.com/GAchuzia/cu-bytes.git
cd cu-bytes
```

**2️⃣ Set up the backend**

```bash
python -m venv backenv
backenv\Scripts\activate        # Windows
pip install -r requirements.txt

python -m backend.database.init_user_settings_db
python -m backend.database.init_auth_db
python -m backend.database.init_food_db
python -m backend.database.init_logging_db

python -m backend.app
```

**3️⃣ Set up the frontend**

```bash
cd frontend/cu-bytes
npm install
npm start
```

**4️⃣ Set up the ML environment**

```bash
cd machine-learning
python -m venv mlenv
mlenv\Scripts\activate          # Windows
pip install -r requirements.txt
```

## Backend Setup

### 1. Create Virtual Environment

```bash
python -m venv backenv
```

### 2. Activate Virtual Environment

**Windows:**

```bash
backenv\Scripts\activate
```

**macOS/Linux:**

```bash
source backenv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

Create `.env` file in backend directory:

```env
FLASK_APP=app.py
FLASK_ENV=development
PORT=5000
```

### 5. Run Backend Server

```bash
python -m backend.database.init_user_settings_db
python -m backend.database.init_auth_db
python -m backend.database.init_food_db
python -m backend.database.init_logging_db
python -m backend.app
```

The server will start on `http://localhost:5000`

**Documentation:** [Flask Documentation](https://flask.palletsprojects.com/)

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend/cu-bytes
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create `.env` file in `frontend/cu-bytes/` directory:

```env
EXPO_PUBLIC_API_IP=YOUR_COMPUTER_IP_ADDRESS
EXPO_PUBLIC_USE_PROD_API=true/false
```

**Find your IP address:**

- Windows: `ipconfig`
- macOS/Linux: `ifconfig`

### 4. Start Development Server

```bash
npm start
```

**Documentation:**

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)

## Machine Learning Setup

### Quick Start

**First Time Setup:**

```bash
cd machine-learning

# 1. Create virtual environment (recommended)
python -m venv mlenv
mlenv\Scripts\activate  # Windows
# source mlenv/bin/activate  # Linux/Mac

# 2. Run complete setup (installs packages, downloads datasets, tests GPU)
python setup.py --setup
```

**Training:**

```bash
# Basic training with default settings
python train.py

# Custom settings
python train.py --batch-size 32 --epochs 50 --lr 0.0001
```

### File Structure

```text
machine-learning/
├── config.py              # Configuration management
├── datasets.py            # Dataset classes and data loaders
├── download.py            # Dataset download functions
├── setup.py               # Environment setup and GPU testing
├── train.py               # Model training script
├── datasets_config.json   # Dataset configuration
└── requirements.txt       # Python dependencies
```

### File Descriptions

#### `config.py` - Configuration Management

**Purpose**: Manages all configuration settings for the ML pipeline.

**Key Components**:

- **`Config` class**: Main configuration container
  - Device detection (CPU/GPU)
  - Directory paths (data, models, checkpoints)
  - Training hyperparameters (batch size, learning rate, epochs, etc.)
  - Dataset configuration

**Key Methods**:

- `print_device_info()`: Prints GPU/CPU information
- `create_directories()`: Creates necessary directories
- `from_config_file()`: Loads configuration from `datasets_config.json`

**Usage**:

```python
from config import Config

# Load from config file
config = Config.from_config_file()

# Or create manually
config = Config(batch_size=32, image_size=224, learning_rate=1e-4)
```

#### `datasets.py` - Dataset Loading

**Purpose**: Handles dataset loading, transformations, and creating PyTorch data loaders.

**Key Components**:

##### `GenericDataset` Class

**What it does**: Unified dataset loader that works with any dataset organized as class folders.

**How it works**:

1. Expects data organized as: `dataset_root/class1/image1.jpg`, `dataset_root/class2/image2.jpg`, etc.
2. Takes a dictionary mapping class names to numeric labels
3. Supports three splitting methods:
   - **Split file**: Text file listing which images belong to train/val
   - **Ratio-based**: Randomly splits data using a ratio (e.g., 80% train, 20% val)
   - **No split**: Uses all data
4. Automatically finds images with extensions: `.jpg`, `.jpeg`, `.png`
5. Handles corrupted images gracefully (returns black image)

**Features**:

- Automatically handles case variations (Pizza, PIZZA, pizza)
- Supports nested directory structures
- Error handling for missing/corrupted images

##### `CombinedDataset` Class

**What it does**: Combines multiple datasets into a single dataset.

**Why it's needed**: When using multiple datasets, PyTorch's `DataLoader` needs a single dataset object. `CombinedDataset` seamlessly merges them with transparent indexing.

##### `create_data_loaders()` Function

**What it does**: Main function that creates PyTorch `DataLoader` objects ready for training.

**How it works**:

1. Reads dataset configurations from `Config.DATASETS_CONFIG`
2. Detects structure (Food-101 with meta/ folder, or standard class folders)
3. Loads all classes and creates datasets
4. Combines datasets using `CombinedDataset`
5. Creates PyTorch `DataLoader` objects

**Usage**:

```python
from config import Config
from datasets import create_data_loaders

config = Config.from_config_file()
train_loader, val_loader, class_names = create_data_loaders(config)
```

##### `get_data_transforms()` Function

**What it does**: Returns image transformations for training and validation.

**Training transforms** (with augmentation):

- Resize, random horizontal flip, rotation, color jitter, random crop, normalization

**Validation transforms** (no augmentation):

- Resize and normalization only

#### `download.py` - Dataset Downloads

**Purpose**: Handles downloading and extracting datasets from URLs.

**Key Functions**:

##### `download_dataset()`

Downloads and extracts any dataset from a URL. Supports `.tar.gz`, `.tar`, and `.zip` formats.

##### `download_all_datasets()`

Downloads all enabled datasets from `datasets_config.json`.

**Usage**:

```python
from download import download_all_datasets
from pathlib import Path

paths = download_all_datasets(Path("data"))
```

#### `setup.py` - Environment Setup

**Purpose**: Sets up the ML environment, tests GPU, and installs PyTorch.

**Key Functions**:

- `test_gpu_setup()`: Tests GPU availability and performance
- `install_pytorch()`: Automatically detects hardware and installs appropriate PyTorch version
- `setup_environment()`: Complete environment setup (packages, directories, datasets, GPU test)

**Usage**:

```bash
# Test GPU
python setup.py --test-gpu

# Install PyTorch
python setup.py --install-pytorch

# Complete setup
python setup.py --setup
```

#### `train.py` - Model Training

**Purpose**: Main script for training food classification models.

**Features**:

- Multiple model architectures (ResNet50, EfficientNet, MobileNet)
- Checkpoint saving/loading
- TensorBoard logging
- Mixed precision training (GPU)
- Early stopping

**Training Options**:

| Argument            | Description                   | Default    |
| ------------------- | ----------------------------- | ---------- |
| `--model`           | Model architecture            | `resnet50` |
| `--batch-size`      | Batch size                    | `32`       |
| `--epochs`          | Number of epochs              | `50`       |
| `--lr`              | Learning rate                 | `0.0001`   |
| `--image-size`      | Input image size              | `224`      |
| `--resume`          | Resume from checkpoint        | `None`     |
| `--freeze-backbone` | Freeze backbone (fine-tuning) | `False`    |
| `--test-gpu`        | Test GPU before training      | `False`    |

**Usage**:

```bash
# Basic training
python train.py

# With custom settings
python train.py --batch-size 16 --epochs 20 --lr 0.00001

# Resume from checkpoint
python train.py --resume models/checkpoints/checkpoint_epoch_10.pth
```

### Configuration

#### `datasets_config.json`

Configuration file for all datasets. Each dataset entry contains:

- `name`: Internal identifier
- `display_name`: Human-readable name
- `url`: Download URL (empty if manual download required)
- `filename`: Archive filename
- `extract_to`: Directory name after extraction
- `structure_type`: "food101" (has meta/) or "class_folders"
- `num_classes`: Number of classes (informational)
- `train_split_ratio`: Ratio for train/val split if no split files
- `enabled`: Whether to download/use this dataset

**Example**: Disable a dataset

```json
{
  "name": "uec_food256",
  "enabled": false,
  ...
}
```

### Usage

#### Complete Workflow

```python
from config import Config
from datasets import create_data_loaders
from train import Trainer

# Load configuration
config = Config.from_config_file()

# Create data loaders
train_loader, val_loader, class_names = create_data_loaders(config)

# Train model
trainer = Trainer(config, model_name="resnet50")
trainer.train(train_loader, val_loader, num_epochs=50)
```

#### Monitoring Training

**TensorBoard**:

```bash
tensorboard --logdir models/runs
```

Open <http://localhost:6006> in your browser.

**Checkpoints**:

- Best model: `models/best_model.pth`
- Epoch checkpoints: `models/checkpoints/checkpoint_epoch_X.pth`
- Class names: `models/class_names.json`

### Troubleshooting

#### "No module named 'torch'"

```bash
python setup.py --install-pytorch
```

#### "CUDA out of memory"

Reduce batch size:

```bash
python train.py --batch-size 16
```

Or reduce image size:

```bash
python train.py --image-size 128 --batch-size 32
```

#### "Dataset path does not exist"

1. Download datasets: `python setup.py --setup`
2. Check `datasets_config.json` - ensure paths are correct
3. For datasets without URLs, download manually and place in `data/` directory

#### "No datasets were successfully loaded"

- Ensure at least one dataset has `"enabled": true` in `datasets_config.json`
- Verify dataset paths exist in `data/` directory
- Check that datasets have expected folder structure

### Common Workflows

#### Quick Test

```bash
python setup.py --setup
python train.py --epochs 5 --batch-size 16
```

#### Full Training

```bash
python setup.py --setup
python train.py --batch-size 32 --epochs 50
```

#### Resume Training

```bash
python train.py --resume models/checkpoints/checkpoint_epoch_10.pth
```

## Running the Application

### 1. Start Backend Server

```bash
cd backend
backenv\Scripts\activate  # Windows
cd ..
python -m backend.database.init_user_settings_db
python -m backend.database.init_auth_db
python -m backend.database.init_food_db
python -m backend.database.init_logging_db
python -m backend.app
```

### 2. Start Frontend Development Server

```bash
cd frontend/cu-bytes
npm start
```

### 3. Access Application

- **Web:** Open browser to Expo development URL
- **Mobile:** Scan QR code with Expo Go app
- **API:** `http://localhost:5000/api/health`
