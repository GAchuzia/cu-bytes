import os
import re
from flask import jsonify

from backend.models.users_auth import UsersAuth

def login_user(data):
    """Attempt to login a user"""
    print("Logged in") # TODO
    return "OK"

def create_user(username, password):
    """Create a new user and store it in the database"""
    salt = os.urandom(16).hex()
    hashed = UsersAuth.hash_with_salt(password, salt)
    user = UsersAuth.create(username=username, password=hashed, salt=salt)
    print(f"AuthenticationService: Created new user {username} with password {password}")
    return user


def register_user(data):
    """
    Attempt to register a new user.

    Usernames must be between 1 and 80 characters, unique, and can only contain letters, numbers, underscores and spaces
    Passwords must be between 10 and 120 characters, with at least one special character, one number, one uppercase and one lowercase
    """
    # Only allow letters, numbers, underscores and spaces
    username = data.get("username")
    password = data.get("password")
    print(f"AuthenticationService: Attempting to create user {username} with password {password}")

    # Check missing fields
    if not username or not password:
        return jsonify({
            "status": "error",
            "message": "Username and password are required."
        }), 400

    # Validate username
    if not len(username) >= 1 and len(username) <= 80:
        return jsonify({
            "status": "error",
            "message": "Invalid username format. Username must be between 1 and 80 characters."
        }), 400

    if not re.fullmatch(r'^[a-zA-Z0-9_ ]{1,80}$', username):
        return jsonify({
            "status": "error",
            "message": "Invalid username format. Username can only contain letters, numbers, underscores and spaces."
        }), 400
    
    # Validate password
    if not len(password) >= 10 and len(password) <= 120:
        return jsonify({
            "status": "error",
            "message": "Invalid password format. Password must be between 10 and 120 characters."
        }), 400
    
    if not re.search(r'[!@#$%^&*()_\-+=\[\]{}\\|:;"\'<>,.?/]', password):
        return jsonify({
            "status": "error",
            "message": "Invalid password format. Password must contain at least one special character."
        }), 400
    
    if not re.search(r'[0-9]', password):
        return jsonify({
            "status": "error",
            "message": "Invalid password format. Password must contain at least one numeric character."
        }), 400
    
    if not re.search(r'[A-Z]', password):
        return jsonify({
            "status": "error",
            "message": "Invalid password format. Password must contain at least one uppercase character."
        }), 400
    
    if not re.search(r'[a-z]', password):
        return jsonify({
            "status": "error",
            "message": "Invalid password format. Password must contain at least one lowercase character."
        }), 400

    if UsersAuth.get_user_by_name(username=username) != None:
        return jsonify({
            "status": "error",
            "message": "This username is already in use."
        }), 409

    create_user(username=username, password=password)

    return jsonify({
        "status": "success",
        "message": "User registered successfully."
    }), 201
