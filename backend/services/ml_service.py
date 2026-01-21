import torch
import torchvision.transforms as transforms
from PIL import Image
import json
from pathlib import Path
import sys

# Add machine-learning directory to path
ml_dir = Path(__file__).resolve().parent.parent.parent / "machine-learning"
sys.path.insert(0, str(ml_dir))

from train import load_model  # noqa: E402

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
    with open(class_names_path, "r") as f:
        _class_names = json.load(f)

    # Set device
    _device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Load model
    _model = load_model(
        model_path=str(model_path),
        model_name="resnet50",
        num_classes=len(_class_names),
        device=_device,
    )
    _model.eval()

    # Image preprocessing transform (matching training preprocessing)
    _transform = transforms.Compose(
        [
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )

    return _model, _class_names, _device, _transform


def predict_food(image_file):
    """
    Predict food from an image file

    Args:
        image_file: File-like object or path to image

    Returns:
        dict with 'food_name', 'confidence', 'calories', and other dietary tags.
    """
    try:
        model, class_names, device, transform = load_ml_model()

        # Load and preprocess image
        if isinstance(image_file, str):
            image = Image.open(image_file).convert("RGB")
        else:
            image = Image.open(image_file).convert("RGB")

        image_tensor = transform(image).unsqueeze(0).to(device)

        # Predict
        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            confidence, predicted_idx = torch.max(probabilities, 0)

        predicted_class = class_names[predicted_idx.item()]
        confidence_score = confidence.item()

        # Extract food name (remove dataset prefix like "food101:")
        food_name = predicted_class.split(":")[-1].replace("_", " ").title().strip()

        food_category = get_food_category(food_name)
        if food_category is None:
            print("Ml_service: Warning! No FoodCategory for", food_name)

            # Return unknowns for everything besides the name
            return {
                "food_name": food_name,
                "confidence": round(confidence_score * 100, 2),
                "calories": -1,
                "fat_g": None,
                "carbs_g": None,
                "proteins_g": None,
                "fiber_g": None,
                "sugar_g": None,
                "is_vegan": None,
                "is_gluten_free": None,
                "is_halal": None,
                "is_vegetarian": None,
                "is_dairy_free": None,
                "has_eggs": None,
                "has_fish_or_shellfish": None,
                "has_milk": None,
                "has_peanuts": None,
                "has_sesame": None,
                "has_soy": None,
                "has_treenuts": None,
                "has_wheat": None,
            }

        print("Ml_service: FoodCategory is:", food_category)

        # Fill in the object attributes based on the generic category
        obj = {
            "food_name": food_name,
            "confidence": round(confidence_score * 100, 2),
            "calories": food_category.calories,
            "fat_g": food_category.fat_g,
            "carbs_g": food_category.carbs_g,
            "proteins_g": food_category.proteins_g,
            "fiber_g": food_category.fiber_g,
            "sugar_g": food_category.sugar_g,
            "is_vegan": food_category.is_vegan,
            "is_gluten_free": food_category.is_gluten_free,
            "is_halal": food_category.is_halal,
            "is_vegetarian": food_category.is_vegetarian,
            "is_dairy_free": food_category.is_dairy_free,
            "has_eggs": food_category.has_eggs,
            "has_fish_or_shellfish": food_category.has_fish_or_shellfish,
            "has_milk": food_category.has_milk,
            "has_peanuts": food_category.has_peanuts,
            "has_sesame": food_category.has_sesame,
            "has_soy": food_category.has_soy,
            "has_treenuts": food_category.has_treenuts,
            "has_wheat": food_category.has_wheat,
        }

        print("ML_service: returning category object:", obj)
        return obj

    except Exception as e:
        raise Exception(f"Prediction error: {str(e)}")


def get_food_category(food_name):
    """
    Return the FoodCategory associated with the food name.
    If the item is not found, returns None.

    Note: This function should be called from within a Flask app context
    """
    from backend.models.food_category import FoodCategory
    from flask import has_app_context, current_app

    # Only query database if we're in an app context
    if not has_app_context():
        current_app.logger.warning(
            "Ml_service: get_food_category called outside Flask app context"
        )
        return None

    if not isinstance(food_name, str) or not food_name.strip():
        return None

    try:
        item = FoodCategory.query.filter(
            FoodCategory.category_name.ilike(food_name)
        ).first()
        return item

    except Exception as e:
        current_app.logger.error(
            f"Ml_service: Error retrieving food category for '{food_name}': {e}"
        )
        return None
