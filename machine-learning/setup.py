#!/usr/bin/env python3
"""
Setup script for Food Recognition ML Pipeline
"""

import subprocess
import sys
import os
from pathlib import Path


def run_command(command, description):
    """Run a command and handle errors"""
    print(f"Loading {description}...")
    try:
        result = subprocess.run(
            command, shell=True, check=True, capture_output=True, text=True
        )
        print(f"{description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"{description} failed:")
        print(f"Error: {e.stderr}")
        return False


def main():
    print("Setting up Food Recognition ML Pipeline")
    print("=" * 50)

    # Check Python version
    if sys.version_info < (3, 8):
        print("Python 3.8+ is required")
        sys.exit(1)

    print(f"Python {sys.version_info.major}.{sys.version_info.minor} detected")

    # Install requirements
    if not run_command("pip install -r requirements.txt", "Installing Python packages"):
        sys.exit(1)

    # Create directories
    from config import config

    config.create_directories()

    # Download Food-101 dataset
    print("Downloading Food-101 dataset...")
    from data_loader import download_food101_data

    try:
        data_path = download_food101_data()
        print(f"Dataset downloaded to: {data_path}")
    except Exception as e:
        print(f"Failed to download dataset: {e}")
        sys.exit(1)

    print("\nSetup completed successfully!")
    print("\nNext steps:")
    print("1. Run 'python train.py' to train the model")


if __name__ == "__main__":
    main()
