# Project imports
from backend.tests.test_helpers import add_test_food_item

# Arguments like client and app are automatically injected from conftest.py


# ------------------------------------
# Testing Get All Food Items
# ------------------------------------
def test_get_all_food_items(client, app):
    # Populate the database with some generic entries
    add_test_food_item(app=app, food_name="Caesar Salad")
    add_test_food_item(app=app, food_name="Hamburger")
    add_test_food_item(app=app, food_name="Banana Bread")

    response = client.get("/browse/food-items")
    data = response.get_json()

    assert response.status_code == 200

    # Check this function returns an exhaustive list of food items
    assert isinstance(data, list)
    assert len(data) == 3

    print(data)

    # Check the JSON structure of a food item
    first_item = data[0]
    assert "id" in first_item
    assert isinstance(first_item["id"], int)
    assert "name" in first_item
    assert isinstance(first_item["name"], str)
