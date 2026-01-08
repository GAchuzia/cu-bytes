# Library Imports
from flask import Blueprint, request

# Project imports
from backend.services.logging_service import log_food_item_by_id_json

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
