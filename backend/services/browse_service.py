from flask import jsonify

from backend.models.food_item import FoodItem


def get_all_food_items_json():
    try:
        # Transform all food items into JSON-friendly dictionaries
        food_items = FoodItem.query.all()
        result = [{"id": item.id, "name": item.food_name} for item in food_items]

        # Return as a JSON response
        return jsonify(result), 200

    except Exception as e:
        print(f"AuthenticationService: Error retrieving food items: {e}")
        return jsonify({"error": "Failed to retrieve food items"}), 500
