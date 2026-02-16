# Library imports
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from flask import jsonify

# Project imports
from backend.models.food_logging import FoodLogging
from backend.models.users_auth import UsersAuth
from backend.models.users_profile import UsersProfile

"""
Methods directly connected to endpoints
These methods return a JSON object and should end in _json
"""


def get_daily_statistics_json(username, days):
    # Ensure valid username
    if UsersAuth.get_user_by_name(username) is None:
        print(f"StatisticsService: No matching username for {username}")
        return (
            jsonify({"status": "error", "message": "No matching username found"}),
            400,
        )

    # Ensure valid date range
    if days < 1:
        print(f"StatisticsService: Days must be positive. Received: {days} days")
        return (
            jsonify({"status": "error", "message": "Days must be positive"}),
            400,
        )

    try:
        logs = query_logs(days=days, include_list=[username])

        # Make sure the user has logged at least one item
        if len(logs) == 0:
            print(
                f"StatisticsService: No statistics created because {username}"
                f" has not logged any items in the past {days} days"
            )
            return "", 204

        # Create an empty template for each day
        daily_stats = {}
        end_date = datetime.now().date()
        for i in range(days):
            # Date Key is of form "YYYY-MM-DD"
            date_key = (end_date - timedelta(days=i)).isoformat()
            daily_stats[date_key] = {
                "calories": 0,
                "fat_g": 0.0,
                "carbs_g": 0.0,
                "proteins_g": 0.0,
                "fiber_g": 0.0,
                "sugar_g": 0.0,
                "items_logged": 0,
            }

        # Aggregate the statistics by date
        for log in logs:
            # Convert transaction date to iso to match date keys
            log_date = log.transaction_time.date().isoformat()
            stats = daily_stats[log_date]

            if log.calories > 0:
                stats["calories"] += log.calories
            if log.fat_g > 0:
                stats["fat_g"] += log.fat_g
            if log.carbs_g > 0:
                stats["carbs_g"] += log.carbs_g
            if log.proteins_g > 0:
                stats["proteins_g"] += log.proteins_g
            if log.fiber_g > 0:
                stats["fiber_g"] += log.fiber_g
            if log.sugar_g > 0:
                stats["sugar_g"] += log.sugar_g
            stats["items_logged"] += 1

        # Round values
        for date_key in daily_stats:
            stats = daily_stats[date_key]
            stats["fat_g"] = round(stats["fat_g"], 2)
            stats["carbs_g"] = round(stats["carbs_g"], 2)
            stats["proteins_g"] = round(stats["proteins_g"], 2)
            stats["fiber_g"] = round(stats["fiber_g"], 2)
            stats["sugar_g"] = round(stats["sugar_g"], 2)

        return jsonify(daily_stats), 200

    except Exception as e:
        print(f"StatisticsService: Error retrieving daily statistics: {e}")
        return jsonify({"error": "Failed to retrieve daily statistics"}), 500


def get_aggregate_statistics_json(username, days):
    # Ensure valid username
    if UsersAuth.get_user_by_name(username) is None:
        print(f"StatisticsService: No matching username for {username}")
        return (
            jsonify({"status": "error", "message": "No matching username found"}),
            400,
        )

    # Ensure valid date range
    if days < 1:
        print(f"StatisticsService: Days must be positive. Received: {days} days")
        return (
            jsonify({"status": "error", "message": "Days must be positive"}),
            400,
        )

    try:
        logs = query_logs(days=days, include_list=[username])

        # Create an empty template for stats
        aggregate_stats = {
            "days_active": 0,
            "items_logged": 0,
            "total_calories": 0.0,  # Decimal for math purposes
            "total_fat_g": 0.0,
            "total_carbs_g": 0.0,
            "total_fiber_g": 0.0,
            "total_protein_g": 0.0,
            "total_sugar_g": 0.0,
            "percent_fruit_veg": -1,
            "percent_grain": -1,
            "percent_dairy": -1,
            "percent_protein": -1,
            "top_food": "Unknown",
            "top_dining_location": "Unknown",
        }
        # Fiona TODO later: Implement dining location properly

        days_active = set()
        cal_fruit_veg = 0.0
        cal_grain = 0.0
        cal_dairy = 0.0
        cal_protein = 0.0
        consumed_foods = []

        # Use each log to contribute to the various statistics
        for log in logs:
            days_active.add(log.transaction_time.date())
            aggregate_stats["items_logged"] += 1

            if log.calories > 0:
                aggregate_stats["total_calories"] += log.calories

                # Interim calculations for food group breakdowns
                cal_fruit_veg += log.calories * log.percent_fruit_veg / 100.0
                cal_grain += log.calories * log.percent_grain / 100.0
                cal_dairy += log.calories * log.percent_dairy / 100.0
                cal_protein += log.calories * log.percent_protein / 100.0

            if log.fat_g > 0:
                aggregate_stats["total_fat_g"] += log.fat_g
            if log.carbs_g > 0:
                aggregate_stats["total_carbs_g"] += log.carbs_g
            if log.proteins_g > 0:
                aggregate_stats["total_protein_g"] += log.proteins_g
            if log.fiber_g > 0:
                aggregate_stats["total_fiber_g"] += log.fiber_g
            if log.sugar_g > 0:
                aggregate_stats["total_sugar_g"] += log.sugar_g

            consumed_foods.append(log.food_name)

        # Make sure the user has logged at least one item
        if aggregate_stats["items_logged"] == 0:
            print(
                f"StatisticsService: No aggregation created because {username}"
                f" has not logged any items in the past {days} days"
            )
            return "", 204

        # Calculate days active
        aggregate_stats["days_active"] = len(days_active)

        # Round float values
        aggregate_stats["total_fat_g"] = round(aggregate_stats["total_fat_g"], 2)
        aggregate_stats["total_carbs_g"] = round(aggregate_stats["total_carbs_g"], 2)
        aggregate_stats["total_protein_g"] = round(
            aggregate_stats["total_protein_g"], 2
        )
        aggregate_stats["total_fiber_g"] = round(aggregate_stats["total_fiber_g"], 2)
        aggregate_stats["total_sugar_g"] = round(aggregate_stats["total_sugar_g"], 2)

        # Calculate food group breakdowns
        aggregate_stats["percent_fruit_veg"] = round(
            cal_fruit_veg / aggregate_stats["total_calories"] * 100, 2
        )
        aggregate_stats["percent_grain"] = round(
            cal_grain / aggregate_stats["total_calories"] * 100, 2
        )
        aggregate_stats["percent_dairy"] = round(
            cal_dairy / aggregate_stats["total_calories"] * 100, 2
        )
        aggregate_stats["percent_protein"] = round(
            cal_protein / aggregate_stats["total_calories"] * 100, 2
        )

        # Calculate the most frequent food
        aggregate_stats["top_food"] = max(consumed_foods, key=consumed_foods.count)

        # Convert calories to an integer for consistency
        aggregate_stats["total_calories"] = int(
            round(aggregate_stats["total_calories"], 0)
        )

        return jsonify(aggregate_stats), 200

    except Exception as e:
        print(f"StatisticsService: Error retrieving aggregate statistics: {e}")
        return jsonify({"error": "Failed to retrieve aggregate statistics"}), 500


def get_global_statistics_json(days):
    # Ensure valid date range
    if days < 1:
        print(f"StatisticsService: Days must be positive. Received: {days} days")
        return (
            jsonify({"status": "error", "message": "Days must be positive"}),
            400,
        )

    try:
        logs = query_logs(days=days, include_list=get_stats_enabled_users())

        # Create an empty template for stats
        aggregate_stats = {
            "trending_item_1": "Unknown",
            "trending_item_2": "Unknown",
            "trending_item_3": "Unknown",
            "trending_item_4": "Unknown",
            "trending_item_5": "Unknown",
            "trending_location_1": "Unknown",
            "trending_location_2": "Unknown",
            "trending_location_3": "Unknown",
        }
        # Fiona TODO later: Implement dining location properly

        consumed_foods = []
        for log in logs:
            consumed_foods.append(log.food_name)

        # Calculate the most frequent foods
        top_foods = Counter(consumed_foods).most_common(5)
        for i, (food, count) in enumerate(top_foods, 1):
            aggregate_stats[f"trending_item_{i}"] = food

        return jsonify(aggregate_stats), 200

    except Exception as e:
        print(f"StatisticsService: Error retrieving global statistics: {e}")
        return jsonify({"error": "Failed to retrieve global statistics"}), 500


# Hardcoded ideal targets (USDA/AMDR 2000-cal adult)
IDEAL_TARGETS = {
    "fat_pct": 0.275,  # 27.5%
    "carbs_pct": 0.55,  # 55%
    "protein_pct": 0.20,  # 20%
    "fiber_per1000": 14,  # g/1000 cal
    "sugar_per1000": 25,  # g/1000 cal max
    "fruit_veg_pct": 0.40,
    "grain_pct": 0.30,
    "dairy_pct": 0.10,
    "protein_pct_fg": 0.20,
}


def get_comparative_statistics_json(username, days):
    # Ensure valid username
    if UsersAuth.get_user_by_name(username) is None:
        print(f"StatisticsService: No matching username for {username}")
        return (
            jsonify({"status": "error", "message": "No matching username found"}),
            400,
        )

    # Ensure valid date range
    if days < 1:
        print(f"StatisticsService: Days must be positive. Received: {days} days")
        return (
            jsonify({"status": "error", "message": "Days must be positive"}),
            400,
        )

    # Ensure user statistics turned on
    stats_enabled_usernames = get_stats_enabled_users()
    if username not in stats_enabled_usernames:
        print(
            f"StatisticsService: {username} does not have statistics sharing enabled."
            "Cannot generate comparatative statistics."
        )
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "Statistics sharing is disabled for this user.",
                }
            ),
            403,
        )

    try:
        logs = query_logs(days=days, include_list=stats_enabled_usernames)

        # Track per-user data (defaultdict used to initialize the starting entry)
        user_data = defaultdict(
            lambda: {
                "days_active": set(),  # Set to count unique days later
                "items_logged": 0,
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
        )

        # Use each log to fill in the related user data
        for log in logs:
            # Retreive the relevant user_data entry
            data = user_data[log.username]

            data["days_active"].add(log.transaction_time.date())
            data["items_logged"] += 1

            if log.calories and log.calories > 0:
                data["total_calories"] += log.calories

                # Add calories by food groups
                data["cal_fruit_veg"] += (
                    log.calories * (log.percent_fruit_veg or 0) / 100
                )
                data["cal_grain"] += log.calories * (log.percent_grain or 0) / 100
                data["cal_dairy"] += log.calories * (log.percent_dairy or 0) / 100
                data["cal_protein"] += log.calories * (log.percent_protein or 0) / 100

            # Add macronutrients amounts
            if log.fat_g and log.fat_g > 0:
                data["total_fat_g"] += log.fat_g
            if log.carbs_g and log.carbs_g > 0:
                data["total_carbs_g"] += log.carbs_g
            if log.proteins_g and log.proteins_g > 0:
                data["total_protein_g"] += log.proteins_g
            if log.fiber_g and log.fiber_g > 0:
                data["total_fiber_g"] += log.fiber_g
            if log.sugar_g and log.sugar_g > 0:
                data["total_sugar_g"] += log.sugar_g

        # Make sure the user has logged at least one item
        if user_data[username]["items_logged"] == 0:
            print(
                f"StatisticsService: No comparisons created because {username}"
                f" has not logged any items in the past {days} days"
            )
            return "", 204

        # user_data is complete, but to compare we need to normalize the data
        normalized_metrics = []
        for name, data in user_data.items():
            total_cal = data["total_calories"]
            if total_cal <= 0:
                continue

            normalized_metrics.append(
                {
                    "username": name,
                    "days_active": len(data["days_active"]),
                    "items_logged": data["items_logged"],
                    "fat_pct": data["total_fat_g"]
                    * 9
                    / total_cal,  # convert grams to calories
                    "carbs_pct": data["total_carbs_g"] * 4 / total_cal,  # g -> cal
                    "protein_pct": data["total_protein_g"] * 4 / total_cal,  # g -> cal
                    "fiber_per1000": data["total_fiber_g"] / (total_cal / 1000),
                    "sugar_per1000": data["total_sugar_g"] / (total_cal / 1000),
                    "fruit_veg_pct": data["cal_fruit_veg"] / total_cal,
                    "grain_pct": data["cal_grain"] / total_cal,
                    "dairy_pct": data["cal_dairy"] / total_cal,
                    "protein_pct_fg": data["cal_protein"] / total_cal,
                }
            )

        # Get the matrix of the current user
        current = None
        for i in range(len(normalized_metrics)):
            m = normalized_metrics[i]

            if m["username"] == username:
                current = m

                # Remove this entry from the list so normalized_metrics
                # contains ONLY PEERS
                del normalized_metrics[i]
                break

        percentiles = {
            "checkin_percentile": int(
                percentile(
                    [m["days_active"] for m in normalized_metrics],
                    current["days_active"],
                )
            ),
            "food_logging_percentile": int(
                percentile(
                    [m["items_logged"] for m in normalized_metrics],
                    current["items_logged"],
                )
            ),
            "fruits_veg_percentile": int(
                percentile_from_ideal(
                    [m["fruit_veg_pct"] for m in normalized_metrics],
                    current["fruit_veg_pct"],
                    IDEAL_TARGETS["fruit_veg_pct"],
                )
            ),
            "grain_percentile": int(
                percentile_from_ideal(
                    [m["grain_pct"] for m in normalized_metrics],
                    current["grain_pct"],
                    IDEAL_TARGETS["grain_pct"],
                )
            ),
            "dairy_percentile": int(
                percentile_from_ideal(
                    [m["dairy_pct"] for m in normalized_metrics],
                    current["dairy_pct"],
                    IDEAL_TARGETS["dairy_pct"],
                )
            ),
            "protein_fg_percentile": int(
                percentile_from_ideal(
                    [m["protein_pct_fg"] for m in normalized_metrics],
                    current["protein_pct_fg"],
                    IDEAL_TARGETS["protein_pct_fg"],
                )
            ),
            "carbs_percentile": int(
                percentile_from_ideal(
                    [m["carbs_pct"] for m in normalized_metrics],
                    current["carbs_pct"],
                    IDEAL_TARGETS["carbs_pct"],
                )
            ),
            "fat_percentile": int(
                percentile_from_ideal(
                    [m["fat_pct"] for m in normalized_metrics],
                    current["fat_pct"],
                    IDEAL_TARGETS["fat_pct"],
                )
            ),
            "fiber_percentile": int(
                percentile_from_ideal(
                    [m["fiber_per1000"] for m in normalized_metrics],
                    current["fiber_per1000"],
                    IDEAL_TARGETS["fiber_per1000"],
                )
            ),
            # Sugar is max not target → smaller is better so ideal = 0
            "sugar_percentile": int(
                percentile_from_ideal(
                    [m["sugar_per1000"] for m in normalized_metrics],
                    current["sugar_per1000"],
                    0,
                )
            ),
        }

        # Calculate overall ranking for macronutrients
        macro_deltas = [macro_delta_score(m) for m in normalized_metrics]

        current_macro_delta = macro_delta_score(current)

        percentiles["balanced_macronutrients_percentile"] = int(
            percentile_lower_is_better(
                macro_deltas,
                current_macro_delta,
            )
        )

        # Calculate overall ranking for food groups
        food_group_deltas = [food_group_delta_score(m) for m in normalized_metrics]

        current_food_group_delta = food_group_delta_score(current)

        percentiles["balanced_food_groups_percentile"] = int(
            percentile_lower_is_better(
                food_group_deltas,
                current_food_group_delta,
            )
        )

        return jsonify(percentiles), 200

    except Exception as e:
        print(f"StatisticsService: Error retrieving global statistics: {e}")
        return jsonify({"error": "Failed to retrieve global statistics"}), 500


# Helper functions


def percentile(values, target):
    """
    Compute the percentile rank of target among values.
    This measures what percentage of peers you beat or tie.

    Args:
        values (list of numbers): peer metrics
        target (number): your value

    Returns: int: percentile rank from 0 to 100
    """
    if not values:
        return 100

    # How many peers are at or below your value?
    count_beaten_or_equal = 0
    for v in values:
        if v <= target:
            count_beaten_or_equal += 1

    # Total number of peers
    total_peers = len(values)

    # Convert to percentage
    percentile_rank = 100 * count_beaten_or_equal / total_peers

    return round(percentile_rank, 0)


def percentile_from_ideal(values, target, ideal):
    """
    Compute percentile based on closeness to an ideal value.
    Smaller |value - ideal| is better.

    Args:
        values (list[float]): peer values
        target (float): current user's value
        ideal (float): ideal target

    Returns:
        int: percentile 0-100 (higher = closer to ideal)
    """
    if not values:
        return 100

    target_delta = abs(target - ideal)

    peer_deltas = [abs(v - ideal) for v in values]

    # Count how many peers are WORSE (larger delta)
    beaten = sum(1 for d in peer_deltas if d >= target_delta)

    return round(100 * beaten / len(peer_deltas), 0)


def percentile_lower_is_better(values, target):
    """
    Compute the percentile rank of target among values when lower values are better.
    This measures what percentage of peers have equal or worse (higher) values than
    you.

    Args:
        values (list of numbers): peer metrics (lower = better)
        target (number): your value

    Returns: int: percentile rank from 0 to 100 (100 = best, beats/ties all peers)
    """
    if not values:
        return 100

    # How many peers are worse than or equal to your value?
    count_beaten_or_equal = 0
    for v in values:
        if v >= target:
            count_beaten_or_equal += 1

    # Total number of peers
    total_peers = len(values)

    # Convert to percentage
    percentile_rank = 100 * count_beaten_or_equal / total_peers

    return round(percentile_rank, 0)


def macro_delta_score(metrics):
    """
    Compute an aggregate "distance from ideal" score for macronutrients.

    This function measures how far a user's macronutrient distribution
    deviates from recommended targets.

    The lower the returned value, the more nutritionally balanced
    the macronutrients are relative to the USDA/AMDR ideals.
    """
    if not metrics:
        return 0.0

    # Calculate absolute deviation for each macro
    total_deviation = 0.0
    for macro in ["fat_pct", "carbs_pct", "protein_pct", "fiber_per1000"]:
        if macro in metrics:
            deviation = abs(metrics[macro] - IDEAL_TARGETS[macro])
            total_deviation += deviation

    return total_deviation


def food_group_delta_score(metrics):
    """
    Compute an aggregate "distance from ideal" score for food-group intake.

    This measures how far the calorie distribution across food groups
    deviates from recommended targets.

    The lower the returned value, the more nutritionally balanced
    """
    if not metrics:
        return 0.0

    # Calculate absolute deviation for each food group
    total_deviation = 0.0
    for fg in ["fruit_veg_pct", "grain_pct", "dairy_pct", "protein_pct_fg"]:
        if fg in metrics:
            deviation = abs(metrics[fg] - IDEAL_TARGETS[fg])
            total_deviation += deviation

    return total_deviation


def query_logs(
    days=7,
    include_list=[],
):
    """
    Returns a list of FoodLogging items based on the number of days and
    usernames to include.

    Args:
        days: The number of days in the past from which to extract logs
        include_list: List of usernames to include in the log collection.
    """
    # Compute date range for N days, including today
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days - 1)

    # 00:00:00 on cutoff date
    cutoff_start = datetime.combine(start_date, datetime.min.time())

    return (
        FoodLogging.query.filter(FoodLogging.username.in_(include_list))
        .filter(FoodLogging.transaction_time >= cutoff_start)
        .all()
    )


def get_stats_enabled_users():
    """
    Return a list of usernames that have their statistics enabled.
    """
    return {
        user.username for user in UsersProfile.query.filter_by(show_stats=True).all()
    }
