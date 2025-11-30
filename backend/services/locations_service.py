# Library imports
from flask import jsonify

# Project imports
from backend.models.food_item import DiningLocation
from backend.models.food_item import FoodItem

"""
Methods directly connected to endpoints
These methods return a JSON object and should end in _json
"""


def get_all_dining_locations_json():
    try:
        # Transform all dining locations into JSON-friendly dictionaries
        dining_locations = DiningLocation.query.all()
        result = [{"id": location.dining_service_id, "name": location.dining_location_name} for location in dining_locations]

        # Return as a JSON response
        return jsonify(result), 200

    except:
        print(f"LocationService: Error retrieving dining locations: {e}")
        return jsonify({"error": "Failed to retrieve dining locations"}), 500


def get_dining_location_by_id_json(dining_location_id):
    try:
        # Transform all food items into JSON-friendly dictionaries
        food_items = FoodItem.query.filter(FoodItem.dining_location == dining_location_id).all()
        result = [{"id": item.id, "name": item.food_name} for item in food_items]

        if result == []:
            return {"error": f"Dining location with id {dining_location_id} not found"}, 400 
        else:
            return jsonify(result), 200

    except Exception as e:
        print(f"LocationService: Error retrieving dining location food items information: {e}")
        return jsonify({"error": "Failed to retrieve dining location food items information"}), 500