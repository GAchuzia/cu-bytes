# Project imports
from backend.services.authentication_service import create_user


def add_test_user(app, username="Ellen", password="Password123!"):
    """Insert a user directly into the database."""
    with app.app_context():
        create_user(username=username, password=password)
