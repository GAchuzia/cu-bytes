from flask import Blueprint, request
from backend.services.profile_service import edit_profile_json, retreive_profile_json

profile_bp = Blueprint("profile", __name__)


@profile_bp.route("/retreive/<string:username>", methods=["GET"])
def retreive_profile(username):
    """
    GET /profile/retreive/{username}

    Description:
    Retreive the profile of a particular user.

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved the specified user profile
        Response Body (JSON):
        {
            "has_configured_settings": true,
            "has_dairy_intolerance": false,
            "has_egg_allergy": false,
            "has_gluten_allergy": false,
            "has_peanut_allergy": false,
            "has_sesame_allergy": false,
            "has_shellfish_allergy": false,
            "has_soy_allergy": false,
            "has_treenut_allergy": false,
            "has_wheat_allergy": false,
            "is_vegan": true,
            "is_vegetarian": false,
            "prefers_halal": true,
            "prefers_kosher": false,
            "show_stats": true,
            "username": "Alice"
        }
    400 Bad Request - Invalid username
    """
    return retreive_profile_json(username=username)


@profile_bp.route("/edit", methods=["POST"])
def edit_profile():
    """
    POST /profile/edit

    Description:
    Edit the profile for a particular user.
    You only need to pass arguments that need changing.
    Sending an edit request with no optional arguments will
    still count as the user having configured their profile.

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
