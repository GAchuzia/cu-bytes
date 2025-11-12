# Library imports
from flask import jsonify

# Project imports
from backend.models.food_item import FoodItem


def get_all_food_items_json():
    try:
        # Transform all food items into JSON-friendly dictionaries
        food_items = FoodItem.query.all()
        result = [{"id": item.id, "name": item.food_name} for item in food_items]

        # Return as a JSON response
        return jsonify(result), 200

    except Exception as e:
        print(f"BrowsingService: Error retrieving food items: {e}")
        return jsonify({"error": "Failed to retrieve food items"}), 500


def get_food_item_by_id_json(food_id):
    try:
        item = FoodItem.get_by_id(food_id)
        if item:
            return item.to_json(), 200
        else:
            return {"error": f"Food item with id {food_id} not found"}, 400

    except Exception as e:
        print(f"BrowsingService: Error retrieving food item information: {e}")
        return jsonify({"error": "Failed to retrieve food item information"}), 500
