from flask import Blueprint, request
from backend.services.recommendations_service import (
    get_trending_recommendations_json,
    get_random_recommendations_json,
)

recommendations_bp = Blueprint("recommend", __name__)


@recommendations_bp.route("/trending/<string:username>", methods=["GET"])
def get_trending_recommendations(username):
    """
    GET /recommend/trending/{username}

    Description:
    Retrieves the top X (default=3) food items from the database that
    are trending in the last 7 days among other users who have enabled
    statistics sharing.

    If there are not enough trending items, the number of items will
    be as close as possible to the desired amount. Items will be
    listed with the most popular item first with no tiebreaking
    mechanism.

    Query Parameters:
    - items (optional, default=3): Number of fooditems to return

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved recommended food items
        Response Body (JSON):
        {
            "food_items": [
                {
                "dining_location": "Bridgehead",
                "id": 658,
                "name": "Yogurt Parfait"
                },
                {
                "dining_location": "Bento Boxes",
                "id": 259,
                "name": "Donburi Inari Tofu"
                },
                {
                "dining_location": "Leo's Lounge",
                "id": 451,
                "name": "Oatmeal"
                }
            ]
        }
    204 No Content - Could not create statistics because there are no valid
    entries made by other users who have statistics enabled
    400 Bad Request - Invalid username or query parameters
    500 Internal Server Error - Database retrieval failed or unexpected error occurred
    """
    items = request.args.get("items", default=3, type=int)

    return get_trending_recommendations_json(username, items)


@recommendations_bp.route("/random/<string:username>", methods=["GET"])
def get_randome_recommendations(username):
    """
    GET /recommend/random/{username}

    Description:
    Retrieves random (default=3) food items from the database that
    the user has not yet tried.

    In the unlikely case that there are not enough untried items
    the endpoint will recommend items that the user has already consumed
    to make up the difference.

    Query Parameters:
    - items (optional, default=3): Number of fooditems to return

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved recommended food items
        Response Body (JSON):
        {
            "food_items": [
                {
                "dining_location": "Starbucks",
                "id": 241,
                "name": "Cookies & Cream Cake Pop"
                },
                {
                "dining_location": "Bento Boxes",
                "id": 594,
                "name": "Tempura Shrimp Poke Bowl"
                },
                {
                "dining_location": "Bridgehead",
                "id": 77,
                "name": "Bacon, Egg & Cheese Bagel"
                }
            ]
        }
    400 Bad Request - Invalid username or query parameters
    500 Internal Server Error - Database retrieval failed or unexpected error occurred
    """
    items = request.args.get("items", default=3, type=int)

    return get_random_recommendations_json(username, items)
