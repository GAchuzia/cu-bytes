# Library imports
import os
import re
from flask import jsonify

# Project imports
from backend.models.users_auth import UsersAuth


def login_user(data):
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
        201,
    )


def create_user(username, password):
    """Create a new user and store it in the database"""
    salt = os.urandom(16).hex()
    hashed = UsersAuth.hash_with_salt(password, salt)
    user = UsersAuth.create(username=username, password=hashed, salt=salt)
    print(
        f"AuthenticationService: Created new user {username} with password "
        f"{password}"
    )
    return user


def register_user(data):
    """
    Attempt to register a new user.

    Usernames must be between 1 and 80 characters, unique, and can only
    contain letters, numbers, underscores and spaces

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

    if not re.fullmatch(r"^[a-zA-Z0-9_ ]{1,80}$", username):
        print("AuthenticationService: Invalid username format (bad char).")
        return (
            jsonify(
                {
                    "status": "error",
                    "message": (
                        "Invalid username format. Username can only contain "
                        "letters, numbers, underscores and spaces."
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
