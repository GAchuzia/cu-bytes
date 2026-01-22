# Library Imports
from flask import Blueprint, request

# Project imports
from backend.services.logging_service import (
    log_food_item_by_id_json,
    log_food_item_by_name_json,
    get_logging_history_json,
)

logging_bp = Blueprint("logging", __name__)


@logging_bp.route("/log-by-id", methods=["POST"])
def log_food_item_by_id():
    """
    POST /logging/log-by-id

    Description:
    Records the intake of a food item by a user.
    Nutrition data will be derived based on the food_id.

    Request Body (JSON):
    {
        "username": "string",       # required
        "food_id": 123,             # required, int
    }

    Responses:
    200 OK - Successfully recorded the transaction
    400 Bad Request - Invalid argument
    500 Internal Server Error - Error adding transaction to database
    """
    data = request.json
    return log_food_item_by_id_json(data)


@logging_bp.route("/log-by-name", methods=["POST"])
def log_food_item_by_name():
    """
    POST /logging/log-by-name

    Description:
    Records the intake of a food item by a user.
    Nutrition data will be derived based on the name.
    The name must match a generic food category.

    Request Body (JSON):
    {
        "username": "string",       # required
        "food_name": "string",      # required
    }

    Responses:
    200 OK - Successfully recorded the transaction
    400 Bad Request - Invalid argument
    500 Internal Server Error - Error adding transaction to database
    """
    data = request.json
    return log_food_item_by_name_json(data)


@logging_bp.route("/history/<string:username>", methods=["GET"])
def get_logging_history(username):
    """
    GET /logging/history/{username}

    Description:
    Gets the items logged by the user.
    Items will be returned with the most recently logged items at the start.

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved food history
        Response Body (JSON):
        [
            {
                "calories": 250,
                "carbs_g": 42.0,
                "fat_g": 4.2,
                "fiber_g": 6.8,
                "food_name": "Oatmeal",
                "proteins_g": 9.5,
                "sugar_g": 7.1,
                "transaction_time": "Wed, 21 Jan 2026 08:35:58 GMT"
            },
            {
                "calories": 420,
                "carbs_g": 18.7,
                "fat_g": 14.3,
                "fiber_g": 6.1,
                "food_name": "Chicken Salad",
                "proteins_g": 32.5,
                "sugar_g": 4.2,
                "transaction_time": "Wed, 21 Jan 2026 08:35:58 GMT"
            },
            {
                "calories": 320,
                "carbs_g": 45.2,
                "fat_g": 6.5,
                "fiber_g": 5.4,
                "food_name": "Yogurt Parfait",
                "proteins_g": 12.8,
                "sugar_g": 22.0,
                "transaction_time": "Wed, 21 Jan 2026 08:35:58 GMT"
            }
        ]
    400 Bad Request - Invalid username
    500 Internal Server Error - Error retreiving food history
    """
    return get_logging_history_json(username)
