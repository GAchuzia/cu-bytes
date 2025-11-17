from flask import Blueprint, request
from backend.services.profile_service import edit_profile_json

profile_bp = Blueprint("profile", __name__)


@profile_bp.route("/edit", methods=["POST"])
def edit_profile():
    """
    POST /profile/edit

    Request Body (JSON):
    {
        "username": "string",               # required
        "show_stats": "boolean",            # optional
        "has_egg_allergy: "boolean",        # optional
        "has_dairy_intolerance: "boolean",  # optional
        "has_peanut_allergy: "boolean",     # optional
        "has_sesame_allergy: "boolean",     # optional
        "has_shellfish_allergy: "boolean",  # optional
        "has_soy_allergy: "boolean",        # optional
        "has_treenut_allergy: "boolean",    # optional
        "has_wheat_allergy: "boolean",      # optional
        "has_gluten_allergy: "boolean",     # optional
        "is_vegan: "boolean",               # optional
        "is_vegetarian: "boolean",          # optional
        "prefers_kosher: "boolean",         # optional
        "prefers_halal: "boolean",          # optional
    }

    Responses:
    200 OK - Successfully recorded the transaction
    400 Bad Request - Invalid argument
    500 Internal Server Error - Error adding transaction to database
    """
    data = request.json
    return edit_profile_json(data)
