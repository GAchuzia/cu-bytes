from flask import Blueprint
from backend.services.browse_service import get_all_food_items_json

browse_bp = Blueprint("browse", __name__)


@browse_bp.route("/food-items", methods=["GET"])
def get_all_food_items():
    """
    GET /food-items

    Description:
    Retrieves all available food items from the database.

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved all food items
        Response Body (JSON):
        {
            "food_items": [
                {
                    "id": 651,
                    "name": "Yogurt & Berries Parfait"
                },
                {
                    "id": 652,
                    "name": "Yogurt Parfait"
                }
                ...
            ]
        }

    500 Internal Server Error - Database retrieval failed or unexpected error occurred
    """
    return get_all_food_items_json()
