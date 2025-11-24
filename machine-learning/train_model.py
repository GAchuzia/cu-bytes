import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.tensorboard import SummaryWriter
import os
from pathlib import Path
import time
from tqdm import tqdm # progress bar
import numpy as np
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import argparse
import json
from typing import Optional

from ml_pipeline_setup import (
    Config,
    create_data_loaders,
    download_food101_data,
    test_gpu_setup,
)
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
        if self.model_name in ["resnet18", "resnet50"]:
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