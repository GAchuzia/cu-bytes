import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.tensorboard import SummaryWriter
import os
import sys
from pathlib import Path
import time
from tqdm import tqdm  # progress bar
import numpy as np
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import argparse
import json
from typing import Optional

from config import Config
from datasets import create_data_loaders
from setup import test_gpu_setup
import torchvision.models as models
from torchvision.models import ResNet50_Weights, EfficientNet_B0_Weights


class FoodClassifier(nn.Module):
    """Food classification model with multiple backbone options"""

    def __init__(
        self,
        num_classes: int = 101,
        model_name: str = "resnet50",
        pretrained: bool = True,
        freeze_backbone: bool = False,
    ):
        super(FoodClassifier, self).__init__()

        self.num_classes = num_classes
        self.model_name = model_name

        # Load pretrained backbone
        if model_name == "resnet50":
            self.backbone = models.resnet50(weights=ResNet50_Weights.IMAGENET1K_V2)
            self.backbone.fc = nn.Linear(self.backbone.fc.in_features, num_classes)

        # elif model_name == "efficientnet_b0":
        #     self.backbone = models.efficientnet_b0(
        #         weights=EfficientNet_B0_Weights.IMAGENET1K_V1
        #     )
        #     self.backbone.classifier[1] = nn.Linear(
        #         self.backbone.classifier[1].in_features, num_classes
        #     )

        # elif model_name == "mobilenet_v3_small":
        #     self.backbone = models.mobilenet_v3_small(
        #         weights=models.MobileNet_V3_Small_Weights.IMAGENET1K_V1
        #     )
        #     self.backbone.classifier[3] = nn.Linear(
        #         self.backbone.classifier[3].in_features, num_classes
        #     )

        else:
            raise ValueError(
                f"Unsupported model: {model_name}. Choose from: resnet50, efficientnet_b0, mobilenet_v3_small"
            )

        if freeze_backbone:
            self.freeze_backbone()

    def forward(self, x):
        return self.backbone(x)

    def freeze_backbone(self):
        """Freeze backbone parameters for fine-tuning"""
        for param in self.backbone.parameters():
            param.requires_grad = False

        # Unfreeze classifier/head
        if self.model_name == "resnet50":
            for param in self.backbone.fc.parameters():
                param.requires_grad = True
        elif self.model_name == "efficientnet_b0":
            for param in self.backbone.classifier.parameters():
                param.requires_grad = True
        elif self.model_name == "mobilenet_v3_small":
            for param in self.backbone.classifier.parameters():
                param.requires_grad = True

    def unfreeze_all(self):
        """Unfreeze all parameters"""
        for param in self.backbone.parameters():
            param.requires_grad = True


def create_model(
    model_name: str = "resnet50",
    num_classes: Optional[int] = None,
    pretrained: bool = True,
    freeze_backbone: bool = False,
    device: torch.device = None,
    config: Optional[Config] = None,
):
    """Create and return a food classification model"""

    # Get num_classes from config if not provided
    if num_classes is None:
        if config and config.NUM_CLASSES:
            num_classes = config.NUM_CLASSES
        else:
            raise ValueError(
                "num_classes must be provided or config.NUM_CLASSES must be set"
            )

    if device is None:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model = FoodClassifier(
        num_classes=num_classes,
        model_name=model_name,
        pretrained=pretrained,
        freeze_backbone=freeze_backbone,
    )

    model = model.to(device)

    return model


def load_model(
    model_path: str,
    model_name: str = "resnet50",
    num_classes: Optional[int] = None,
    device: torch.device = None,
):
    """Load a trained model from checkpoint"""

    # Set device first
    if device is None:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Load checkpoint
    checkpoint = torch.load(model_path, map_location=device)

    # Get num_classes from checkpoint if not provided
    if num_classes is None:
        if "num_classes" in checkpoint:
            num_classes = checkpoint["num_classes"]
        elif "config" in checkpoint and "num_classes" in checkpoint["config"]:
            num_classes = checkpoint["config"]["num_classes"]
        else:
            raise ValueError(
                f"num_classes not found in checkpoint. "
                f"Please provide num_classes parameter or retrain model."
            )

    # Create model with correct number of classes
    model = create_model(
        model_name=model_name, num_classes=num_classes, pretrained=False, device=device
    )

    # Load model weights
    if "model_state_dict" in checkpoint:
        model.load_state_dict(checkpoint["model_state_dict"])
    else:
        model.load_state_dict(checkpoint)

    model.eval()
    return model


class Trainer:
    """Training class with GPU memory optimization"""

    def __init__(
        self,
        config: Config,
        model_name: str = "resnet50",
        resume_from: Optional[str] = None,
        freeze_backbone: bool = False,
    ):
        self.config = config
        self.model_name = model_name
        self.freeze_backbone = freeze_backbone

        # Create model
        self.model = create_model(
            model_name=model_name,
            num_classes=config.NUM_CLASSES,
            freeze_backbone=freeze_backbone,
            device=config.DEVICE,
        )

        # Optimize for GPU memory if needed
        if config.GPU_AVAILABLE:
            # Use mixed precision training for memory efficiency
            self.use_amp = True
            self.scaler = torch.amp.GradScaler('cuda')
        else:
            self.use_amp = False
            self.scaler = None

        self.criterion = nn.CrossEntropyLoss()
        self.optimizer = optim.Adam(self.model.parameters(), lr=config.LEARNING_RATE)
        self.scheduler = optim.lr_scheduler.ReduceLROnPlateau(
            self.optimizer, mode="min", factor=0.5, patience=5
        )

        # Create directories
        config.create_directories()

        # Setup logging
        self.writer = SummaryWriter(config.MODELS_DIR / "runs")

        # Training history
        self.train_losses = []
        self.val_losses = []
        self.train_accuracies = []
        self.val_accuracies = []
        self.best_val_acc = 0.0
        self.start_epoch = 0

        # Resume from checkpoint if specified
        if resume_from:
            self.load_checkpoint(resume_from)

    def train_epoch(self, train_loader):
        """Train for one epoch with optional mixed precision"""
        self.model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        pbar = tqdm(train_loader, desc="Training")
        for batch_idx, (data, target) in enumerate(pbar):
            data, target = data.to(self.config.DEVICE), target.to(self.config.DEVICE)

            self.optimizer.zero_grad()

            if self.use_amp:
                # Mixed precision training
                with torch.cuda.amp.autocast():
                    output = self.model(data)
                    loss = self.criterion(output, target)

                self.scaler.scale(loss).backward()
                self.scaler.step(self.optimizer)
                self.scaler.update()
            else:
                output = self.model(data)
                loss = self.criterion(output, target)
                loss.backward()
                self.optimizer.step()

            running_loss += loss.item()
            _, predicted = output.max(1)
            total += target.size(0)
            correct += predicted.eq(target).sum().item()

            pbar.set_postfix(
                {"Loss": f"{loss.item():.4f}", "Acc": f"{100.*correct/total:.2f}%"}
            )

        epoch_loss = running_loss / len(train_loader)
        epoch_acc = 100.0 * correct / total

        return epoch_loss, epoch_acc

    def validate_epoch(self, val_loader):
        """Validate for one epoch"""
        self.model.eval()
        running_loss = 0.0
        correct = 0
        total = 0

        with torch.no_grad():
            pbar = tqdm(val_loader, desc="Validation")
            for data, target in pbar:
                data, target = data.to(self.config.DEVICE), target.to(
                    self.config.DEVICE
                )

                if self.use_amp:
                    with torch.cuda.amp.autocast():
                        output = self.model(data)
                        loss = self.criterion(output, target)
                else:
                    output = self.model(data)
                    loss = self.criterion(output, target)

                running_loss += loss.item()
                _, predicted = output.max(1)
                total += target.size(0)
                correct += predicted.eq(target).sum().item()

                pbar.set_postfix(
                    {"Loss": f"{loss.item():.4f}", "Acc": f"{100.*correct/total:.2f}%"}
                )

        epoch_loss = running_loss / len(val_loader)
        epoch_acc = 100.0 * correct / total

        return epoch_loss, epoch_acc

    def save_checkpoint(self, epoch, val_acc, is_best=False):
        """Save model checkpoint"""
        checkpoint = {
            "epoch": epoch,
            "model_state_dict": self.model.state_dict(),
            "optimizer_state_dict": self.optimizer.state_dict(),
            "scheduler_state_dict": self.scheduler.state_dict(),
            "val_acc": val_acc,
            "model_name": self.model_name,
            "num_classes": self.config.NUM_CLASSES,
            "config": {
                "batch_size": self.config.BATCH_SIZE,
                "learning_rate": self.config.LEARNING_RATE,
                "image_size": self.config.IMAGE_SIZE,
            },
        }

        # Save regular checkpoint
        checkpoint_path = self.config.CHECKPOINT_DIR / f"checkpoint_epoch_{epoch}.pth"
        torch.save(checkpoint, checkpoint_path)

        # Save best model
        if is_best:
            torch.save(checkpoint, self.config.BEST_MODEL_PATH)
            print(f"New best model saved with validation accuracy: {val_acc:.2f}%")

    def load_checkpoint(self, checkpoint_path: str):
        """Load a checkpoint and resume training"""
        print(f"Loading checkpoint from {checkpoint_path}")

        checkpoint = torch.load(checkpoint_path, map_location=self.config.DEVICE)

        self.model.load_state_dict(checkpoint["model_state_dict"])
        self.optimizer.load_state_dict(checkpoint["optimizer_state_dict"])

        if "scheduler_state_dict" in checkpoint:
            self.scheduler.load_state_dict(checkpoint["scheduler_state_dict"])

        self.start_epoch = checkpoint["epoch"] + 1
        self.best_val_acc = checkpoint.get("val_acc", 0.0)

        print(f"Resuming from epoch {self.start_epoch}")
        print(f"Best validation accuracy so far: {self.best_val_acc:.2f}%")

    def train(self, train_loader, val_loader, num_epochs=50):
        """Main training loop"""
        print(f"Starting training on {self.config.DEVICE}")
        print(f"Model: {self.model_name}")
        print(f"Training samples: {len(train_loader.dataset)}")
        print(f"Validation samples: {len(val_loader.dataset)}")
        print(f"Number of classes: {self.config.NUM_CLASSES}")
        print(f"Batch size: {self.config.BATCH_SIZE}")
        print(f"Mixed precision: {self.use_amp}")
        print(f"Starting from epoch: {self.start_epoch + 1}")

        for epoch in range(self.start_epoch, num_epochs):
            print(f"\nEpoch {epoch+1}/{num_epochs}")
            print("-" * 50)

            # Train
            train_loss, train_acc = self.train_epoch(train_loader)

            # Validate
            val_loss, val_acc = self.validate_epoch(val_loader)

            # Update scheduler
            self.scheduler.step(val_loss)

            # Store metrics
            self.train_losses.append(train_loss)
            self.val_losses.append(val_loss)
            self.train_accuracies.append(train_acc)
            self.val_accuracies.append(val_acc)

            # Log to tensorboard
            self.writer.add_scalar("Loss/Train", train_loss, epoch)
            self.writer.add_scalar("Loss/Validation", val_loss, epoch)
            self.writer.add_scalar("Accuracy/Train", train_acc, epoch)
            self.writer.add_scalar("Accuracy/Validation", val_acc, epoch)
            self.writer.add_scalar(
                "Learning_Rate", self.optimizer.param_groups[0]["lr"], epoch
            )

            # Print metrics
            print(f"Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.2f}%")
            print(f"Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.2f}%")
            print(f"Learning Rate: {self.optimizer.param_groups[0]['lr']:.6f}")

            # Save checkpoint
            is_best = val_acc > self.best_val_acc
            if is_best:
                self.best_val_acc = val_acc

            self.save_checkpoint(epoch, val_acc, is_best)

            # Early stopping check
            if epoch > 10 and val_acc < max(self.val_accuracies[-10:]) - 2:
                print("Early stopping triggered")
                break

        self.writer.close()
        print(
            f"\nTraining completed! Best validation accuracy: {self.best_val_acc:.2f}%"
        )

        # Save class names for inference
        import json

        class_names_file = self.config.MODELS_DIR / "class_names.json"
        with open(class_names_file, "w") as f:
            json.dump(self.config.ALL_CLASS_NAMES, f, indent=2)
        print(f"Class names saved to {class_names_file}")


def main():
    """Main training function"""
    parser = argparse.ArgumentParser(description="Train food classification model")
    parser.add_argument(
        "--model",
        type=str,
        default="resnet50",
        choices=[
            "resnet50",
            "efficientnet_b0",
            "mobilenet_v3_small",
        ],
        help="Model architecture",
    )
    parser.add_argument("--batch-size", type=int, default=32, help="Batch size")
    parser.add_argument("--epochs", type=int, default=50, help="Number of epochs")
    parser.add_argument("--lr", type=float, default=1e-4, help="Learning rate")
    parser.add_argument("--image-size", type=int, default=224, help="Image size")
    parser.add_argument(
        "--resume", type=str, default=None, help="Resume from checkpoint"
    )
    parser.add_argument(
        "--freeze-backbone", action="store_true", help="Freeze backbone for fine-tuning"
    )
    parser.add_argument(
        "--datasets-config",
        type=str,
        default=None,
        help="Path to JSON file with datasets configuration",
    )
    parser.add_argument(
        "--test-gpu", action="store_true", help="Test GPU before training"
    )

    args = parser.parse_args()

    # Test GPU if requested
    if args.test_gpu:
        test_gpu_setup()
        print()

    # Load configuration
    config_path = Path(args.datasets_config) if args.datasets_config else None

    try:
        config = Config.from_config_file(
            config_file_path=config_path,
            batch_size=args.batch_size,
            image_size=args.image_size,
            learning_rate=args.lr,
            num_epochs=args.epochs,
        )
    except FileNotFoundError:
        print("Error: datasets_config.json not found!")
        print(
            "Please create datasets_config.json or provide path with --datasets-config"
        )
        sys.exit(1)

    # Print device info
    config.print_device_info()
    print()

    # Create data loaders
    print("Creating data loaders...")
    num_workers = 4 if config.GPU_AVAILABLE else 2
    train_loader, val_loader, class_names = create_data_loaders(
        config, num_workers=num_workers
    )

    print(f"\nLoaded {len(class_names)} classes total")
    print()

    # Create trainer
    trainer = Trainer(
        config=config,
        model_name=args.model,
        resume_from=args.resume,
        freeze_backbone=args.freeze_backbone,
    )

    # Start training
    trainer.train(train_loader, val_loader, num_epochs=args.epochs)


if __name__ == "__main__":
    main()
