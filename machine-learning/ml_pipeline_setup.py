import torch
import torch.nn as nn
import os
import sys
import subprocess
import urllib.request
import tarfile
import shutil
import time
from pathlib import Path
from typing import Tuple, List, Optional, Dict
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image
import json


class Config:
    """Configuration class for the ML pipeline"""

    def __init__(
        self,
        base_dir: Optional[Path] = None,
        batch_size: int = 32,
        image_size: int = 224,
        learning_rate: float = 1e-4,
        num_epochs: int = 50,
        train_split: float = 0.7,
        val_split: float = 0.15,
        test_split: float = 0.15,
        model_name: str = "food_classifier",
        datasets_config: Optional[List[Dict]] = None,
    ):
        """
        Initialize configuration

        Args:
            base_dir: Base directory for the project (defaults to script location)
            batch_size: Batch size for training
            image_size: Image size for model input
            learning_rate: Learning rate for optimizer
            num_epochs: Number of training epochs
            train_split: Training data split ratio
            val_split: Validation data split ratio
            test_split: Test data split ratio
            model_name: Name for saved models
            datasets_config: List of dataset configs, each with:
                - name: Dataset name (e.g., 'food101', 'uec100', 'vireo172')
                - path: Path to dataset
                - selected_classes: List of class names to use (None = use all)
                - train_split: Optional path to train split file
                - val_split: Optional path to val split file
        """
        self.DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.GPU_AVAILABLE = torch.cuda.is_available()

        self.BASE_DIR = base_dir if base_dir else Path(__file__).resolve().parent
        self.DATA_DIR = self.BASE_DIR / "data"
        self.MODELS_DIR = self.BASE_DIR / "models"
        self.NOTEBOOKS_DIR = self.BASE_DIR / "notebooks"

        # Model configuration
        self.IMAGE_SIZE = image_size
        self.BATCH_SIZE = batch_size
        self.LEARNING_RATE = learning_rate
        self.NUM_EPOCHS = num_epochs

        # Training configuration
        self.TRAIN_SPLIT = train_split
        self.VAL_SPLIT = val_split
        self.TEST_SPLIT = test_split

        # Model saving
        self.MODEL_NAME = model_name
        self.CHECKPOINT_DIR = self.MODELS_DIR / "checkpoints"
        self.BEST_MODEL_PATH = self.MODELS_DIR / "best_model.pth"

        # Datasets configuration
        self.DATASETS_CONFIG = datasets_config or []
        
        # Auto-detect number of classes after loading data
        self.NUM_CLASSES = None
        self.ALL_CLASS_NAMES = []  # Will be populated after loading datasets

        # API configuration
        self.API_HOST = "localhost"
        self.API_PORT = 5001

    def print_device_info(self):
        """Prints user-friendly device information"""
        print(f"Device: {self.DEVICE}")
        if self.GPU_AVAILABLE:
            print(f"GPU: {torch.cuda.get_device_name(0)}")
            print(
                f"GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB"
            )
            print(f"CUDA Version: {torch.version.cuda}")
            print(f"cuDNN Version: {torch.backends.cudnn.version()}")
        else:
            print("Using CPU")

    def create_directories(self):
        """Create necessary directories for machine learning project"""
        directories = [
            self.DATA_DIR,
            self.MODELS_DIR,
            self.NOTEBOOKS_DIR,
            self.CHECKPOINT_DIR,
        ]

        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)
            print(f"Created directory: {directory}")

def test_gpu_setup():
    """Test GPU setup and performance"""
    print("Testing GPU Setup")
    print("=" * 40)

    print(f"PyTorch version: {torch.__version__}")
    print(f"CUDA available: {torch.cuda.is_available()}")

    if torch.cuda.is_available():
        print(f"CUDA version: {torch.version.cuda}")
        print(f"cuDNN version: {torch.backends.cudnn.version()}")
        print(f"Number of GPUs: {torch.cuda.device_count()}")

        for i in range(torch.cuda.device_count()):
            print(f"\nGPU {i}:")
            print(f"  Name: {torch.cuda.get_device_name(i)}")
            print(
                f"  Memory: {torch.cuda.get_device_properties(i).total_memory / 1e9:.1f} GB"
            )
            print(
                f"  Compute Capability: {torch.cuda.get_device_properties(i).major}.{torch.cuda.get_device_properties(i).minor}"
            )

        print(f"\nTesting GPU Operations:")
        device = torch.device("cuda")

        a = torch.randn(1000, 1000, device=device)
        b = torch.randn(1000, 1000, device=device)

        start_time = time.time()
        c = torch.matmul(a, b)
        torch.cuda.synchronize()
        gpu_time = time.time() - start_time

        print(f"  GPU matrix multiplication (1000x1000): {gpu_time:.4f} seconds")

        a_cpu = a.cpu()
        b_cpu = b.cpu()
        start_time = time.time()
        c_cpu = torch.matmul(a_cpu, b_cpu)
        cpu_time = time.time() - start_time

        print(f"  CPU matrix multiplication (1000x1000): {cpu_time:.4f} seconds")
        print(f"  GPU Speedup: {cpu_time/gpu_time:.2f}x")

        print("\nGPU setup is working correctly!")
        return True
    else:
        print("CUDA not available. Training will use CPU (much slower).")
        print("\nTo enable GPU support:")
        print(
            "1. Install CUDA Toolkit from https://developer.nvidia.com/cuda-downloads"
        )
        print("2. Install cuDNN from https://developer.nvidia.com/cudnn")
        print("3. Reinstall PyTorch with CUDA support:")
        print("   pip uninstall torch torchvision torchaudio")
        print(
            "   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121"
        )
        return False