# Library imports
from collections import Counter
import random
from flask import jsonify

# Project imports
from backend.models.food_item import FoodItem, get_dining_location_name
from backend.models.food_logging import FoodLogging
from backend.models.users_auth import UsersAuth
from backend.services.statistics_service import (
    get_stats_enabled_users,
    query_logs,
)

"""
Methods directly connected to endpoints
These methods return a JSON object and should end in _json
"""


def get_trending_recommendations_json(username, items):
    # Validate user
    currentUser = UsersAuth.get_user_by_name(username)
    if currentUser is None:
        print(f"RecommendationsService: No matching username for {username}")
        return (
            jsonify({"status": "error", "message": "No matching username found"}),
            400,
        )

    # Validate items
    if items < 1:
        print("RecommendationsService: Invalid number of items requested")
        return (
            jsonify({"status": "error", "message": "Items must be positive"}),
            400,
        )

    try:
        # Grab the logs from other users with stats enabled
        users_to_aggregate = get_stats_enabled_users()
        if username in users_to_aggregate:
            users_to_aggregate.remove(username)
        logs = query_logs(days=7, include_list=users_to_aggregate)

        # Create a frequency table for most frequent foods
        consumed_foods = []
        for log in logs:
            consumed_foods.append(log.food_name)

        top_foods = Counter(consumed_foods).most_common()

        # Get basic food information for the common foods
        food_list = []
        for food_name, _ in top_foods:
            food_id = convert_food_name_to_id(food_name)

            # Ignore food names that don't match any Carleton food item
            if food_id > 0:
                food_item = FoodItem.get_by_id(food_id)
                food_list.append(
                    {
                        "id": food_id,
                        "name": food_item.food_name,
                        "dining_location": get_dining_location_name(
                            food_item.dining_location
                        ),
                    }
                )

                # Stop adding foods once the desired threshold is reached
                if len(food_list) >= items:
                    break

        # Print warning if recommendation is empty
        if len(food_list) == 0:
            print(
                "RecommendationsService: WARNING - No statistics created because "
                "there are no valid items logged in the past 7 days"
            )
            return "", 204

        return jsonify({"food_items": food_list}), 200

    except Exception as e:
        print(f"RecommendationsService: Error retrieving trending recommendations: {e}")
        return jsonify({"error": "Failed to retrieve trending recommendations"}), 500


def get_random_recommendations_json(username, items):
    # Validate user
    currentUser = UsersAuth.get_user_by_name(username)
    if currentUser is None:
        print(f"RecommendationsService: No matching username for {username}")
        return (
            jsonify({"status": "error", "message": "No matching username found"}),
            400,
        )

    # Validate items
    if items < 1:
        print("RecommendationsService: Invalid number of items requested")
        return (
            jsonify({"status": "error", "message": "Items must be positive"}),
            400,
        )

    try:
        # Grab the logs from the user
        logs = FoodLogging.query.filter_by(username=username).all()

        # Create a set to track consumed food items
        consumed_food_ids = set()
        for log in logs:
            food_id = FoodItem.query.filter_by(food_name=log.food_name).first()
            if food_id is not None:
                consumed_food_ids.add(food_id)

        # Get all food item ids
        all_items = FoodItem.query.all()
        all_food_ids = {item.id for item in all_items}

        # Ensure that the user is not trying to request more items than items available
        if items > len(all_food_ids):
            print(
                "RecommendationsService: Invalid number of items requested",
                f"(exceeded {len(all_food_ids)})",
            )
            return (
                jsonify({"status": "error", "message": "Not enough items in database"}),
                400,
            )

        # Calculate difference between two sets
        difference = list(all_food_ids.difference(consumed_food_ids))

        food_ids_to_return = []
        items_added = 0

        # Add items untried by the user
        while items_added < items and len(difference) != 0:
            rand_index = random.randint(0, len(difference) - 1)
            food_ids_to_return.append(difference.pop(rand_index))
            items_added += 1

        # Fill in any remaining room with some already consumed items
        while items_added < items:
            food_ids_to_return.append(consumed_food_ids.pop())
            items_added += 1

        food_list = []
        for food_id in food_ids_to_return:
            food_item = FoodItem.get_by_id(food_id)
            food_list.append(
                {
                    "id": food_id,
                    "name": food_item.food_name,
                    "dining_location": get_dining_location_name(
                        food_item.dining_location
                    ),
                }
            )

        return jsonify({"food_items": food_list}), 200

    except Exception as e:
        print(f"RecommendationsService: Error retrieving random recommendations: {e}")
        return jsonify({"error": "Failed to retrieve random recommendations"}), 500


# Helper functions


def convert_food_name_to_id(food_identifier):
    """
    Best guess that converts a food_name (which may be a generic category)
    into a tangible Carleton food item labelled with a food_id.

    Will return -1 if a name does not match any food name or food category

    Args:
        food_name: The name of the food
    """
    # Try finding the direct name in the food database
    food_items = FoodItem.query.filter_by(food_name=food_identifier).all()
    if len(food_items) != 0:
        # If muliple matches, pick one of them randomnly
        randIndex = random.randint(1, len(food_items)) - 1
        return food_items[randIndex].id

    # If unsuccessful try searching by the generic category
    food_items = FoodItem.query.filter_by(food_category=food_identifier).all()
    if len(food_items) != 0:
        # If muliple matches, pick one of them randomnly
        randIndex = random.randint(1, len(food_items)) - 1
        return food_items[randIndex].id

    print(f"RecommendationsService: No match for food identifier {food_identifier}.")
    return -1
