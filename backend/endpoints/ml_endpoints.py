import traceback
import uuid

from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from pathlib import Path
from backend.services.ml_service import predict_food

ml_bp = Blueprint("ml", __name__)

# Configure upload folder (absolute path under project root)
UPLOAD_FOLDER = Path(__file__).resolve().parent.parent.parent / "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def _ensure_upload_dir():
    UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)


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
            "food_name": string,
            "confidence": float,
            "calories": int
            "fat_g": float,
            "carbs_g": float,
            "proteins_g": float,
            "fiber_g": float,
            "sugar_g": float,
            "is_vegan": bool,
            "is_gluten_free": bool,
            "is_halal": bool,
            "is_vegetarian": bool,
            "is_dairy_free": bool,
            "has_eggs": bool,
            "has_fish_or_shellfish": bool,
            "has_milk": bool,
            "has_peanuts": bool,
            "has_sesame": bool,
            "has_soy": bool,
            "has_treenuts": bool,
            "has_wheat": bool,
        }

    400 Bad Request - No file provided or invalid file
    500 Internal Server Error - Prediction failed
    """
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return (
            jsonify({"error": "Invalid file type. Allowed: png, jpg, jpeg, gif, webp"}),
            400,
        )

    filepath = None
    try:
        _ensure_upload_dir()
        # Use a unique filename to avoid collisions and ensure we write to a known path
        ext = Path(secure_filename(file.filename)).suffix or ".jpg"
        unique_name = f"predict_{uuid.uuid4().hex}{ext}"
        filepath = (UPLOAD_FOLDER.resolve() / unique_name)
        file.save(str(filepath))

        if not filepath.exists():
            return jsonify({"error": "Failed to save uploaded file"}), 500

        # Predict
        result = predict_food(str(filepath))

        return jsonify(result), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up temp file
        if filepath and filepath.exists():
            try:
                filepath.unlink()
            except Exception:
                pass  # Ignore cleanup errors
