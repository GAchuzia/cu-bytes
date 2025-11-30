import sys
import subprocess
import time
import torch
from pathlib import Path
from typing import Optional
from config import Config
from download import download_all_datasets, download_food101_data


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

        device = torch.device("cuda")
        a = torch.randn(1000, 1000, device=device)
        b = torch.randn(1000, 1000, device=device)

        start_time = time.time()
        c = torch.matmul(a, b)
        torch.cuda.synchronize()
        gpu_time = time.time() - start_time

        print(f"\nGPU matrix multiplication (1000x1000): {gpu_time:.4f} seconds")
        print("GPU setup is working correctly!")
        return True
    else:
        print("CUDA not available. Training will use CPU (much slower).")
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
        torch_cmd = "pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121"
        desc = "Installing PyTorch (CUDA 12.1)"
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


def setup_environment(config_file_path: Optional[Path] = None):
    """Setup the ML environment and download all configured datasets"""
    print("Setting up Food Recognition ML Pipeline")
    print("=" * 60)

    if sys.version_info < (3, 8):
        print("Python 3.8+ is required")
        sys.exit(1)

    print(f"Python {sys.version_info.major}.{sys.version_info.minor} detected")

    requirements_file = Path(__file__).resolve().parent / "requirements.txt"
    if requirements_file.exists():
        print("\nInstalling Python packages from requirements.txt...")
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

    print("\n" + "=" * 60)
    try:
        downloaded_paths = download_all_datasets(config.DATA_DIR, config_file_path)
        print(f"Successfully processed {len(downloaded_paths)} dataset(s)")
    except FileNotFoundError:
        print("Config file not found. Downloading Food-101 as fallback...")
        try:
            download_food101_data(config.DATA_DIR)
        except Exception as e:
            print(f"Dataset download failed: {e}")
    except Exception as e:
        print(f"Error during dataset download: {e}")

    print("\n" + "=" * 60)
    test_gpu_setup()
    print("\n" + "=" * 60)
    print("Setup completed!")
    print("=" * 60)
    return True


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Setup and test ML environment")
    parser.add_argument("--test-gpu", action="store_true", help="Test GPU setup only")
    parser.add_argument(
        "--install-pytorch", action="store_true", help="Install PyTorch"
    )
    parser.add_argument("--setup", action="store_true", help="Run full setup")
    parser.add_argument(
        "--config",
        type=str,
        default=None,
        help="Path to datasets_config.json file",
    )

    args = parser.parse_args()
    config_path = Path(args.config) if args.config else None

    if args.test_gpu:
        test_gpu_setup()
    elif args.install_pytorch:
        install_pytorch()
    elif args.setup:
        setup_environment(config_path)
    else:
        test_gpu_setup()

