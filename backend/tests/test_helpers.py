# Library imports
import pytest

# Project imports
from backend.services.authentication_service import create_user
from backend.models.food_item import FoodItem
from backend.app import db


def add_test_user(app, username="Ellen", password="Password123!"):
    """Insert a user directly into the database."""
    with app.app_context():
        create_user(username=username, password=password)


def add_test_food_item(
    app,
    food_name,
    dining_location="Default Dining Location",
    cost=12.99,
    calories=350,
    comments="Default Comment",
    last_updated="Default Date",
    is_vegan=False,
    is_gluten_free=False,
    is_halal=False,
    is_kosher=False,
    is_dairy_free=False,
    has_eggs=False,
    has_fish=False,
    has_milk=False,
    has_peanuts=False,
    has_sesame=False,
    has_soy=False,
    has_treenuts=False,
    has_wheat=False,
):
    """Insert a food item directly into the database."""
    with app.app_context():
        FoodItem.create(
            food_name=food_name,
            dining_location=dining_location,
            cost=cost,
            calories=calories,
            comments=comments,
            last_updated=last_updated,
            is_vegan=is_vegan,
            is_gluten_free=is_gluten_free,
            is_halal=is_halal,
            is_kosher=is_kosher,
            is_dairy_free=is_dairy_free,
            has_eggs=has_eggs,
            has_fish=has_fish,
            has_milk=has_milk,
            has_peanuts=has_peanuts,
            has_sesame=has_sesame,
            has_soy=has_soy,
            has_treenuts=has_treenuts,
            has_wheat=has_wheat,
        )


@pytest.fixture
def seeded_food_data(app):
    """Setup a small food_data DB for each test in this file."""
    add_test_food_item(app, "Caesar Salad")
    add_test_food_item(app, "Hamburger")
    add_test_food_item(app, "Banana Bread")

    yield  # test runs here

    # Clean up after test
    with app.app_context():
        db.session.query(FoodItem).delete()
        db.session.commit()
