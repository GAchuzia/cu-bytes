import torch
import torchvision.transforms as transforms
from PIL import Image
import json
from pathlib import Path
import sys
import os

# Add machine-learning directory to path
ml_dir = Path(__file__).resolve().parent.parent.parent / "machine-learning"
sys.path.insert(0, str(ml_dir))

from train import load_model

# Global variables to cache the model
_model = None
_class_names = None
_device = None
_transform = None


def load_ml_model():
    """Load the ML model and class names (cached after first load)"""
    global _model, _class_names, _device, _transform
    
    if _model is not None:
        return _model, _class_names, _device, _transform
    
    # Paths
    base_dir = Path(__file__).resolve().parent.parent.parent
    model_path = base_dir / "machine-learning" / "models" / "best_model.pth"
    class_names_path = base_dir / "machine-learning" / "models" / "class_names.json"
    
    if not model_path.exists():
        raise FileNotFoundError(f"Model not found at {model_path}")
    if not class_names_path.exists():
        raise FileNotFoundError(f"Class names not found at {class_names_path}")
    
    # Load class names
    with open(class_names_path, 'r') as f:
        _class_names = json.load(f)
    
    # Set device
    _device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    # Load model
    _model = load_model(
        model_path=str(model_path),
        model_name="resnet50",
        num_classes=len(_class_names),
        device=_device
    )
    _model.eval()
    
    # Image preprocessing transform (matching training preprocessing)
    _transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    return _model, _class_names, _device, _transform


def predict_food(image_file):
    """
    Predict food from an image file
    
    Args:
        image_file: File-like object or path to image
        
    Returns:
        dict with 'food_name', 'confidence', and 'calories'
    """
    try:
        model, class_names, device, transform = load_ml_model()
        
        # Load and preprocess image
        if isinstance(image_file, str):
            image = Image.open(image_file).convert('RGB')
        else:
            image = Image.open(image_file).convert('RGB')
        
        image_tensor = transform(image).unsqueeze(0).to(device)
        
        # Predict
        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            confidence, predicted_idx = torch.max(probabilities, 0)
            
        predicted_class = class_names[predicted_idx.item()]
        confidence_score = confidence.item()
        
        # Extract food name (remove dataset prefix like "food101:")
        food_name = predicted_class.split(":")[-1].replace("_", " ").title()
        
        # Get calories from database
        calories = get_calories_for_food(food_name)
        
        return {
            "food_name": food_name,
            "confidence": round(confidence_score * 100, 2),
            "calories": calories
        }
    except Exception as e:
        raise Exception(f"Prediction error: {str(e)}")


def get_calories_for_food(food_name):
    """
    Look up calories for a food item from the database
    Returns average calories if multiple entries exist, or default estimate if not found
    Note: This function should be called from within a Flask app context
    """
    from backend.models.food_item import FoodItem
    from flask import has_app_context, current_app
    
    # Only query database if we're in an app context
    if has_app_context():
        try:
            # Try to find matching food items (case-insensitive, partial match)
            food_items = FoodItem.query.filter(
                FoodItem.food_name.ilike(f"%{food_name}%")
            ).all()
            
            if not food_items:
                # Try without the dataset prefix format
                simple_name = food_name.lower().replace(" ", "_")
                food_items = FoodItem.query.filter(
                    FoodItem.food_name.ilike(f"%{simple_name}%")
                ).all()
            
            if food_items:
                # Calculate average calories (excluding -1 values)
                valid_calories = [item.calories for item in food_items if item.calories > 0]
                if valid_calories:
                    return int(sum(valid_calories) / len(valid_calories))
        except Exception as e:
            # If database query fails, fall back to defaults
            print(f"Error querying database for calories: {e}")
    
    # Return a default estimate based on common foods
    default_calories = {
        "burger": 250,
        "hamburger": 250,
        "pizza": 300,
        "pasta": 200,
        "salad": 150,
        "sandwich": 300,
        "sushi": 200,
        "tacos": 200,
        "fries": 300,
        "chicken": 250,
        "apple": 95,
        "banana": 105,
        "bread": 80,
        "rice": 130,
        "soup": 100,
        "cake": 350,
        "ice cream": 200,
        "pancakes": 200,
        "waffles": 200,
    }
    
    food_lower = food_name.lower()
    for key, cal in default_calories.items():
        if key in food_lower:
            return cal
    
    return -1  # Unknown
