# Project imports
from backend.tests.test_helpers import seeded_dining_location_data

# Arguments like client and app are automatically injected from conftest.py
# seeded_dining_location data is is automatically injected from test_helpers.py
# To get the per-test food_data setup and teardown inject seeded_dining_location_data

# ------------------------------------
# Testing Get All Dining Locations
# ------------------------------------
def test_get_all_dining_locations(client, seeded_dining_location_data):
    response = client.get("/locations/dining-locations")
    data = response.get_json()
    
    assert response.status_code == 200

    # Check this function returns an exhaustive list of dining locations
    assert isinstance(data, list)
    assert len(data) == 1

    # Check the JSON structure of a dining location
    first_location = data[0]
    assert "id" in first_location
    assert isinstance(first_location["id"], int)
    assert "name" in first_location
    assert isinstance(first_location["name"], str)


# --------------------------------------------------------
# Testing Getting Food Items from Specific Dining Location
# --------------------------------------------------------
def test_get_food_items_at_first_dining_location(client, seeded_dining_location_data):
    response = client.get("/locations/dining-location/1")
    print(response)
    
    data = response.get_json()
    print(data)
    
    assert response.status_code == 200

    # Check this function returns an exhaustive list of food items at the specific dining location
    assert isinstance(data, list)
    assert len(data) == 3

    # Check that each field is present and set to the correct value
    first_food_item = data[0]
    second_food_item = data[1]
    third_food_item = data[2]

    assert first_food_item["id"] == 1
    assert first_food_item["name"] == "Caesar Salad"

    assert second_food_item["id"] == 2
    assert second_food_item["name"] == "Hamburger"
    
    assert third_food_item["id"] == 3
    assert third_food_item["name"] == "Banana Bread"
    
    
# ------------------------------------------------------------
# Testing Getting Food Items from Non-Existant Dining Location
# ------------------------------------------------------------
def test_get_food_items_at_nonexistant_dining_location(client, seeded_dining_location_data):
    response = client.get("/locations/dining-location/3")
    data = response.get_json()

    assert response.status_code == 200

    # Check this function returns an exhaustive list of food items at the specific dining location
    assert isinstance(data, list)
    assert len(data) == 0