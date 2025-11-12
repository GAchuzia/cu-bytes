from flask import Blueprint, request
from backend.services.authentication_service import login_user, register_user

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    POST auth/login

    Request Body (JSON):
    {
        "username": "string",   # required
        "password": "string"    # required
    }

    Responses:
    200 OK - User logged in successfully
    400 Bad Request - Wrong username or password
    """
    data = request.json
    return login_user(data)


@auth_bp.route("/register", methods=["POST"])
def register():
    """
    POST auth/register

    Request Body (JSON):
    {
        "username": "string",   # required
        "password": "string"    # required
    }

    Restrictions:
    Usernames must be between 1 and 80 characters, unique, and can
    only contain letters, numbers, underscores and spaces
    Passwords must be between 10 and 120 characters, with at least
    one special character, one number, one uppercase and one lowercase

    Responses:
    201 Success - User registered successfully
    400 Bad Request - Missing or invalid data
    409 Conflict - Username already exists
    """
    data = request.json
    return register_user(data)
