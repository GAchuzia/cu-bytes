# Library imports
from datetime import datetime
from flask import jsonify

# Project imports
from backend.models.food_logging import FoodLogging
from backend.models.food_item import FoodItem
from backend.models.users_auth import UsersAuth

"""
Methods directly connected to endpoints
These methods return a JSON object and should end in _json
"""


def log_food_item_json(data):
    username = data.get("username")
    food_id = data.get("food_id")
    calories = data.get("calories")

    # Validate input types
    if not isinstance(username, str) or len(username) == 0:
        print("LoggingService: username is required and must be a non-empty string")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "username is required and must be a non-empty string",
                }
            ),
            400,
        )

    if not isinstance(food_id, int):
        print("LoggingService: food_id is required and must be an integer")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "food_id is required and must be an integer",
                }
            ),
            400,
        )

    if not isinstance(calories, int):
        print("LoggingService: calories is required and must be an integer")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "calories is required and must be an integer",
                }
            ),
            400,
        )

    # Validate each field
    if UsersAuth.get_user_by_name(username) is None:
        print(f"LoggingService: No matching username for {username}")
        return (
            jsonify({"status": "error", "message": "No matching username found"}),
            400,
        )

    if FoodItem.get_by_id(food_id) is None:
        print("LoggingService: No matching food_id for {food_id}")
        return (
            jsonify({"status": "error", "message": "No matching food_id found"}),
            400,
        )

    if calories < 0:
        print("LoggingService: Calories cannot be negative")
        return (
            jsonify({"status": "error", "message": "Calories cannot be negative"}),
            400,
        )

    t = create_transaction(username=username, food_id=food_id, calories=calories)

    if t is not None:
        return (
            jsonify({"status": "success", "message": "Transaction recorded"}),
            200,
        )

    print("LoggingService: Error creating transaction")
    return (
        jsonify({"status": "error", "message": "Error creating transaction"}),
        500,
    )


"""
Helper methods
"""


def create_transaction(username, food_id, calories):
    """Create a new transaction and store it in the database"""
    transaction = FoodLogging.create(
        username=username,
        transaction_time=datetime.now(),
        food_id=food_id,
        calories=calories,
    )
    print(f"LoggingService: Logged food id {food_id} for user {username}")
    return transaction
