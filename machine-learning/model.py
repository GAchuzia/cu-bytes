import torch
import torch.nn as nn
import torchvision.models as models
from torchvision.models import ResNet50_Weights, EfficientNet_B0_Weights
from config import config

class FoodClassifier(nn.Module):
    def __init__(self, num_classes: int = 101, model_name: str = 'resnet50', pretrained: bool = True):
        super(FoodClassifier, self).__init__()
        
        self.num_classes = num_classes
        self.model_name = model_name
        
        # Load pretrained backbone
        if model_name == 'resnet50':
            self.backbone = models.resnet50(weights=ResNet50_Weights.IMAGENET1K_V2)
            self.backbone.fc = nn.Linear(self.backbone.fc.in_features, num_classes)
            
        elif model_name == 'efficientnet_b0':
            self.backbone = models.efficientnet_b0(weights=EfficientNet_B0_Weights.IMAGENET1K_V1)
            self.backbone.classifier[1] = nn.Linear(self.backbone.classifier[1].in_features, num_classes)
            
        elif model_name == 'vit_b_16':
            self.backbone = models.vit_b_16(weights=models.ViT_B_16_Weights.IMAGENET1K_V1)
            self.backbone.heads.head = nn.Linear(self.backbone.heads.head.in_features, num_classes)
            
        else:
            raise ValueError(f"Unsupported model: {model_name}")
    
    def forward(self, x):
        return self.backbone(x)
    
    def freeze_backbone(self):
        """Freeze backbone parameters for fine-tuning"""
        for param in self.backbone.parameters():
            param.requires_grad = False
        
        # Unfreeze classifier/head
        if self.model_name == 'resnet50':
            for param in self.backbone.fc.parameters():
                param.requires_grad = True
        elif self.model_name == 'efficientnet_b0':
            for param in self.backbone.classifier.parameters():
                param.requires_grad = True
        elif self.model_name == 'vit_b_16':
            for param in self.backbone.heads.head.parameters():
                param.requires_grad = True
    
    def unfreeze_all(self):
        """Unfreeze all parameters"""
        for param in self.backbone.parameters():
            param.requires_grad = True

def create_model(model_name: str = 'resnet50', num_classes: int = 101, pretrained: bool = True):
    """Create and return a food classification model"""
    
    model = FoodClassifier(num_classes=num_classes, model_name=model_name, pretrained=pretrained)
    
    # Move to device
    model = model.to(config.DEVICE)
    
    return model

def load_model(model_path: str, model_name: str = 'resnet50', num_classes: int = 101):
    """Load a trained model from checkpoint"""
    
    model = create_model(model_name=model_name, num_classes=num_classes, pretrained=False)
    
    checkpoint = torch.load(model_path, map_location=config.DEVICE)
    model.load_state_dict(checkpoint['model_state_dict'])
    
    return model