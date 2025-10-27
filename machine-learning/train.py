import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.tensorboard import SummaryWriter
import os
from pathlib import Path
import time
from tqdm import tqdm
import numpy as np
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

from config import config
from model import create_model
from data_loader import create_data_loaders, download_food101_data


class Trainer:
    def __init__(self, model_name: str = "resnet50"):
        self.model_name = model_name
        self.model = create_model(model_name=model_name, num_classes=config.NUM_CLASSES)
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

    def train_epoch(self, train_loader):
        """Train for one epoch"""
        self.model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        pbar = tqdm(train_loader, desc="Training")
        for batch_idx, (data, target) in enumerate(pbar):
            data, target = data.to(config.DEVICE), target.to(config.DEVICE)

            self.optimizer.zero_grad()
            output = self.model(data)
            loss = self.criterion(output, target)
            loss.backward()
            self.optimizer.step()

            running_loss += loss.item()
            _, predicted = output.max(1)
            total += target.size(0)
            correct += predicted.eq(target).sum().item()

            # Update progress bar
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
                data, target = data.to(config.DEVICE), target.to(config.DEVICE)

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
            "val_acc": val_acc,
            "model_name": self.model_name,
        }

        # Save regular checkpoint
        checkpoint_path = config.CHECKPOINT_DIR / f"checkpoint_epoch_{epoch}.pth"
        torch.save(checkpoint, checkpoint_path)

        # Save best model
        if is_best:
            torch.save(checkpoint, config.BEST_MODEL_PATH)
            print(f"New best model saved with validation accuracy: {val_acc:.2f}%")
    
    def load_checkpoint(self, checkpoint_path: str):
        """Load a checkpoint and resume training"""
        print(f"Loading checkpoint from {checkpoint_path}")
        
        checkpoint = torch.load(checkpoint_path, map_location=config.DEVICE)
        
        # Load model state
        self.model.load_state_dict(checkpoint['model_state_dict'])
        
        # Load optimizer state
        self.optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
        
        # Load training history
        start_epoch = checkpoint['epoch'] + 1
        self.best_val_acc = checkpoint['val_acc']
        
        print(f"Resuming from epoch {start_epoch}")
        print(f"Best validation accuracy so far: {self.best_val_acc:.2f}%")
        
        return start_epoch

    def train(self, train_loader, val_loader, num_epochs=50, start_epoch=0):
        """Main training loop"""
        print(f"Starting training on {config.DEVICE}")
        print(f"Model: {self.model_name}")
        print(f"Training samples: {len(train_loader.dataset)}")
        print(f"Validation samples: {len(val_loader.dataset)}")
        print(f"Starting from epoch: {start_epoch + 1}")

        for epoch in range(start_epoch, num_epochs):
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


def main(resume_from_checkpoint=None):
    """Main training function"""
    # Print device info
    config.print_device_info()

    # Download data if needed
    data_dir = download_food101_data()

    # Create data loaders
    train_loader, val_loader, class_names = create_data_loaders(
        data_dir,
        batch_size=config.BATCH_SIZE,
        num_workers=4 if config.GPU_AVAILABLE else 2,
    )

    # Create trainer
    trainer = Trainer(model_name="resnet50")

    # Load checkpoint if specified
    start_epoch = 0
    if resume_from_checkpoint:
        start_epoch = trainer.load_checkpoint(resume_from_checkpoint)

    # Start training
    trainer.train(train_loader, val_loader, num_epochs=config.NUM_EPOCHS, start_epoch=start_epoch)

if __name__ == "__main__":
    import sys
    checkpoint_path = sys.argv[1] if len(sys.argv) > 1 else None
    main(resume_from_checkpoint=checkpoint_path)
