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


class Food101Dataset(Dataset):
    """Food-101 Dataset with optional class filtering"""

    def __init__(
        self,
        root_dir: str,
        split: str = "train",
        transform=None,
        selected_classes: Optional[List[str]] = None,
    ):
        """
        Food-101 Dataset

        Args:
            root_dir: Path to food-101 directory
            split: 'train' or 'test'
            transform: Image transformations
            selected_classes: List of class names to include (None = all classes)
        """
        self.root_dir = Path(root_dir)
        self.split = split
        self.transform = transform

        # Load class names
        all_class_names = self._load_class_names()

        # Filter classes if specified
        if selected_classes:
            invalid_classes = [c for c in selected_classes if c not in all_class_names]
            if invalid_classes:
                raise ValueError(f"Invalid classes: {invalid_classes}")
            self.class_names = sorted(
                [c for c in all_class_names if c in selected_classes]
            )
        else:
            self.class_names = sorted(all_class_names)

        self.class_to_idx = {name: idx for idx, name in enumerate(self.class_names)}

        # Load image paths and labels
        self.samples = self._load_samples()

    def _load_class_names(self) -> List[str]:
        """Load class names from meta file"""
        meta_file = self.root_dir / "meta" / "classes.txt"
        with open(meta_file, "r") as f:
            class_names = [line.strip() for line in f.readlines()]
        return class_names

    def _load_samples(self) -> List[Tuple[str, int]]:
        """Load image paths and labels"""
        samples = []

        if self.split == "train":
            meta_file = self.root_dir / "meta" / "train.txt"
        else:
            meta_file = self.root_dir / "meta" / "test.txt"

        with open(meta_file, "r") as f:
            for line in f:
                class_name, image_name = line.strip().split("/")

                if class_name in self.class_to_idx:
                    image_path = (
                        self.root_dir / "images" / class_name / f"{image_name}.jpg"
                    )

                    if image_path.exists():
                        label = self.class_to_idx[class_name]
                        samples.append((str(image_path), label))

        return samples

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        image_path, label = self.samples[idx]
        image = Image.open(image_path).convert("RGB")

        if self.transform:
            image = self.transform(image)

        return image, label


class GenericDataset(Dataset):
    """Generic dataset loader for any dataset with class folders"""

    def __init__(
        self,
        root_dir: str,
        class_mapping: Dict[str, int],
        transform=None,
        split: Optional[str] = None,
        split_ratio: Optional[float] = None,
    ):
        """
        Generic dataset loader

        Args:
            root_dir: Root directory of the dataset
            class_mapping: Dict mapping class names to label indices
            transform: Image transformations
            split: 'train' or 'val' - if None, uses all data
            split_ratio: If split is specified and no split file, use this ratio
        """
        self.root_dir = Path(root_dir)
        self.class_mapping = class_mapping
        self.transform = transform

        # Load all samples first
        all_samples = []
        for class_name in class_mapping.keys():
            class_dir = self.root_dir / class_name
            if class_dir.exists():
                for img_file in class_dir.glob("*.jpg"):
                    all_samples.append((str(img_file), class_mapping[class_name]))
                for img_file in class_dir.glob("*.png"):
                    all_samples.append((str(img_file), class_mapping[class_name]))
                for img_file in class_dir.glob("*.jpeg"):
                    all_samples.append((str(img_file), class_mapping[class_name]))

        # If split is a file path, use it
        split_path_obj = Path(split) if split else None
        if split_path_obj and split_path_obj.exists() and split_path_obj.is_file():
            with open(split, "r") as f:
                split_paths = set(line.strip() for line in f.readlines())
            self.samples = [
                (path, label)
                for path, label in all_samples
                if Path(path).name in split_paths
                or str(Path(path).relative_to(self.root_dir)) in split_paths
            ]
        elif split and split_ratio and split in ["train", "val"]:
            # Random split
            import random

            random.shuffle(all_samples)
            split_idx = int(len(all_samples) * split_ratio)
            if split == "train":
                self.samples = all_samples[:split_idx]
            else:
                self.samples = all_samples[split_idx:]
        else:
            self.samples = all_samples

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        image_path, label = self.samples[idx]
        image = Image.open(image_path).convert("RGB")

        if self.transform:
            image = self.transform(image)

        return image, label


class CombinedDataset(Dataset):
    """Combine multiple datasets"""

    def __init__(self, datasets: List[Dataset]):
        self.datasets = datasets
        self.cumulative_sizes = self._get_cumulative_sizes()

    def _get_cumulative_sizes(self):
        cumulative_sizes = []
        cumsum = 0
        for dataset in self.datasets:
            cumsum += len(dataset)
            cumulative_sizes.append(cumsum)
        return cumulative_sizes

    def __len__(self):
        return self.cumulative_sizes[-1] if self.cumulative_sizes else 0

    def __getitem__(self, idx):
        if idx < 0:
            if -idx > len(self):
                raise ValueError(
                    "Absolute value of index should not exceed dataset length"
                )
            idx = len(self) + idx

        dataset_idx = 0
        for i, size in enumerate(self.cumulative_sizes):
            if idx < size:
                dataset_idx = i
                break

        if dataset_idx > 0:
            idx = idx - self.cumulative_sizes[dataset_idx - 1]

        return self.datasets[dataset_idx][idx]


def get_data_transforms(image_size: int = 224, augment: bool = True):
    """Get data transforms for training and validation"""

    if augment:
        train_transform = transforms.Compose(
            [
                transforms.Resize((image_size, image_size)),
                transforms.RandomHorizontalFlip(p=0.5),
                transforms.RandomRotation(degrees=15),
                transforms.ColorJitter(
                    brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1
                ),
                transforms.RandomResizedCrop(image_size, scale=(0.8, 1.0)),
                transforms.ToTensor(),
                transforms.Normalize(
                    mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]
                ),
            ]
        )
    else:
        train_transform = transforms.Compose(
            [
                transforms.Resize((image_size, image_size)),
                transforms.ToTensor(),
                transforms.Normalize(
                    mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]
                ),
            ]
        )

    val_transform = transforms.Compose(
        [
            transforms.Resize((image_size, image_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )

    return train_transform, val_transform


def download_food101_data(data_dir: Path) -> str:
    """Download and extract Food-101 dataset"""
    data_dir.mkdir(parents=True, exist_ok=True)

    url = "http://data.vision.ee.ethz.ch/cvl/food-101.tar.gz"
    tar_path = data_dir / "food-101.tar.gz"
    extracted_dir = data_dir / "food-101"

    if not tar_path.exists():
        print("Downloading Food-101 dataset (this may take a while)...")
        urllib.request.urlretrieve(url, tar_path)
        print("Download complete!")

    has_content = False
    if extracted_dir.exists():
        images_dir = extracted_dir / "images"
        if images_dir.exists() and any(images_dir.iterdir()):
            has_content = True

    if not has_content:
        print("Extracting dataset...")
        if extracted_dir.exists():
            shutil.rmtree(extracted_dir)

        with tarfile.open(tar_path, "r:gz") as tar:
            tar.extractall(data_dir)
        print("Extraction complete!")

    nested_dir = extracted_dir / "food-101"
    if nested_dir.exists():
        print("Fixing nested directory structure...")
        for item in nested_dir.iterdir():
            dest_path = extracted_dir / item.name
            if dest_path.exists():
                shutil.rmtree(dest_path) if dest_path.is_dir() else dest_path.unlink()
            shutil.move(str(item), str(dest_path))
        nested_dir.rmdir()
        print("Directory structure fixed!")

    return str(extracted_dir)

def create_data_loaders(config: Config, num_workers: Optional[int] = None):
    """Create data loaders from multiple datasets with class selection"""
    
    if num_workers is None:
        num_workers = 4 if config.GPU_AVAILABLE else 2

    train_transform, val_transform = get_data_transforms(config.IMAGE_SIZE)

    train_datasets = []
    val_datasets = []
    all_class_names = []
    current_class_idx = 0

    # Process each dataset
    for dataset_config in config.DATASETS_CONFIG:
        dataset_name = dataset_config.get("name", "unknown")
        dataset_path = Path(dataset_config["path"])
        selected_classes = dataset_config.get("selected_classes", None)
        train_split = dataset_config.get("train_split", None)
        val_split = dataset_config.get("val_split", None)

        print(f"\nProcessing dataset: {dataset_name}")
        print(f"  Path: {dataset_path}")
        print(f"  Selected classes: {len(selected_classes) if selected_classes else 'All'}")

        # Handle Food-101 specially
        if dataset_name.lower() == "food101":
            food101_train = Food101Dataset(
                dataset_path,
                split="train",
                transform=train_transform,
                selected_classes=selected_classes,
            )
            food101_val = Food101Dataset(
                dataset_path,
                split="test",
                transform=val_transform,
                selected_classes=selected_classes,
            )
            
            # Add classes to master list
            for class_name in food101_train.class_names:
                all_class_names.append(class_name)
            
            train_datasets.append(food101_train)
            val_datasets.append(food101_val)
            current_class_idx += len(food101_train.class_names)
        
        else:
            # Generic dataset - load class names from directory structure
            if not dataset_path.exists():
                print(f"Warning: Dataset path does not exist: {dataset_path}")
                continue
            
            # Get available classes from directory structure
            available_classes = [
                d.name for d in dataset_path.iterdir() 
                if d.is_dir() and not d.name.startswith('.')
            ]
            
            if selected_classes:
                # Filter to selected classes
                classes_to_use = [c for c in selected_classes if c in available_classes]
                invalid = [c for c in selected_classes if c not in available_classes]
                if invalid:
                    print(f"Warning: Invalid classes: {invalid}")
            else:
                classes_to_use = available_classes
            
            # Create class mapping
            class_mapping = {}
            for class_name in classes_to_use:
                class_mapping[class_name] = current_class_idx
                all_class_names.append(class_name)
                current_class_idx += 1
            
            # Create datasets
            generic_train = GenericDataset(
                dataset_path,
                class_mapping,
                transform=train_transform,
                split=train_split if train_split else "train",
                split_ratio=0.8 if not train_split else None,
            )
            generic_val = GenericDataset(
                dataset_path,
                class_mapping,
                transform=val_transform,
                split=val_split if val_split else "val",
                split_ratio=0.8 if not val_split else None,
            )
            
            train_datasets.append(generic_train)
            val_datasets.append(generic_val)
            
            print(f"Loaded {len(classes_to_use)} classes, {len(generic_train)} train samples, {len(generic_val)} val samples")

    if not train_datasets:
        raise ValueError("No datasets were successfully loaded!")

    # Combine datasets
    combined_train = (
        CombinedDataset(train_datasets)
        if len(train_datasets) > 1
        else train_datasets[0]
    )
    combined_val = (
        CombinedDataset(val_datasets) if len(val_datasets) > 1 else val_datasets[0]
    )

    # Update config
    config.NUM_CLASSES = len(all_class_names)
    config.ALL_CLASS_NAMES = all_class_names

    print(f"\nTotal: {len(all_class_names)} classes across all datasets")
    print(f"   Training samples: {len(combined_train)}")
    print(f"   Validation samples: {len(combined_val)}")

    # Create data loaders
    train_loader = DataLoader(
        combined_train,
        batch_size=config.BATCH_SIZE,
        shuffle=True,
        num_workers=num_workers,
        pin_memory=True if config.GPU_AVAILABLE else False,
    )

    val_loader = DataLoader(
        combined_val,
        batch_size=config.BATCH_SIZE,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=True if config.GPU_AVAILABLE else False,
    )

    return train_loader, val_loader, all_class_names


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


def install_pytorch():
    """Detect system hardware and install appropriate PyTorch version"""
    print("Detecting system hardware for PyTorch installation...")

    has_cuda = False
    try:
        result = subprocess.run(
            "nvidia-smi", shell=True, check=True, capture_output=True, text=True
        )
        if result.returncode == 0:
            has_cuda = True
            print("NVIDIA GPU detected with CUDA support.")
    except Exception:
        print("No NVIDIA GPU detected (likely CPU-only environment).")

    if has_cuda:
        cuda_version = "cu121"
        torch_cmd = f"pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/{cuda_version}"
        desc = f"Installing PyTorch (CUDA {cuda_version})"
    else:
        torch_cmd = "pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu"
        desc = "Installing PyTorch (CPU version)"

    print(f"Running: {torch_cmd}")
    try:
        subprocess.run(torch_cmd, shell=True, check=True)
        print(f"{desc} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"{desc} failed: {e}")
        return False


def setup_environment():
    """Setup the ML environment"""
    print("Setting up Food Recognition ML Pipeline")
    print("=" * 50)

    if sys.version_info < (3, 8):
        print("Python 3.8+ is required")
        sys.exit(1)

    print(f"Python {sys.version_info.major}.{sys.version_info.minor} detected")

    requirements_file = Path(__file__).parent / "requirements.txt"
    if requirements_file.exists():
        print("Installing Python packages from requirements.txt...")
        try:
            subprocess.run(
                f"pip install -r {requirements_file}", shell=True, check=True
            )
            print("Packages installed successfully")
        except subprocess.CalledProcessError as e:
            print(f"Failed to install packages: {e}")
            return False

    config = Config()
    config.create_directories()

    print("\nChecking Food-101 dataset...")
    try:
        data_path = download_food101_data(config.DATA_DIR)  # will d
        print(f"Dataset ready at: {data_path}")
    except Exception as e:
        print(f"Dataset download failed: {e}")
        print("You can download it manually later")

    print("\n" + "=" * 50)
    test_gpu_setup()

    print("\nSetup completed!")
    return True


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Setup and test ML environment")
    parser.add_argument("--test-gpu", action="store_true", help="Test GPU setup only")
    parser.add_argument(
        "--install-pytorch", action="store_true", help="Install PyTorch"
    )
    parser.add_argument("--setup", action="store_true", help="Run full setup")

    args = parser.parse_args()

    if args.test_gpu:
        test_gpu_setup()
    elif args.install_pytorch:
        install_pytorch()
    elif args.setup:
        setup_environment()
    else:
        test_gpu_setup()
