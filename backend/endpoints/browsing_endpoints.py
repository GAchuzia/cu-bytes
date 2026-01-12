from flask import Blueprint
from backend.services.browse_service import (
    get_all_food_items_json,
    get_food_item_by_id_json
)

browse_bp = Blueprint("browse", __name__)


@browse_bp.route("/food-items", methods=["GET"])
def get_all_food_items():
    """
    GET /browse/food-items

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


@browse_bp.route("/food-item/<int:id>", methods=["GET"])
def get_food_item_by_id(id):
    """
    GET /browse/food-item/{id}

    Description:
    Retrieve information about the food item with id {id}

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved the specified food item
        Response Body (JSON):
        {
            "calories": 310,
            "comments": "",
            "cost": 5.7,
            "dining_location": "Tunnel Junction",
            "has_eggs": null,
            "has_fish": null,
            "has_milk": null,
            "has_peanuts": null,
            "has_sesame": null,
            "has_shellfish": null, # Added 01/11/2026
            "has_soy": null,
            "has_treenuts": null,
            "has_wheat": null,
            "id": 651,
            "is_dairy_free": null,
            "is_gluten_free": false,
            "is_halal": null,
            "is_kosher": null,
            "is_vegan": false,
            "is_vegetarian": null, # Added 01/11/2026
            "last_updated": "9/26/2025",
            "name": "Yogurt & Berries Parfait"
        }

    400 Bad Request - Item not found
    500 Internal Server Error - Database retrieval failed or unexpected error occurred
    """
    return get_food_item_by_id_json(food_id=id)
