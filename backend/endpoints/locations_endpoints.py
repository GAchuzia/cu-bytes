from flask import Blueprint
from backend.services.locations_service import (
    get_all_dining_locations_json,
    get_dining_location_by_id_json
)

locations_bp = Blueprint("locations", __name__)


@locations_bp.route("/dining-locations", methods=["GET"])
def get_all_dining_locations():
    """
    """
    return get_all_dining_locations_json()


@locations_bp.route("/dining-locations/<int:id>", methods=["GET"])
def get_dining_location_by_id(id):
    """
    """
    return get_all_dining_locations_json(location_id=id)