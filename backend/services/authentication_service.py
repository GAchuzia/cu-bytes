# Library imports
import re
from flask import jsonify

# Project imports
from backend.models.users_auth import UsersAuth
from backend.models.users_profile import UsersProfile

"""
Methods directly connected to endpoints
These methods return a JSON object and should end in _json
"""


def login_user_json(data):
    """Attempt to login a user"""
    username = data.get("username")
    password = data.get("password")

    # Err on the side of caution for error messages to give no hints to
    # attackers

    # Check missing fields
    if len(username) == 0 or len(password) == 0:
        return (
            jsonify({"status": "error", "message": "Invalid password or username."}),
            400,
        )

    # Ensure no weird inputs that could mess up the query
    if not re.fullmatch(r"^[a-zA-Z0-9_ ]{1,80}$", username):
        return (
            jsonify({"status": "error", "message": "Invalid password or username."}),
            400,
        )

    asserted_user = UsersAuth.get_user_by_name(username=username)

    # Check for a valid username
    if asserted_user is None:
        return (
            jsonify({"status": "error", "message": "Invalid password or username."}),
            400,
        )

    if not asserted_user.verify_password(password):
        return (
            jsonify({"status": "error", "message": "Invalid password or username."}),
            400,
        )

    print(f"AuthenticationService: {username} has succesfully logged in")

    return (
        jsonify({"status": "success", "message": "User logged in successfully."}),
        200,
    )


def register_user_json(data):
    """
    Attempt to register a new user.

    Usernames must be between 1 and 80 characters, unique, and can only
    contain letters, numbers and underscores

    Passwords must be between 10 and 120 characters, with at least one
    special character, one number, one uppercase and one lowercase
    """
    username = data.get("username")
    password = data.get("password")
    print(
        f"AuthenticationService: Attempting to create user {username} with "
        f"password {password}"
    )

    # Check missing fields
    if len(username) == 0 or len(password) == 0:
        print("AuthenticationService: Username and password are required")
        return (
            jsonify(
                {"status": "error", "message": "Username and password are required."}
            ),
            400,
        )

    # Validate username
    if len(username) > 80:
        print("AuthenticationService: Invalid username format (length).")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": (
                        "Invalid username format. Username must be between 1 "
                        "and 80 characters."
                    ),
                }
            ),
            400,
        )

    if not re.fullmatch(r"^[a-zA-Z0-9_]{1,80}$", username):
        print("AuthenticationService: Invalid username format (bad char).")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": (
                        "Invalid username format. Username can only contain "
                        "letters, numbers and underscores."
                    ),
                }
            ),
            400,
        )

    # Validate password
    if not len(password) >= 10 and len(password) <= 120:
        print("AuthenticationService: Invalid password format (length).")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": (
                        "Invalid password format. Password must be between 10 "
                        "and 120 characters."
                    ),
                }
            ),
            400,
        )

    if not re.search(r'[!@#$%^&*()_\-+=\[\]{}\\|:;"\'<>,.?/]', password):
        print("AuthenticationService: Invalid password format (missing char).")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": (
                        "Invalid password format. Password must contain at "
                        "least one special character."
                    ),
                }
            ),
            400,
        )

    if not re.search(r"[0-9]", password):
        print("AuthenticationService: Invalid password format (missing num).")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": (
                        "Invalid password format. Password must contain at "
                        "least one numeric character."
                    ),
                }
            ),
            400,
        )

    if not re.search(r"[A-Z]", password):
        print("AuthenticationService: Invalid password format (missing cap).")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": (
                        "Invalid password format. Password must contain at "
                        "least one uppercase character."
                    ),
                }
            ),
            400,
        )

    if not re.search(r"[a-z]", password):
        print("AuthenticationService: Invalid password format (missing low).")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": (
                        "Invalid password format. Password must contain at "
                        "least one lowercase character."
                    ),
                }
            ),
            400,
        )

    if UsersAuth.get_user_by_name(username=username) is not None:
        print("AuthenticationService: This username is already in use.")
        return (
            jsonify({"status": "error", "message": "This username is already in use."}),
            409,
        )

    create_user(username=username, password=password)
    print("AuthenticationService: User registered successfully.")

    return (
        jsonify({"status": "success", "message": "User registered successfully."}),
        201,
    )


def change_password_json(data):
    """
    Attempt to change the password of an existing user.

    Passwords must be between 10 and 120 characters, with at least one
    special character, one number, one uppercase and one lowercase
    """
    username = data.get("username")
    old_password = data.get("old_password")
    new_password = data.get("new_password")
    print(
        f"AuthenticationService: Attempting to change user {username}'s "
        f"password to {new_password}"
    )

    # Check missing fields
    if len(username) == 0 or len(old_password) == 0 or len(new_password) == 0:
        print(
            "AuthenticationService: Username, old password, and new "
            "password are required"
        )
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "Username, old password and new password required.",
                }
            ),
            400,
        )

    # Authenticate the user using their old password
    current_user = UsersAuth.get_user_by_name(username=username)
    if current_user is None:
        print("AuthenticationService: Username not found.")
        return (
            jsonify({"status": "error", "message": "This user does not exist."}),
            400,
        )

    if not current_user.verify_password(old_password):
        print("AuthenticationService: Old password does not match.")
        return (
            jsonify({"status": "error", "message": "Old password does not match."}),
            400,
        )

    # Validate new password
    if not len(new_password) >= 10 and len(new_password) <= 120:
        print("AuthenticationService: Invalid new password format (length).")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": (
                        "Invalid password format. Password must be between 10 "
                        "and 120 characters."
                    ),
                }
            ),
            400,
        )

    if not re.search(r'[!@#$%^&*()_\-+=\[\]{}\\|:;"\'<>,.?/]', new_password):
        print("AuthenticationService: Invalid new password format (missing char).")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": (
                        "Invalid password format. Password must contain at "
                        "least one special character."
                    ),
                }
            ),
            400,
        )

    if not re.search(r"[0-9]", new_password):
        print("AuthenticationService: Invalid new password format (missing num).")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": (
                        "Invalid password format. Password must contain at "
                        "least one numeric character."
                    ),
                }
            ),
            400,
        )

    if not re.search(r"[A-Z]", new_password):
        print("AuthenticationService: Invalid new password format (missing cap).")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": (
                        "Invalid password format. Password must contain at "
                        "least one uppercase character."
                    ),
                }
            ),
            400,
        )

    if not re.search(r"[a-z]", new_password):
        print("AuthenticationService: Invalid new password format (missing low).")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": (
                        "Invalid password format. Password must contain at "
                        "least one lowercase character."
                    ),
                }
            ),
            400,
        )

    current_user.edit_password(new_password)

    print("AuthenticationService: User changed password successfully.")

    return (
        jsonify(
            {"status": "success", "message": "User password changed successfully."}
        ),
        201,
    )


"""
Helper methods
"""


def create_user(username, password):
    """Create a new user and store it in the database"""
    # Create a username password pair
    user = UsersAuth.create(username=username, password=password)

    # Create an empty dietary profile
    UsersProfile.create(username=username, has_configured_settings=False)

    print(
        f"AuthenticationService: Created new user {username} with password "
        f"{password}"
    )
    return user
