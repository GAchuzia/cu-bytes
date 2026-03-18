# Library imports
from flask import jsonify

# Project imports
from backend.models.food_category import FoodCategory
from backend.models.food_item import FoodItem, get_dining_location_name

"""
Methods directly connected to endpoints
These methods return a JSON object and should end in _json
"""


def get_all_food_items_json():
    try:
        # Transform all food items into JSON-friendly dictionaries
        food_items = FoodItem.query.all()
        result = [
            {"id": item.id, "name": item.food_name, "location": item.dining_location}
            for item in food_items
        ]

        # Return as a JSON response
        return jsonify(result), 200

    except Exception as e:
        print(f"BrowsingService: Error retrieving food items: {e}")
        return jsonify({"error": "Failed to retrieve food items"}), 500


def get_food_item_by_id_json(food_id):
    try:
        item = FoodItem.get_by_id(food_id)
        if item is None:
            return {"error": f"Food item with id {food_id} not found"}, 400

        category = FoodCategory.get_by_name(item.food_category)
        if category is None:
            return {"error": f"Food category for '{item.food_category}' not found"}, 400

        # Base JSON from item
        result = item.to_json()

        # Supplement calories if unknown
        calories = result.get("calories")
        if calories is None or calories == -1:
            result["calories"] = str(category.calories) + "*"

        # Add nutrition fields from category
        result.update(
            {
                "fat_g": category.fat_g,
                "carbs_g": category.carbs_g,
                "proteins_g": category.proteins_g,
                "fiber_g": category.fiber_g,
                "sugar_g": category.sugar_g,
            }
        )

        return result, 200

    except Exception as e:
        print("BrowsingService: Error retrieving food item " f"information: {e}")
        return {"error": "Failed to retrieve food item information"}, 500


def get_food_item_by_name_json(data):
    food_name = data.get("food_name")

    # Validate input
    if not isinstance(food_name, str) or len(food_name) == 0:
        print("BrowsingService: food_name is required and must be a non-empty string")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "food_name is required and must be a non-empty string",
                }
            ),
            400,
        )

    try:
        food_items = FoodItem.query.filter_by(food_category=food_name).all()

        food_list = [
            {
                "id": item.id,
                "name": item.food_name,
                "dining_location": get_dining_location_name(item.dining_location),
            }
            for item in food_items
        ]

        # Return as a JSON response
        return jsonify({"food_items": food_list}), 200

    except Exception as e:
        print(f"BrowsingService: Error retrieving food items by category name: {e}")
        return {"error": "Failed to retrieve food item information"}, 500
