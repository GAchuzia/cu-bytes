# Project imports
from backend.tests.test_helpers import seeded_food_data, seeded_food_categories

# Arguments like client and app are automatically injected from conftest.py
# seeded_food_data is automatically injected from test_helpers.py
# To get the per-test food_data setup and teardown inject seeded_food_data


# ------------------------------------
# Testing Get All Food Items
# ------------------------------------
def test_get_all_food_items(client, seeded_food_data):
    response = client.get("/browse/food-items")
    data = response.get_json()

    assert response.status_code == 200

    # Check this function returns an exhaustive list of food items
    assert isinstance(data, list)
    assert len(data) == 3

    # Check the JSON structure of a food item
    first_item = data[0]
    assert "id" in first_item
    assert isinstance(first_item["id"], int)
    assert "name" in first_item
    assert isinstance(first_item["name"], str)


# ------------------------------------
# Testing Getting Specific Food Items
# ------------------------------------
def test_get_first_food_item(client, seeded_food_data, seeded_food_categories):
    response = client.get("/browse/food-item/1")
    data = response.get_json()

    assert response.status_code == 200

    # Check that each field is present and set to the correct value
    assert data["id"] == 1
    assert data["name"] == "Caesar Salad"
    assert data["dining_location"] == "Basil Box"
    assert data["cost"] == 12.99
    assert data["calories"] == 350
    assert data["comments"] == "Default Comment"
    assert data["last_updated"] == "Default Date"
    assert data["is_vegan"] is False
    assert data["is_vegetarian"] is False
    assert data["is_gluten_free"] is False
    assert data["is_halal"] is False
    assert data["is_dairy_free"] is False
    assert data["has_eggs"] is True
    assert data["has_fish_or_shellfish"] is False
    assert data["has_milk"] is False
    assert data["has_peanuts"] is False
    assert data["has_sesame"] is False
    assert data["has_soy"] is False
    assert data["has_sulfites"] is False
    assert data["has_treenuts"] is False
    assert data["has_wheat"] is False
    assert data["food_category"] == "Green Salad"


def test_get_last_food_item(client, seeded_food_data, seeded_food_categories):
    response = client.get("/browse/food-item/3")
    data = response.get_json()

    assert response.status_code == 200

    # Check that each field is present and set to the correct value
    assert data["id"] == 3
    assert data["name"] == "Banana Bread"


def test_get_nonexistant_food_item(client, seeded_food_data):
    response = client.get("/browse/food-item/30")
    assert response.status_code == 400


# ------------------------------------
# Testing Get Food Items By Name
# ------------------------------------
def test_get_by_name_invalid(client, seeded_food_data):
    # Try missing food_name in JSON
    response = client.get("/browse/food-item-by-name?name")
    data = response.get_json()

    assert response.status_code == 400
    assert "food_name is required" in data["message"]


def test_get_by_name_invalid_category(client, seeded_food_data):
    # Try non existent category
    response = client.get("/browse/food-item-by-name?name=Alice")
    data = response.get_json()

    assert response.status_code == 200
    assert len(data["food_items"]) == 0


def test_get_by_name_valid_category(client, seeded_food_data):
    # Try valid category
    response = client.get("/browse/food-item-by-name?name=Loaf")
    data = response.get_json()

    assert response.status_code == 200
    assert len(data["food_items"]) == 1

    loaf = data["food_items"][0]
    assert loaf["dining_location"] == "Basil Box"
    assert loaf["id"] == 3
    assert loaf["name"] == "Banana Bread"

    # Try valid category containing a space
    response = client.get("/browse/food-item-by-name?name=Green%20Salad")
    data = response.get_json()

    assert response.status_code == 200
    assert len(data["food_items"]) == 1

    loaf = data["food_items"][0]
    assert loaf["dining_location"] == "Basil Box"
    assert loaf["id"] == 1
    assert loaf["name"] == "Caesar Salad"
