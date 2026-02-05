# Library imports
from datetime import datetime
from flask import jsonify

# Project imports
from backend.models.food_category import FoodCategory
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

    food_category = FoodCategory.get_by_name(food_item.food_category)

    if food_item.calories is None or food_item.calories <= 0:
        # Log information based entirely on the generic category
        t = create_transaction(
            username=username,
            food_name=food_item.food_name,
            calories=food_category.calories,
            percent_fruit_veg=food_category.percent_fruit_veg,
            percent_grain=food_category.percent_grain,
            percent_dairy=food_category.percent_dairy,
            percent_protein=food_category.percent_protein,
            fat_g=food_category.fat_g,
            carbs_g=food_category.carbs_g,
            proteins_g=food_category.proteins_g,
            fiber_g=food_category.fiber_g,
            sugar_g=food_category.sugar_g,
        )
    else:
        # Sanity check to prevent division by zero
        if food_category.calories == 0:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": (
                            f"Failed to create transaction: FoodCategory "
                            f"'{food_category.category_name}' has calories set to 0."
                        ),
                    }
                ),
                500,
            )

        # Log information based on proportion of known calories
        proportion = food_item.calories / food_category.calories
        t = create_transaction(
            username=username,
            food_name=food_item.food_name,
            calories=food_item.calories,
            percent_fruit_veg=food_category.percent_fruit_veg,
            percent_grain=food_category.percent_grain,
            percent_dairy=food_category.percent_dairy,
            percent_protein=food_category.percent_protein,
            fat_g=round(proportion * food_category.fat_g, 3),
            carbs_g=round(proportion * food_category.carbs_g, 3),
            proteins_g=round(proportion * food_category.proteins_g, 3),
            fiber_g=round(proportion * food_category.fiber_g, 3),
            sugar_g=round(proportion * food_category.sugar_g, 3),
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

    # Check for name in GenericCategory database
    food_category = FoodCategory.get_by_name(food_name)
    t = None

    if food_category is None:
        print(
            "LoggingService: Warning! No matching for "
            f"{food_name}, creating basic transaction"
        )
        # Create transaction with largely unknowns
        t = create_transaction(
            username=username,
            food_name=food_name,
            calories=-1,
            percent_fruit_veg=0,
            percent_grain=0,
            percent_dairy=0,
            percent_protein=0,
            fat_g=-1,
            carbs_g=-1,
            proteins_g=-1,
            fiber_g=-1,
            sugar_g=-1,
        )
    else:
        # Create nutrition breakdown based on the generic category
        t = create_transaction(
            username=username,
            food_name=food_name,
            calories=food_category.calories,
            percent_fruit_veg=food_category.percent_fruit_veg,
            percent_grain=food_category.percent_grain,
            percent_dairy=food_category.percent_dairy,
            percent_protein=food_category.percent_protein,
            fat_g=food_category.fat_g,
            carbs_g=food_category.carbs_g,
            proteins_g=food_category.proteins_g,
            fiber_g=food_category.fiber_g,
            sugar_g=food_category.sugar_g,
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


def get_logging_history_json(username):
    # Ensure valid username
    if UsersAuth.get_user_by_name(username) is None:
        print(f"LoggingService: No matching username for {username}")
        return (
            jsonify({"status": "error", "message": "No matching username found"}),
            400,
        )

    try:
        # Get all rows belonging to the current user with most recent at the top
        logs = (
            FoodLogging.query.filter_by(username=username)
            .order_by(FoodLogging.transaction_time.desc())
            .all()
        )

        # Specify desired attributes
        result = [
            {
                col: getattr(log, col)
                for col in (
                    "transaction_time",
                    "food_name",
                    "calories",
                    "fat_g",
                    "carbs_g",
                    "proteins_g",
                    "fiber_g",
                    "sugar_g",
                )
            }
            for log in logs
        ]

        # Return as a JSON response
        return jsonify(result), 200

    except Exception as e:
        print(f"LoggingService: Error retrieving logging history: {e}")
        return jsonify({"error": "Failed to retrieve logging history"}), 500


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
    fat_g,
    carbs_g,
    proteins_g,
    fiber_g,
    sugar_g,
    transaction_time=None,  # Time customization is optional
):
    """Create a new transaction and store it in the database"""
    transaction_time = transaction_time or datetime.now()

    transaction = FoodLogging.create(
        username=username,
        transaction_time=transaction_time,
        food_name=food_name,
        calories=calories,
        percent_fruit_veg=percent_fruit_veg,
        percent_grain=percent_grain,
        percent_dairy=percent_dairy,
        percent_protein=percent_protein,
        fat_g=fat_g,
        carbs_g=carbs_g,
        proteins_g=proteins_g,
        fiber_g=fiber_g,
        sugar_g=sugar_g,
    )
    print(f"LoggingService: Logged {food_name} for user {username}")
    return transaction
