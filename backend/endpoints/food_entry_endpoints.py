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
                "calories": 480,
                "carbs_g": 75.733,
                "dining_location": "Starbucks",
                "fat_g": 19.319,
                "fiber_g": 2.489,
                "food_name": "Double Chocolate Brownie",
                "proteins_g": 5.689,
                "sugar_g": 43.378,
                "transaction_time": "Sat, 07 Feb 2026 14:12:17 GMT"
            },
            {
                "calories": 320,
                "carbs_g": 27.0,
                "dining_location": "Mike's Place",
                "fat_g": 19.0,
                "fiber_g": 0.0,
                "food_name": "Popcorn Shrimp",
                "proteins_g": 11.0,
                "sugar_g": 9.09,
                "transaction_time": "Sat, 07 Feb 2026 14:12:05 GMT"
            },
            {
                "calories": -1,
                "carbs_g": -1.0,
                "dining_location": "Unknown",
                "fat_g": -1.0,
                "fiber_g": -1.0,
                "food_name": "Shrimp And Grits",
                "proteins_g": -1.0,
                "sugar_g": -1.0,
                "transaction_time": "Sat, 07 Feb 2026 14:11:46 GMT"
            }
        ]
    400 Bad Request - Invalid username
    500 Internal Server Error - Error retreiving food history
    """
    return get_logging_history_json(username)
