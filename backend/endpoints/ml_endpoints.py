from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
from pathlib import Path
from backend.services.ml_service import predict_food

ml_bp = Blueprint("ml", __name__)

# Configure upload folder
UPLOAD_FOLDER = Path(__file__).resolve().parent.parent.parent / "uploads"
UPLOAD_FOLDER.mkdir(exist_ok=True)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@ml_bp.route("/predict", methods=["POST"])
def predict_food_image():
    """
    POST /ml/predict
    
    Description:
    Upload an image and get food prediction with calories
    
    Request:
    - Content-Type: multipart/form-data
    - Body: image file (form field name: 'image')
    
    Responses:
    200 OK - Successfully predicted food
        Response Body (JSON):
        {
            "food_name": "Burger",
            "confidence": 85.5,
            "calories": 250
        }
    
    400 Bad Request - No file provided or invalid file
    500 Internal Server Error - Prediction failed
    """
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Allowed: png, jpg, jpeg, gif, webp"}), 400
    
    filepath = None
    try:
        # Save file temporarily
        filename = secure_filename(file.filename)
        filepath = UPLOAD_FOLDER / filename
        file.save(str(filepath))
        
        # Predict
        result = predict_food(str(filepath))
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up temp file
        if filepath and filepath.exists():
            try:
                filepath.unlink()
            except Exception:
                pass  # Ignore cleanup errors
