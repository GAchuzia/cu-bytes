# Project imports
from backend.tests.test_helpers import seeded_food_data

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
def test_get_first_food_item(client, seeded_food_data):
    response = client.get("/browse/food-item/1")
    data = response.get_json()

    assert response.status_code == 200

    # Check that each field is present and set to the correct value
    assert data["id"] == 1
    assert data["name"] == "Caesar Salad"
    assert data["dining_location"] == "Tim Hortons"
    assert data["cost"] == 12.99
    assert data["calories"] == 350
    assert data["comments"] == "Default Comment"
    assert data["last_updated"] == "Default Date"
    assert data["is_vegan"] is False
    assert data["is_vegetarian"] is False
    assert data["is_gluten_free"] is False
    assert data["is_halal"] is False
    assert data["is_dairy_free"] is False
    assert data["has_eggs"] is False
    assert data["has_fish_or_shellfish"] is False
    assert data["has_milk"] is False
    assert data["has_peanuts"] is False
    assert data["has_sesame"] is False
    assert data["has_soy"] is False
    assert data["has_treenuts"] is False
    assert data["has_wheat"] is False
    assert data["food_category"] == "Green Salad"


def test_get_last_food_item(client, seeded_food_data):
    response = client.get("/browse/food-item/3")
    data = response.get_json()

    assert response.status_code == 200

    # Check that each field is present and set to the correct value
    assert data["id"] == 3
    assert data["name"] == "Banana Bread"


def test_get_nonexistant_food_item(client, seeded_food_data):
    response = client.get("/browse/food-item/30")
    assert response.status_code == 400
