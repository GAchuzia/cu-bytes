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


def log_food_item_by_id_json(data):
    username = data.get("username")
    food_id = data.get("food_id")

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

    # Validate each field
    if UsersAuth.get_user_by_name(username) is None:
        print(f"LoggingService: No matching username for {username}")
        return (
            jsonify({"status": "error", "message": "No matching username found"}),
            400,
        )

    food_item = FoodItem.get_by_id(food_id)
    if food_item is None:
        print("LoggingService: No matching food_id for {food_id}")
        return (
            jsonify({"status": "error", "message": "No matching food_id found"}),
            400,
        )

    # Fiona TODO: Look for nutrition breakdown based on generic label
    # Will also need to add backup calorie lookup logic here
    t = create_transaction(
        username=username,
        food_name=food_item.food_name,
        calories=food_item.calories,
        percent_fruit_veg=40,
        percent_grain=30,
        percent_dairy=20,
        percent_protein=10,
    )

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


def log_food_item_by_name_json(data):
    username = data.get("username")
    food_name = data.get("food_name")

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

    if not isinstance(food_name, str):
        print("LoggingService: food_name is required and must be a string")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "food_name is required and must be a string",
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

    # Fiona TODO: Check for name in Generic Label database
    # food_item = GenericFoodItem.get_by_id(food_name)
    # if food_item is None:
    #     print("LoggingService: No matching food category for {food_name}")
    #     return (
    #         jsonify({"status": "error", "message": "No matching food_name found"}),
    #         400,
    #     )

    # Fiona TODO: Look for nutrition breakdown based on generic label
    t = create_transaction(
        username=username,
        food_name=food_name,
        calories=150,
        percent_fruit_veg=40,
        percent_grain=30,
        percent_dairy=20,
        percent_protein=10,
    )

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


def create_transaction(
    username,
    food_name,
    calories,
    percent_fruit_veg,
    percent_grain,
    percent_dairy,
    percent_protein,
):
    """Create a new transaction and store it in the database"""

    if percent_fruit_veg + percent_grain + percent_dairy + percent_protein != 100:
        print(
            f"LoggingService: Unable to log {food_name} for user {username}. "
            "Nutrition stats do not add up to 100."
        )
        return None

    transaction = FoodLogging.create(
        username=username,
        transaction_time=datetime.now(),
        food_name=food_name,
        calories=calories,
        percent_fruit_veg=percent_fruit_veg,
        percent_grain=percent_grain,
        percent_dairy=percent_dairy,
        percent_protein=percent_protein,
    )
    print(f"LoggingService: Logged {food_name} for user {username}")
    return transaction
