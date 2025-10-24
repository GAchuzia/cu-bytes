import torch
import os
from pathlib import Path


class Config:
    DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    GPU_AVAILABLE = torch.cuda.is_available()

    BASE_DIR = Path(__file__).resolve().parent
    DATA_DIR = BASE_DIR / "data"
    MODELS_DIR = BASE_DIR / "models"
    NOTEBOOKS_DIR = BASE_DIR / "notebooks"

    # Food-101 Dataset
    FOOD101_DIR = DATA_DIR / "food-101"
    FOOD101_IMAGES_DIR = FOOD101_DIR / "images"
    FOOD101_META_DIR = FOOD101_DIR / "meta"

    # Model configuration
    NUM_CLASSES = 101  # Food-101 has 101 classes
    IMAGE_SIZE = 224
    BATCH_SIZE = 32
    LEARNING_RATE = 1e-4
    NUM_EPOCHS = 50

    # Training configuration
    TRAIN_SPLIT = 0.8
    VAL_SPLIT = 0.1
    TEST_SPLIT = 0.1

    # Model saving
    MODEL_NAME = "food_classifier"
    CHECKPOINT_DIR = MODELS_DIR / "checkpoints"
    BEST_MODEL_PATH = MODELS_DIR / "best_model.pth"

    # API configuration
    API_HOST = "localhost"
    API_PORT = 5001

    @classmethod
    def print_device_info(cls):
        """Prints user-friendly device information"""

        print(f"Device: {cls.DEVICE}")
        if cls.GPU_AVAILABLE:
            print(f"GPU: {torch.cuda.get_device_name(0)}")
            print(
                f"GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB"
            )
        else:
            print("Using CPU")

    @classmethod
    def create_directories(cls):
        """Create necessary directories for machine learning project"""
        directories = [
            cls.DATA_DIR,
            cls.MODELS_DIR,
            cls.NOTEBOOKS_DIR,
            cls.FOOD101_DIR,
            cls.FOOD101_IMAGES_DIR,
            cls.FOOD101_META_DIR,
            cls.CHECKPOINT_DIR,
        ]

        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)
            print(f"Created directory: {directory}")


# Initialize config
config = Config()
