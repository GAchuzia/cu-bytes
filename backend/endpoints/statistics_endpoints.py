from flask import Blueprint, request
from backend.services.statistics_service import (
    get_daily_statistics_json,
    get_aggregate_statistics_json,
    get_global_statistics_json,
    get_comparative_statistics_json,
)

statistics_bp = Blueprint("statistics", __name__)


@statistics_bp.route("/daily/<string:username>", methods=["GET"])
def get_daily_statistics(username):
    """
    GET /statistics/daily/{username}

    Description:
    Retrieve day-by-day nutrition and calorie breakdown for a user
    across a configurable number of recent days.

    Query Parameters:
    - days (optional, default=7): Number of days to include

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved daily statistics
        Response Body (JSON):
        {
            {
                "2026-01-31": {
                    "calories": 320,
                    "carbs_g": 45.2,
                    "fat_g": 6.5,
                    "fiber_g": 5.4,
                    "items_logged": 1,
                    "proteins_g": 12.8,
                    "sugar_g": 22.0
                },
                "2026-02-01": {
                    "calories": 70,
                    "carbs_g": 6.64,
                    "fat_g": 0.37,
                    "fiber_g": 2.6,
                    "items_logged": 1,
                    "proteins_g": 2.82,
                    "sugar_g": 1.7
                }
            }
        }
    204 No Content - Could not create statistics because
    user has not logged any food items
    400 Bad Request - Invalid username or query parameters
    500 Internal Server Error - Statistics generation failed
    """
    days = request.args.get("days", default=7, type=int)

    return get_daily_statistics_json(
        username=username,
        days=days,
    )


@statistics_bp.route("/aggregate/<string:username>", methods=["GET"])
def get_aggregate_statistics(username):
    """
    GET /statistics/aggregate/{username}

    Description:
    Retrieve aggregate nutrition statistics for a user over a
    configurable number of recent days.

    Query Parameters:
    - days (optional, default=7): Number of days to include

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved aggregate statistics
        Response Body (JSON):
        {
            "days_active": 3,
            "items_logged": 4,
            "percent_dairy": 11.42,
            "percent_fruit_veg": 43.21,
            "percent_grain": 29.53,
            "percent_protein": 15.85,
            "top_dining_location": "Starbucks",
            "top_food": "Chicken Salad",
            "total_calories": 1060,
            "total_carbs_g": 112.54,
            "total_fat_g": 25.37,
            "total_fiber_g": 20.9,
            "total_protein_g": 57.62,
            "total_sugar_g": 35.0
        }
    204 No Content - Could not create statistics because
    user has not logged any food items
    400 Bad Request - Invalid username or query parameters
    500 Internal Server Error - Statistics generation failed
    """
    days = request.args.get("days", default=7, type=int)

    return get_aggregate_statistics_json(
        username=username,
        days=days,
    )


@statistics_bp.route("/global", methods=["GET"])
def get_global_statistics():
    """
    GET /statistics/global

    Description:
    Retrieve global user statistics over a configurable number of recent days.
    Only users who have consented to share their data will be included.

    Query Parameters:
    - days (optional, default=7): Number of days to include

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved global statistics
        Response Body (JSON):
        {
            "trending_item_1": "Pizza",
            "trending_item_2": "Donut",
            "trending_item_3": "Lasagna",
            "trending_item_4": "Pad Thai",
            "trending_item_5": "French Fries",
            "trending_location_1": "Bridgehead",
            "trending_location_2": "Subway",
            "trending_location_3": "Tim Hortons",
        }
    400 Bad Request - Invalid query parameters
    500 Internal Server Error - Statistics generation failed
    """
    days = request.args.get("days", default=7, type=int)

    return get_global_statistics_json(days)


@statistics_bp.route("/comparative/<string:username>", methods=["GET"])
def get_comparative_statistics(username):
    """
    GET /statistics/comparative/{username}

    Description:
    Retrieve user percentiles for various statistics over a
    configurable number of recent days.
    Food group and macronutrient percentiles are calculated on being
    closest to the recommended amounts.
    The user must have allowed for statistics sharing.
    Only users who have consented to share their data will be compared against.

    Query Parameters:
    - days (optional, default=7): Number of days to include

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved comparative statistics
        Response Body (JSON):
        {
            "balanced_food_groups_percentile": 100,
            "balanced_macronutrients_percentile": 100,
            "carbs_percentile": 100,
            "checkin_percentile": 100,
            "dairy_percentile": 100,
            "fat_percentile": 100,
            "fiber_percentile": 100,
            "food_logging_percentile": 100,
            "fruits_veg_percentile": 100,
            "grain_percentile": 100,
            "protein_fg_percentile": 100,
            "sugar_percentile": 0
        }
    204 No Content - Could not create statistics because
    user has not logged any food items
    400 Bad Request - Invalid username or query parameters
    403 Forbidden - User has not configured their settings for statistics sharing
    500 Internal Server Error - Statistics generation failed
    """
    days = request.args.get("days", default=7, type=int)

    return get_comparative_statistics_json(username, days)
