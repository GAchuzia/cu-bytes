from flask import Blueprint, request
from backend.services.authentication_service import login_user, register_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    return login_user(data)

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    POST /register

    Request Body (JSON):
    {
        "username": "string",   # required
        "password": "string"    # required
    }

    Responses:
    201 Success - User registered successfully
    400 Bad Request - Missing or invalid data
    409 Conflict - Username already exists
    """
    data = request.json
    return register_user(data)
