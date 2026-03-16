# Library imports
from flask import jsonify

# Project imports
from backend.models.food_logging import FoodLogging
from backend.models.users_auth import UsersAuth
from backend.models.users_profile import UsersProfile
from backend.extensions import db


def retreive_profile_json(username):
    """Attempt to retreive the profile of a user"""
    # Ensure valid username
    profile = UsersProfile.get_profile_by_name(username)
    if profile is None:
        print(f"ProfileService: No matching username for {username}")
        return (
            jsonify({"status": "error", "message": "No matching username found"}),
            400,
        )

    return profile.to_json(), 200


def configured_json(username):
    """Attempt to retreive whether or not a user has configured their profile"""
    # Ensure valid username
    profile = UsersProfile.get_profile_by_name(username)
    if profile is None:
        print(f"ProfileService: No matching username for {username}")
        return (
            jsonify({"status": "error", "message": "No matching username found"}),
            400,
        )

    return (
        jsonify({"has_configured_settings": profile.has_configured_settings}),
        200,
    )


def edit_profile_json(data):
    """Attempt to edit a user profile"""
    username = data.get("username")

    # Validate input types
    if not isinstance(username, str) or len(username) == 0:
        print("ProfileService: username is required and must be a non-empty string")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "username is required and must be a non-empty string",
                }
            ),
            400,
        )

    # Ensure valid username
    profile = UsersProfile.get_profile_by_name(username)
    if profile is None:
        print(f"ProfileService: No matching username for {username}")
        return (
            jsonify({"status": "error", "message": "No matching username found"}),
            400,
        )

    # Configurable boolean arguments
    optional_args = [
        "show_stats",
        "has_egg_allergy",
        "has_fish_or_shellfish_allergy",
        "has_dairy_intolerance",
        "has_milk_allergy",
        "has_peanut_allergy",
        "has_sesame_allergy",
        "has_soy_allergy",
        "has_sulfite_allergy",
        "has_treenut_allergy",
        "has_wheat_allergy",
        "has_gluten_allergy",
        "is_vegan",
        "is_vegetarian",
        "prefers_halal",
    ]

    for arg in optional_args:
        if arg in data:
            # Ensure compliant argument typing
            if not isinstance(data.get(arg), bool):
                print(f"ProfileService: {arg} must be a boolean")
                return (
                    jsonify(
                        {
                            "status": "error",
                            "message": f"{arg} must be a boolean",
                        }
                    ),
                    400,
                )
            # Modify the associated field
            setattr(profile, arg, data.get(arg))

    # Set modification flag to true
    setattr(profile, "has_configured_settings", True)

    try:
        db.session.commit()
        return (
            jsonify({"message": "Profile updated successfully"}),
            200,
        )

    except Exception as e:
        db.session.rollback()  # Ensure no partial changes are committed
        print(f"ProfileService: Update error: {e}")
        return (
            jsonify({"error": "Failed to update profile"}),
            500,
        )


def delete_profile_json(data, username):
    """Attempt to delete a user profile"""
    password = data.get("password")

    # Ensure password is present
    if not isinstance(password, str) or len(password) == 0:
        print("ProfileService: password is required")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "password is required",
                }
            ),
            400,
        )

    # Ensure valid username and password pair
    current_user = UsersAuth.get_user_by_name(username)
    if current_user is None:
        print(f"ProfileService: No matching username for {username}")
        return (
            jsonify({"status": "error", "message": "No matching username found"}),
            400,
        )

    if not current_user.verify_password(password):
        print("ProfileService: Password does not match.")
        return (
            jsonify({"status": "error", "message": "Password does not match."}),
            400,
        )

    # Find the associated user profile
    current_profile = UsersProfile.get_profile_by_name(username)

    # Find all associated food transactions
    user_logs = FoodLogging.query.filter_by(username=username).all()

    try:
        # Delete everything associated with the user
        for log in user_logs:
            db.session.delete(log)

        if current_profile is not None:  # Check just in case
            db.session.delete(current_profile)

        db.session.delete(current_user)

        db.session.commit()
        print(f"ProfileService: Deletion complete for {username}.")

        return (
            jsonify({"message": "User deleted successfully"}),
            200,
        )

    except Exception as e:
        db.session.rollback()  # Ensure no partial changes are committed
        print(f"ProfileService: Update error: {e}")
        return (
            jsonify({"error": "Failed to delete user"}),
            500,
        )
