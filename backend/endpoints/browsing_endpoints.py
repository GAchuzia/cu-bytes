from flask import Blueprint, request
from backend.services.browse_service import (
    get_all_food_items_json,
    get_food_item_by_id_json,
    get_food_item_by_name_json,
)

browse_bp = Blueprint("browse", __name__)


@browse_bp.route("/food-items", methods=["GET"])
def get_all_food_items():
    """
    GET /browse/food-items

    Description:
    Retrieves all available food items from the database.

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved all food items
        Response Body (JSON):
        {
            "food_items": [
                {
                    "id": 651,
                    "name": "Yogurt & Berries Parfait",
                    "location": 10
                },
                {
                    "id": 652,
                    "name": "Yogurt Parfait",
                    "location": 11
                }
                ...
            ]
        }

    500 Internal Server Error - Database retrieval failed or unexpected error occurred
    """
    return get_all_food_items_json()


@browse_bp.route("/food-item/<int:id>", methods=["GET"])
def get_food_item_by_id(id):
    """
    GET /browse/food-item/{id}

    Description:
    Retrieve information about the food item with id {id}

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved the specified food item
        Response Body (JSON):
        {
            "calories": 389,
            "carbs_g": 79.8,
            "comments": "",
            "cost": 9.5,
            "dining_location": "Shawarma Palace",
            "fat_g": 3.56,
            "fiber_g": 1.96,
            "food_category": "Shawarma",
            "has_eggs": false,
            "has_fish_or_shellfish": false,
            "has_milk": false,
            "has_peanuts": false,
            "has_sesame": null,
            "has_soy": false,
            "has_sulfites": false,
            "has_treenuts": null,
            "has_wheat": true,
            "id": 100,
            "is_dairy_free": true,
            "is_gluten_free": false,
            "is_halal": null,
            "is_vegan": false,
            "is_vegetarian": false,
            "last_updated": "9/26/2025",
            "name": "Beef Shawarma Sandwich",
            "proteins_g": 9.43,
            "sugar_g": 0.287
            }

    400 Bad Request - Item not found
    500 Internal Server Error - Database retrieval failed or unexpected error occurred
    """
    return get_food_item_by_id_json(food_id=id)


@browse_bp.route("/food-item-by-name", methods=["GET"])
def get_food_item_by_name():
    """
    GET /browse/food-item-by-name

    Description:
    Retrieve a list of food items that match the provided food name
    If the food name does not match a generic category the list of food ids
    will be empty.

    Query Parameters:
    - name (mandatory): Food Name

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved the specified food item
        {
            "food_items": [
                {
                    "dining_location": "Starbucks",
                    "id": 426,
                    "name": "Mini Everything Bagels"
                },
                {
                    "dining_location": "Tim Hortons",
                    "id": 479,
                    "name": "Plain Bagel"
                },
            ]
        }
    400 Bad Request - Missing food_name parameter
    500 Internal Server Error - Database retrieval failed or unexpected error occurred
    """
    food_name = request.args.get("name", default=None)

    return get_food_item_by_name_json(food_name)
