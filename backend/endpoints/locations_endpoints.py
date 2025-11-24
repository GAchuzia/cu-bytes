from flask import Blueprint
from backend.services.locations_service import (
    get_all_dining_locations_json,
    get_dining_location_by_id_json
)

locations_bp = Blueprint("locations", __name__)


@locations_bp.route("/dining-locations", methods=["GET"])
def get_all_dining_locations():
    """
    GET /locations/dining-locations

    Description:
    Retrieves all available dining locations from the database.

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved all dining locations
        Response Body (JSON):
        {
            [
                {
                    "id": 1,
                    "name": "Tim Hortons"
                },
                {
                    "id": 2,
                    "name": "Subway"
                }
                ...
            ]
        }

    500 Internal Server Error - Database retrieval failed or unexpected error occurred
    """
    return get_all_dining_locations_json()


@locations_bp.route("/dining-location/<int:id>", methods=["GET"])
def get_dining_location_by_id(id):
    """
    GET /locations/dining-locations/{id}

    Description:
    Retrieves all available food items from the dining location with id {id}

    Request Body:
    None

    Response:
    200 OK - Successfully retrieved all food items at the specified dining location
        Response Body (JSON):
        {
            [
                {
                    "id": 1,
                    "name": "12 Grain Bagel"
                },
                {
                    "id": 52,
                    "name": "Apple Fritter Donut"
                }
                ...
            ]
        }

    500 Internal Server Error - Database retrieval failed or unexpected error occurred
    """
    return get_dining_location_by_id_json(dining_location_id=id)
    