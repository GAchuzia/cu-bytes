# Library imports
from collections import Counter
import random
from flask import jsonify

# Project imports
from backend.config import IDEAL_TARGETS
from backend.models.food_category import FoodCategory
from backend.models.food_item import FoodItem, get_dining_location_name
from backend.models.food_logging import FoodLogging
from backend.models.users_auth import UsersAuth
from backend.models.users_profile import UsersProfile
from backend.services.statistics_service import (
    food_group_delta_score,
    get_stats_enabled_users,
    macro_delta_score,
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
        user_profile = UsersProfile.get_profile_by_name(username)
        for food_name, _ in top_foods:
            food_id = convert_food_name_to_id(food_name)

            # Ignore food names that don't match any Carleton food item
            if food_id > 0:
                food_item = FoodItem.get_by_id(food_id)
                if allergy_free(user_profile, food_item):
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
                "RecommendationsService: WARNING - No recommendation created because "
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
            food_item = FoodItem.query.filter_by(food_name=log.food_name).first()
            if food_item is not None:
                consumed_food_ids.add(food_item.id)

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

        food_items_to_return = []
        user_profile = UsersProfile.get_profile_by_name(username)
        items_added = 0

        # Add items untried by the user
        while items_added < items and len(difference) != 0:
            rand_index = random.randint(0, len(difference) - 1)
            food_item = FoodItem.get_by_id(difference.pop(rand_index))
            if allergy_free(user_profile, food_item):
                food_items_to_return.append(food_item)
                items_added += 1

        # Fill in any remaining room with some already consumed items
        while items_added < items and len(consumed_food_ids) > 0:
            food_item = FoodItem.get_by_id(consumed_food_ids.pop())
            if allergy_free(user_profile, food_item):
                food_items_to_return.append(food_item)
                items_added += 1

        # Print warning if recommendation is empty
        if len(food_items_to_return) == 0:
            print(
                "RecommendationsService: WARNING - No recommendation created because "
                "there are no items that match the user's dietary restrictions"
            )
            return "", 204

        food_list = []
        for food_item in food_items_to_return:
            food_list.append(
                {
                    "id": food_item.id,
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


def get_ideal_recommendations_json(username, items):
    # Validate user
    if UsersAuth.get_user_by_name(username) is None:
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
        # Get stats from the last 30 days (longer period is better for stability)
        logs = query_logs(days=30, include_list=[username])

        current = {
            "total_calories": 0.0,
            "total_fat_g": 0.0,
            "total_carbs_g": 0.0,
            "total_protein_g": 0.0,
            "total_fiber_g": 0.0,
            "total_sugar_g": 0.0,
            "cal_fruit_veg": 0.0,
            "cal_grain": 0.0,
            "cal_dairy": 0.0,
            "cal_protein": 0.0,
        }

        # Create the users current nutrition baseline based on logged items
        for log in logs:
            if log.calories and log.calories > 0:
                current["total_calories"] += log.calories

                current["cal_fruit_veg"] += (
                    log.calories * (log.percent_fruit_veg or 0) / 100
                )
                current["cal_grain"] += log.calories * (log.percent_grain or 0) / 100
                current["cal_dairy"] += log.calories * (log.percent_dairy or 0) / 100
                current["cal_protein"] += (
                    log.calories * (log.percent_protein or 0) / 100
                )

            if log.fat_g and log.fat_g > 0:
                current["total_fat_g"] += log.fat_g
            if log.carbs_g and log.carbs_g > 0:
                current["total_carbs_g"] += log.carbs_g
            if log.proteins_g and log.proteins_g > 0:
                current["total_protein_g"] += log.proteins_g
            if log.fiber_g and log.fiber_g > 0:
                current["total_fiber_g"] += log.fiber_g
            if log.sugar_g and log.sugar_g > 0:
                current["total_sugar_g"] += log.sugar_g

        # Normalize the data
        current_normalized = build_normalized(current)

        # Calculate the distance from ideal targets
        current_macro_delta = macro_delta_score(current_normalized)
        current_food_delta = food_group_delta_score(current_normalized)
        current_total_delta = current_macro_delta + current_food_delta

        MAX_SUGAR_PER_1000 = 80  # hard guardrail prevents recommending high sugar items
        SUGAR_WEIGHT = 0.05  # soft penalty to discourage sugar
        FIBER_WEIGHT = 0.05  # soft reward to encourage fiber

        all_foods = FoodItem.query.all()
        scored_foods = []

        # Iterate through all fooditems and score them based on how they interact
        # with the user's current food intake
        for food in all_foods:
            food_category = FoodCategory.get_by_name(food.food_category)

            # Skip items with no food category
            if food_category is None:
                print(
                    "RecommendationService: Warning! No food category found"
                    f"for {food.food_name}"
                )
                continue

            simulated = current.copy()

            # Create a ratio for scaling - if the Carleton version of the food
            # item has a calorie count, then later nutrient information needs scaling
            generic_calories = food_category.calories or 0

            if food.calories and food.calories > 0 and generic_calories > 0:
                ratio = food.calories / generic_calories
                added_calories = food.calories
            else:
                ratio = 1
                added_calories = generic_calories

            # Skip items that have no registered calories
            if added_calories <= 0:
                continue

            # Exclude items that have high amounts of sugar
            sugar_g = (food_category.sugar_g or 0) * ratio
            food_sugar_per1000 = sugar_g / (added_calories / 1000)

            if food_sugar_per1000 > MAX_SUGAR_PER_1000:
                continue

            # Simulate adding the item to the user's logged
            simulated["total_calories"] += added_calories
            simulated["total_fat_g"] += (food_category.fat_g or 0) * ratio
            simulated["total_carbs_g"] += (food_category.carbs_g or 0) * ratio
            simulated["total_protein_g"] += (food_category.proteins_g or 0) * ratio
            simulated["total_fiber_g"] += (food_category.fiber_g or 0) * ratio
            simulated["total_sugar_g"] += sugar_g

            simulated["cal_fruit_veg"] += (
                added_calories * (food_category.percent_fruit_veg or 0) / 100
            )
            simulated["cal_grain"] += (
                added_calories * (food_category.percent_grain or 0) / 100
            )
            simulated["cal_dairy"] += (
                added_calories * (food_category.percent_dairy or 0) / 100
            )
            simulated["cal_protein"] += (
                added_calories * (food_category.percent_protein or 0) / 100
            )

            # Calculate the new scores
            simulated_normalized = build_normalized(simulated)

            macro_delta = macro_delta_score(simulated_normalized)
            food_delta = food_group_delta_score(simulated_normalized)
            simulated_total_delta = macro_delta + food_delta

            improvement = current_total_delta - simulated_total_delta

            # Add in sugar penalty and fiber reward
            adjusted_improvement = (
                improvement
                - SUGAR_WEIGHT * simulated_normalized["sugar_per1000"]
                + FIBER_WEIGHT * simulated_normalized["fiber_per1000"]
            )

            # Calculate the health by calorie ratio. This prevents items with
            # high calorie counts from being constantly recommended.
            efficiency_score = adjusted_improvement / added_calories

            scored_foods.append((efficiency_score, food))

        # Rank all food items with most improvements first
        scored_foods.sort(key=lambda x: x[0], reverse=True)

        # Convert food items into presentable formats
        # Ensures that the same category is not recommended twice for diversity
        food_list = []
        used_categories = set()
        user_profile = UsersProfile.get_profile_by_name(username)

        for score, food in scored_foods:
            if food.food_category in used_categories:
                continue

            used_categories.add(food.food_category)

            if allergy_free(user_profile, food):
                food_list.append(
                    {
                        "id": food.id,
                        "name": food.food_name,
                        "dining_location": get_dining_location_name(
                            food.dining_location
                        ),
                    }
                )

                if len(food_list) >= items:
                    break

        # Print warning if recommendation is empty
        if len(food_list) == 0:
            print(
                "RecommendationsService: WARNING - No recommendation created because "
                "there are no items that match the user's dietary restrictions"
            )
            return "", 204

        return jsonify({"food_items": food_list}), 200

    except Exception as e:
        print(f"RecommendationService: Error retrieving ideal recommendations: {e}")
        return jsonify({"error": "Failed to retrieve recommendations"}), 500


def get_nutrient_recommendations_json(username, items):
    # Validate user
    if UsersAuth.get_user_by_name(username) is None:
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
        # Get stats from the last 30 days (longer period is better for stability)
        logs = query_logs(days=30, include_list=[username])

        if len(logs) == 0:
            print(
                "RecommendationService: User has not logged any"
                "items in the last 30 days. No deficient nutrient."
            )
            return "", 204

        current = {
            "total_calories": 0.0,
            "total_fat_g": 0.0,
            "total_carbs_g": 0.0,
            "total_protein_g": 0.0,
            "total_fiber_g": 0.0,
            "total_sugar_g": 0.0,
            "cal_fruit_veg": 0.0,
            "cal_grain": 0.0,
            "cal_dairy": 0.0,
            "cal_protein": 0.0,
        }

        # Create the users current nutrition baseline based on logged items
        for log in logs:
            if log.calories and log.calories > 0:
                current["total_calories"] += log.calories

            if log.fat_g and log.fat_g > 0:
                current["total_fat_g"] += log.fat_g
            if log.carbs_g and log.carbs_g > 0:
                current["total_carbs_g"] += log.carbs_g
            if log.proteins_g and log.proteins_g > 0:
                current["total_protein_g"] += log.proteins_g
            if log.fiber_g and log.fiber_g > 0:
                current["total_fiber_g"] += log.fiber_g

        current_normalized = build_normalized(current)

        # Determine the most deficient nutrient
        nutrient_keys = [
            ("fat_pct", "Fat"),
            ("carbs_pct", "Carbs"),
            ("protein_pct", "Protein"),
            ("fiber_per1000", "Fiber"),
        ]

        lowest_ratio = float("inf")
        deficient_nutrient = None

        for key, common_name in nutrient_keys:
            ideal_value = IDEAL_TARGETS.get(key)
            current_value = current_normalized.get(key)

            if ideal_value is None or ideal_value <= 0:
                continue

            ratio = current_value / ideal_value

            if ratio < lowest_ratio:
                lowest_ratio = ratio
                deficient_nutrient = common_name

        # User is somehow perfectly balanced
        if deficient_nutrient is None:
            print("RecommendationService: User has no deficient nutrient.")
            return "", 204

        MAX_SUGAR_PER_1000 = 80  # hard sugar guardrail

        all_foods = FoodItem.query.all()
        scored_foods = []

        # Iterate through all foods and score by nutrient density
        for food in all_foods:
            food_category = FoodCategory.get_by_name(food.food_category)

            # Skip items with no category
            if food_category is None:
                print(
                    "RecommendationService: Warning! No food category found "
                    f"for {food.food_name}"
                )
                continue

            generic_calories = food_category.calories or 0

            # Scale nutrients if food has custom calorie value
            if food.calories and food.calories > 0 and generic_calories > 0:
                ratio = food.calories / generic_calories
                added_calories = food.calories
            else:
                ratio = 1
                added_calories = generic_calories

            # Skip items with no calorie data
            if added_calories <= 0:
                continue

            # SKip items with high amounts of sugar
            sugar_g = (food_category.sugar_g or 0) * ratio
            sugar_per1000 = sugar_g / (added_calories / 1000)

            if sugar_per1000 > MAX_SUGAR_PER_1000:
                continue

            # Determine nutrient value using inheritance + scaling
            nutrient_value = 0
            if deficient_nutrient == "Protein":
                nutrient_value = (food_category.proteins_g or 0) * ratio
            elif deficient_nutrient == "Fiber":
                nutrient_value = (food_category.fiber_g or 0) * ratio
            elif deficient_nutrient == "Fat":
                nutrient_value = (food_category.fat_g or 0) * ratio
            elif deficient_nutrient == "Carbs":
                nutrient_value = (food_category.carbs_g or 0) * ratio

            # Calculate the health by nutrient density. This prevents items with
            # high calorie counts from being constantly recommended.
            nutrient_density = nutrient_value / (added_calories / 1000)

            scored_foods.append((nutrient_density, food))

        # Rank foods by highest nutrient density first
        scored_foods.sort(key=lambda x: x[0], reverse=True)

        # Convert food items into presentable formats
        # Ensures that the same category is not recommended twice for diversity
        food_list = []
        used_categories = set()
        user_profile = UsersProfile.get_profile_by_name(username)

        for score, food in scored_foods:
            if food.food_category in used_categories:
                continue

            used_categories.add(food.food_category)

            if allergy_free(user_profile, food):
                food_list.append(
                    {
                        "id": food.id,
                        "name": food.food_name,
                        "dining_location": get_dining_location_name(
                            food.dining_location
                        ),
                    }
                )

                if len(food_list) >= items:
                    break

        return (
            jsonify(
                {
                    "deficient_nutrient": deficient_nutrient.replace(
                        "total_", ""
                    ).replace("_g", ""),
                    "food_items": food_list,
                }
            ),
            200,
        )

    except Exception as e:
        print(f"RecommendationService: Error retrieving nutrient recommendations: {e}")
        return jsonify({"error": "Failed to retrieve recommendations"}), 500


def get_similar_recommendations_json(username, items, users):
    # Validate user
    if UsersAuth.get_user_by_name(username) is None:
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

    # Validate users
    if users < 1:
        print("RecommendationsService: Invalid number of users to compare against")
        return (
            jsonify({"status": "error", "message": "Users must be positive"}),
            400,
        )

    try:
        # Get current user's logs from last 30 days
        current_logs = query_logs(days=30, include_list=[username])

        if len(current_logs) == 0:
            print(
                "RecommendationService: User has not logged any "
                "items in the last 30 days. No similarity baseline."
            )
            return "", 204

        # Build set of food_ids current user has eaten
        current_food_ids = set()
        for log in current_logs:
            foodItem = FoodItem.query.filter_by(food_name=log.food_name).first()
            if foodItem is not None:
                current_food_ids.add(foodItem.id)

        # Get logs for users with sharing enabled in last 30 days
        all_logs = query_logs(days=30, include_list=get_stats_enabled_users())

        # Build mapping: username -> set(food_ids)
        user_food_map = {}

        for log in all_logs:
            if log.username == username:
                continue

            if log.username not in user_food_map:
                user_food_map[log.username] = set()

            foodItem = FoodItem.query.filter_by(food_name=log.food_name).first()
            if foodItem is not None:
                user_food_map[log.username].add(foodItem.id)

        # Compute Jaccard similarity
        similarity_scores = []

        for other_user, food_ids in user_food_map.items():
            intersection = len(current_food_ids.intersection(food_ids))
            union = len(current_food_ids.union(food_ids))

            if union == 0:
                continue

            similarity = intersection / union

            if similarity > 0:
                similarity_scores.append((similarity, other_user))

        if len(similarity_scores) == 0:
            print("RecommendationService: No similar users found.")
            return "", 204

        # Sort by highest similarity first
        similarity_scores.sort(key=lambda x: x[0], reverse=True)

        # Take top N similar users (adjustable based on query param)
        top_similar_users = similarity_scores[:users]

        # Aggregate food scores
        food_scores = {}

        for similarity, other_user in top_similar_users:
            other_logs = user_food_map.get(other_user, set())

            for food_id in other_logs:
                # Exclude foods current user has already eaten
                if food_id in current_food_ids:
                    continue

                if food_id not in food_scores:
                    food_scores[food_id] = 0.0

                # Weight by similarity score
                food_scores[food_id] += similarity

        if len(food_scores) == 0:
            print("RecommendationService: No new foods to recommend.")
            return "", 204

        # Rank foods by weighted popularity
        sorted_foods = sorted(food_scores.items(), key=lambda x: x[1], reverse=True)

        # Convert to output format
        food_list = []
        user_profile = UsersProfile.get_profile_by_name(username)

        for food_id, score in sorted_foods:
            food = FoodItem.get_by_id(food_id)

            if food is None:
                continue

            if allergy_free(user_profile, food):
                food_list.append(
                    {
                        "id": food.id,
                        "name": food.food_name,
                        "dining_location": get_dining_location_name(
                            food.dining_location
                        ),
                    }
                )

                if len(food_list) >= items:
                    break

        # Print warning if recommendation is empty
        if len(food_list) == 0:
            print(
                "RecommendationsService: WARNING - No recommendation created because "
                "there are no items that match the user's dietary restrictions"
            )
            return "", 204

        return jsonify({"food_items": food_list}), 200

    except Exception as e:
        print(f"RecommendationService: Error retrieving similar recommendations: {e}")
        return jsonify({"error": "Failed to retrieve recommendations"}), 500


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


def build_normalized(data):
    """
    Normalizes food data based on the total calories.

    Args:
        data: Food data in the form:
        {
            "total_calories": 0.0,
            "total_fat_g": 0.0,
            "total_carbs_g": 0.0,
            "total_protein_g": 0.0,
            "total_fiber_g": 0.0,
            "total_sugar_g": 0.0,
            "cal_fruit_veg": 0.0,
            "cal_grain": 0.0,
            "cal_dairy": 0.0,
            "cal_protein": 0.0,
        }
    """
    total_cal = data["total_calories"]

    # If no calories logged, return zeros
    if total_cal <= 0:
        return {
            "fat_pct": 0,
            "carbs_pct": 0,
            "protein_pct": 0,
            "fiber_per1000": 0,
            "sugar_per1000": 0,
            "fruit_veg_pct": 0,
            "grain_pct": 0,
            "dairy_pct": 0,
            "protein_pct_fg": 0,
        }

    return {
        "fat_pct": data["total_fat_g"] * 9 / total_cal,
        "carbs_pct": data["total_carbs_g"] * 4 / total_cal,
        "protein_pct": data["total_protein_g"] * 4 / total_cal,
        "fiber_per1000": data["total_fiber_g"] / (total_cal / 1000),
        "sugar_per1000": data["total_sugar_g"] / (total_cal / 1000),
        "fruit_veg_pct": data["cal_fruit_veg"] / total_cal,
        "grain_pct": data["cal_grain"] / total_cal,
        "dairy_pct": data["cal_dairy"] / total_cal,
        "protein_pct_fg": data["cal_protein"] / total_cal,
    }


def allergy_free(user, food):
    """
    Return whether or not the user should be recommended the food item
    based on their dietary restrictions

    Items that the user is allergic to will return False
    Items that are safe for consumption will return True
    Items that may contain will return True (otherwise this filters out
    many food items)

    Args:
        user: The the user's profile object (UserProfile)
        food: The food item in question (FoodItem)
    """
    if user.has_egg_allergy and food.has_eggs:
        return False
    if user.has_fish_or_shellfish_allergy and food.has_fish_or_shellfish:
        return False
    if user.has_dairy_intolerance and not food.is_dairy_free:
        return False
    if user.has_milk_allergy and food.has_milk:
        return False
    if user.has_peanut_allergy and food.has_peanuts:
        return False
    if user.has_sesame_allergy and food.has_sesame:
        return False
    if user.has_soy_allergy and food.has_soy:
        return False
    if user.has_treenut_allergy and food.has_treenuts:
        return False
    if user.has_wheat_allergy and food.has_wheat:
        return False
    if user.has_gluten_allergy and not food.is_gluten_free:
        return False
    if user.is_vegan and not food.is_vegan:
        return False
    if user.is_vegetarian and not food.is_vegetarian:
        return False
    if user.prefers_halal and not food.is_halal:
        return False
    return True
