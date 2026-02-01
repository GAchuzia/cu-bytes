import torch
from pathlib import Path
from typing import List, Optional, Dict, Any
import json
from datetime import datetime


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
        self.DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.GPU_AVAILABLE = torch.cuda.is_available()

        self.BASE_DIR = base_dir if base_dir else Path(__file__).resolve().parent
        self.DATA_DIR = self.BASE_DIR / "data"
        self.MODELS_DIR = self.BASE_DIR / "models"
        
        # Run-specific directories (will be set when create_run_directory is called)
        self.RUN_DIR = None
        self.CHECKPOINT_DIR = None
        self.BEST_MODEL_PATH = None
        self.TENSORBOARD_DIR = None

        self.IMAGE_SIZE = image_size
        self.BATCH_SIZE = batch_size
        self.LEARNING_RATE = learning_rate
        self.NUM_EPOCHS = num_epochs
        self.TRAIN_SPLIT = train_split
        self.VAL_SPLIT = val_split
        self.TEST_SPLIT = test_split
        self.MODEL_NAME = model_name

        self.DATASETS_CONFIG = datasets_config or []
        self.DATASETS_METADATA = {}
        self.NUM_CLASSES = None
        self.ALL_CLASS_NAMES = []

    def print_device_info(self):
        """Print device information"""
        print(f"Device: {self.DEVICE}")
        if self.GPU_AVAILABLE:
            print(f"GPU: {torch.cuda.get_device_name(0)}")
            print(
                f"GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB"
            )
        else:
            print("Using CPU")

    def create_directories(self):
        """Create necessary directories"""
        for directory in [self.DATA_DIR, self.MODELS_DIR]:
            directory.mkdir(parents=True, exist_ok=True)
        
        # Run-specific directories are created in create_run_directory()
    
    def create_run_directory(self, model_name: str = "food_classifier", run_name: Optional[str] = None):
        """
        Create a unique directory for this training run.
        
        Args:
            model_name: Name of the model architecture (e.g., 'resnet50')
            run_name: Optional custom name for the run. If None, uses timestamp.
        
        Returns:
            Path to the created run directory
        """
        if run_name is None:
            # Create timestamp-based run name: YYYYMMDD_HHMMSS_modelname
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            run_name = f"{timestamp}_{model_name}"
        
        self.RUN_DIR = self.MODELS_DIR / "runs" / run_name
        self.CHECKPOINT_DIR = self.RUN_DIR / "checkpoints"
        self.BEST_MODEL_PATH = self.RUN_DIR / "best_model.pth"
        self.TENSORBOARD_DIR = self.RUN_DIR / "tensorboard"
        
        # Create all run-specific directories
        for directory in [self.RUN_DIR, self.CHECKPOINT_DIR, self.TENSORBOARD_DIR]:
            directory.mkdir(parents=True, exist_ok=True)
        
        return self.RUN_DIR

    @classmethod
    def from_config_file(
        cls,
        config_file_path: Optional[Path] = None,
        base_dir: Optional[Path] = None,
        **override_kwargs,
    ) -> "Config":
        """Create Config instance from datasets_config.json file"""
        if config_file_path is None:
            config_file_path = Path(__file__).resolve().parent / "datasets_config.json"

        if not config_file_path.exists():
            raise FileNotFoundError(
                f"Datasets config file not found: {config_file_path}"
            )

        with open(config_file_path, "r") as f:
            datasets_metadata = json.load(f)

        datasets_config = []
        for dataset_info in datasets_metadata.get("datasets", []):
            if not dataset_info.get("enabled", True):
                continue

            dataset_config_entry = {
                "name": dataset_info["name"],
                "path": None,
                "metadata": dataset_info,
            }

            if base_dir:
                dataset_config_entry["path"] = str(
                    base_dir
                    / "data"
                    / dataset_info.get("extract_to", dataset_info["name"])
                )
            else:
                script_dir = Path(__file__).resolve().parent
                dataset_config_entry["path"] = str(
                    script_dir
                    / "data"
                    / dataset_info.get("extract_to", dataset_info["name"])
                )

            datasets_config.append(dataset_config_entry)

        config_kwargs = {
            "base_dir": base_dir,
            "datasets_config": datasets_config,
            **override_kwargs,
        }

        config = cls(**config_kwargs)
        config.DATASETS_METADATA = datasets_metadata
        return config
