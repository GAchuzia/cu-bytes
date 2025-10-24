import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image
import os
import json
from pathlib import Path
from typing import Tuple, List
import numpy as np
from config import config


class Food101Dataset(Dataset):
    def __init__(self, root_dir: str, split: str = "train", transform=None):
        """
        Food-101 Dataset

        Args:
            root_dir: Path to food-101 directory
            split: 'train', 'test', or 'val'
            transform: Image transformations
        """
        self.root_dir = Path(root_dir)
        self.split = split
        self.transform = transform

        # Load class names
        self.class_names = self._load_class_names()
        self.class_to_idx = {name: idx for idx, name in enumerate(self.class_names)}

        # Load image paths and labels
        self.samples = self._load_samples()

    def _load_class_names(self) -> List[str]:
        """Load class names from meta file"""
        meta_file = self.root_dir / "meta" / "classes.txt"
        with open(meta_file, "r") as f:
            class_names = [line.strip() for line in f.readlines()]
        return sorted(class_names)

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
                image_path = self.root_dir / "images" / class_name / f"{image_name}.jpg"

                if image_path.exists():
                    label = self.class_to_idx[class_name]
                    samples.append((str(image_path), label))

        return samples

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        image_path, label = self.samples[idx]

        # Load image
        image = Image.open(image_path).convert("RGB")

        if self.transform:
            image = self.transform(image)

        return image, label


def get_data_transforms():
    """Get data transforms for training and validation"""

    train_transform = transforms.Compose(
        [
            transforms.Resize((config.IMAGE_SIZE, config.IMAGE_SIZE)),
            transforms.RandomHorizontalFlip(p=0.5),
            transforms.RandomRotation(degrees=15),
            transforms.ColorJitter(
                brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1
            ),
            transforms.RandomResizedCrop(config.IMAGE_SIZE, scale=(0.8, 1.0)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )

    val_transform = transforms.Compose(
        [
            transforms.Resize((config.IMAGE_SIZE, config.IMAGE_SIZE)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )

    return train_transform, val_transform


def create_data_loaders(data_dir: str, batch_size: int = 32, num_workers: int = 4):
    """Create data loaders for training and validation"""

    train_transform, val_transform = get_data_transforms()

    # Create datasets
    train_dataset = Food101Dataset(data_dir, split="train", transform=train_transform)
    val_dataset = Food101Dataset(data_dir, split="test", transform=val_transform)

    # Create data loaders
    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers,
        pin_memory=True if config.GPU_AVAILABLE else False,
    )

    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=True if config.GPU_AVAILABLE else False,
    )

    return train_loader, val_loader, train_dataset.class_names


def download_food101_data():
    """Download and extract Food-101 dataset"""
    import urllib.request
    import tarfile
    import shutil

    data_dir = config.DATA_DIR
    data_dir.mkdir(parents=True, exist_ok=True)

    # Download URL
    url = "http://data.vision.ee.ethz.ch/cvl/food-101.tar.gz"  # original home of the Food 101 dataset
    tar_path = data_dir / "food-101.tar.gz"

    if not tar_path.exists():
        print("Downloading Food-101 dataset...")
        urllib.request.urlretrieve(url, tar_path)
        print("Download complete!")

    # Extract if not already extracted properly
    extracted_dir = data_dir / "food-101"

    # Check if we have actual content (not just empty directories)
    has_content = False
    if extracted_dir.exists():
        # Check if images directory has content
        images_dir = extracted_dir / "images"
        if images_dir.exists() and any(images_dir.iterdir()):
            has_content = True

    if not has_content:
        print("Extracting dataset...")
        # Remove empty directories if they exist
        if extracted_dir.exists():
            shutil.rmtree(extracted_dir)

        with tarfile.open(tar_path, "r:gz") as tar:
            tar.extractall(data_dir)
        print("Extraction complete!")

    # Fix nested directory structure if it exists
    nested_dir = extracted_dir / "food-101"
    if nested_dir.exists():
        print("Fixing nested directory structure...")
        # Move contents from nested directory to parent
        for item in nested_dir.iterdir():
            dest_path = extracted_dir / item.name
            if dest_path.exists():
                shutil.rmtree(dest_path) if dest_path.is_dir() else dest_path.unlink()
            shutil.move(str(item), str(dest_path))

        # Remove empty nested directory
        nested_dir.rmdir()
        print("Directory structure fixed!")

    return str(extracted_dir)
