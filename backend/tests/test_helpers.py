# Library imports
from datetime import datetime, timedelta
import pytest

# Project imports
from backend.models.food_category import FoodCategory
from backend.models.food_logging import FoodLogging
from backend.services.authentication_service import create_user
from backend.models.food_item import FoodItem
from backend.models.locations import DiningLocation
from backend.models.users_auth import UsersAuth
from backend.app import db
from backend.services.logging_service import create_transaction


def add_test_user(app, username="Ellen", password="Password123!"):
    """Insert a user directly into the database."""
    with app.app_context():
        create_user(username=username, password=password)


@pytest.fixture
def seeded_users(app):
    """Setup a small user DB for each test."""
    add_test_user(app, "Alice", "Password123!")
    add_test_user(app, "Bob", "!321drowssaP")
    add_test_user(app, "Charlie", "P@ssw0rd123")

    yield  # test runs here

    # Clean up after test
    with app.app_context():
        db.session.query(UsersAuth).delete()
        db.session.commit()


def add_test_food_item(
    app,
    food_name,
    food_category,
    dining_location=1,
    cost=12.99,
    calories=350,
    comments="Default Comment",
    last_updated="Default Date",
    is_vegan=False,
    is_vegetarian=False,
    is_gluten_free=False,
    is_halal=False,
    is_dairy_free=False,
    has_eggs=False,
    has_fish_or_shellfish=False,
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
            is_vegetarian=is_vegetarian,
            is_gluten_free=is_gluten_free,
            is_halal=is_halal,
            is_dairy_free=is_dairy_free,
            has_eggs=has_eggs,
            has_fish_or_shellfish=has_fish_or_shellfish,
            has_milk=has_milk,
            has_peanuts=has_peanuts,
            has_sesame=has_sesame,
            has_soy=has_soy,
            has_treenuts=has_treenuts,
            has_wheat=has_wheat,
            food_category=food_category,
        )


@pytest.fixture
def seeded_food_data(app):
    """Setup a small food_data DB for each test in this file."""
    add_test_food_item(app, "Caesar Salad", "Green Salad")
    add_test_food_item(app, "Hamburger", "Burger")
    add_test_food_item(app, "Banana Bread", "Loaf")

    yield  # test runs here

    # Clean up after test
    with app.app_context():
        db.session.query(FoodItem).delete()
        db.session.commit()


def add_test_food_category(
    app,
    category_name,
    calories=500,
    percent_fruit_veg=0,
    percent_grain=0,
    percent_dairy=0,
    percent_protein=0,
    fat_g=0.0,
    carbs_g=0.0,
    proteins_g=0.0,
    fiber_g=0.0,
    sugar_g=0.0,
    is_vegan=False,
    is_gluten_free=False,
    is_halal=False,
    is_vegetarian=False,
    is_dairy_free=False,
    has_eggs=False,
    has_fish_or_shellfish=False,
    has_milk=False,
    has_peanuts=False,
    has_sesame=False,
    has_soy=False,
    has_treenuts=False,
    has_wheat=False,
):
    """Insert a food category directly into the database."""
    with app.app_context():
        return FoodCategory.create(
            category_name=category_name,
            calories=calories,
            percent_fruit_veg=percent_fruit_veg,
            percent_grain=percent_grain,
            percent_dairy=percent_dairy,
            percent_protein=percent_protein,
            fat_g=fat_g,
            carbs_g=carbs_g,
            proteins_g=proteins_g,
            fiber_g=fiber_g,
            sugar_g=sugar_g,
            is_vegan=is_vegan,
            is_gluten_free=is_gluten_free,
            is_halal=is_halal,
            is_vegetarian=is_vegetarian,
            is_dairy_free=is_dairy_free,
            has_eggs=has_eggs,
            has_fish_or_shellfish=has_fish_or_shellfish,
            has_milk=has_milk,
            has_peanuts=has_peanuts,
            has_sesame=has_sesame,
            has_soy=has_soy,
            has_treenuts=has_treenuts,
            has_wheat=has_wheat,
        )


@pytest.fixture
def seeded_food_categories(app):
    """Setup a small set of generic categories for each test in this file."""
    add_test_food_category(app, "Green Salad")
    add_test_food_category(app, "Burger")
    add_test_food_category(app, "Loaf")

    yield  # test runs here

    # Clean up after test
    with app.app_context():
        db.session.query(FoodItem).delete()
        db.session.commit()


def add_test_dining_location(app, dining_location_name):
    """Insert a dining location directly into the database."""
    with app.app_context():
        DiningLocation.create(dining_location_name=dining_location_name)


@pytest.fixture
def seeded_dining_location_data(app):
    """Setup a small food_data DB for each test in this file."""
    add_test_food_item(app, "Caesar Salad", "Green Salad")
    add_test_food_item(app, "Hamburger", "Burger")
    add_test_food_item(app, "Banana Bread", "Loaf")

    add_test_dining_location(app, "Tim Hortons")

    yield  # test runs here

    # Clean up after test
    with app.app_context():
        db.session.query(FoodItem).delete()
        db.session.query(DiningLocation).delete()
        db.session.commit()


def add_hamburger(
    username,
    transaction_time,
):
    """Helper function to add a hamburger"""
    create_transaction(
        username=username,
        food_name="Hamburger",
        dining_location=1,
        calories=460,
        percent_fruit_veg=20,
        percent_grain=70,
        percent_dairy=10,
        percent_protein=0,
        fat_g=4.2,
        carbs_g=42.0,
        proteins_g=9.5,
        fiber_g=6.8,
        sugar_g=0,
        transaction_time=transaction_time,
    )


def add_salad(
    username,
    transaction_time,
):
    """Helper function to add a Caesar salad"""
    create_transaction(
        username=username,
        food_name="Caesar Salad",
        dining_location=2,
        calories=300,
        percent_fruit_veg=85,
        percent_grain=10,
        percent_dairy=5,
        percent_protein=0,
        fat_g=4.2,
        carbs_g=42.0,
        proteins_g=9.5,
        fiber_g=6.8,
        sugar_g=0.1,
        transaction_time=transaction_time,
    )


def add_banana_bread(
    username,
    transaction_time,
):
    """Helper function to add banana bread"""
    create_transaction(
        username=username,
        food_name="Banana Bread",
        dining_location=3,
        calories=600,
        percent_fruit_veg=20,
        percent_grain=70,
        percent_dairy=5,
        percent_protein=5,
        fat_g=0.3,
        carbs_g=0.1,
        proteins_g=0.1,
        fiber_g=0.1,
        sugar_g=5.0,
        transaction_time=transaction_time,
    )


@pytest.fixture
def seeded_transactions(app):
    """Setup a bunch of transactions across three days"""
    add_hamburger(
        username="Alice",
        transaction_time=datetime.now() - timedelta(days=1),  # One day ago
    )
    add_salad(
        username="Alice",
        transaction_time=datetime.now() - timedelta(days=1),  # One day ago
    )
    add_hamburger(
        username="Alice",
        transaction_time=datetime.now() - timedelta(days=2),  # Two days ago
    )

    add_salad(
        username="Bob",
        transaction_time=datetime.now() - timedelta(days=1),  # One day ago
    )

    add_banana_bread(
        username="Charlie",
        transaction_time=datetime.now() - timedelta(days=1),  # One day ago
    )
    add_salad(
        username="Charlie",
        transaction_time=datetime.now() - timedelta(days=3),  # Three days ago
    )
    add_salad(
        username="Charlie",
        transaction_time=datetime.now() - timedelta(days=3),  # Three days ago
    )

    yield  # test runs here

    # Clean up after test
    with app.app_context():
        db.session.query(FoodLogging).delete()
        db.session.commit()
