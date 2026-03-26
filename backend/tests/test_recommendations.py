# Project imports
from backend.tests.test_helpers import (
    add_test_user,
    seeded_food_data,
    seeded_users,
    seeded_food_categories,
    seeded_transactions,
    seeded_extended_food_data,
)


def test_all_recommendations_invalid_user(client, seeded_users):
    # Test invalid usernames for all statistics endpoints that require username
    response = client.get("/recommend/trending/Alison")
    assert response.status_code == 400

    response = client.get("/recommend/random/Alison")
    assert response.status_code == 400

    response = client.get("/recommend/ideal/Alison")
    assert response.status_code == 400

    response = client.get("/recommend/nutrient/Alison")
    assert response.status_code == 400

    response = client.get("/recommend/similar/Alison")
    assert response.status_code == 400


def test_all_recommendations_invalid_range(client, seeded_users, seeded_food_data):
    # Test invalid ranges for all statistics endpoints
    response = client.get("/recommend/trending/Alice?items=0")
    assert response.status_code == 400

    response = client.get("/recommend/random/Alice?items=0")
    assert response.status_code == 400

    # Maximum items capped by number of items in database
    response = client.get("/recommend/random/Alice?items=4")
    assert response.status_code == 400
    data = response.get_json()
    assert "Not enough items in database" in data["message"]

    response = client.get("/recommend/ideal/Alice?items=0")
    assert response.status_code == 400

    response = client.get("/recommend/nutrient/Alice?items=0")
    assert response.status_code == 400

    response = client.get("/recommend/similar/Alice?items=0")
    assert response.status_code == 400

    response = client.get("/recommend/similar/Alice?users=0")
    assert response.status_code == 400


def test_trending_recommendations_no_items_in_range(
    client, seeded_users, seeded_transactions
):
    # All seeded users have show stats are off by default
    response = client.get("/recommend/trending/Alice")
    assert response.status_code == 204

    # Turn on show_stats for Alice
    client.post(
        "/profile/edit",
        json={"show_stats": True, "username": "Alice"},
    )

    # Still expect no content because Alice should not get recommendations
    # based on her own past data
    response = client.get("/recommend/trending/Alice")
    assert response.status_code == 204


def test_trending_recommendations_by_name(
    client,
    seeded_users,
    seeded_food_data,
    seeded_food_categories,
):
    """
    Test when the trending food item matches the name of a Carleton food item
    """
    # Turn on stats for Bob
    client.post(
        "/profile/edit",
        json={"show_stats": True, "username": "Bob"},
    )

    # Add an item for bob
    response = client.post(
        "/logging/log-by-id",
        json={"username": "Bob", "food_id": 1},
    )

    # Test Make sure Alice is recommended the item
    response = client.get("/recommend/trending/Alice")
    assert response.status_code == 200

    data = response.get_json()
    assert len(data["food_items"]) == 1

    recommended_item = data["food_items"][0]
    assert recommended_item["dining_location"] == "Basil Box"
    assert recommended_item["id"] == 1
    assert recommended_item["name"] == "Caesar Salad"

    # Make Alice allergic to the item
    client.post(
        "/profile/edit",
        json={"has_egg_allergy": True, "username": "Alice"},
    )

    response = client.get("/recommend/trending/Alice")
    assert response.status_code == 204


def test_trending_recommendations_by_category(
    client,
    seeded_users,
    seeded_food_data,
    seeded_food_categories,
):
    """
    Test when the trending food item matches the name of a food category
    """
    # Turn on stats for Bob
    client.post(
        "/profile/edit",
        json={"show_stats": True, "username": "Bob"},
    )

    # Add an item for bob
    response = client.post(
        "/logging/log-by-name",
        json={"username": "Bob", "food_name": "Green Salad"},
    )

    # Test Make sure Alice is recommended the item
    response = client.get("/recommend/trending/Alice")
    assert response.status_code == 200

    data = response.get_json()
    assert len(data["food_items"]) == 1

    recommended_item = data["food_items"][0]
    assert recommended_item["dining_location"] == "Basil Box"
    assert recommended_item["id"] == 1
    assert recommended_item["name"] == "Caesar Salad"


def test_trending_recommendations_item_not_found(
    client,
    seeded_users,
    seeded_food_data,
    seeded_food_categories,
):
    """
    Test when the trending food item is not found at Carleton
    """
    # Turn on stats for Bob
    client.post(
        "/profile/edit",
        json={"show_stats": True, "username": "Bob"},
    )

    # Add an item for bob
    response = client.post(
        "/logging/log-by-name",
        json={"username": "Bob", "food_name": "ABCDEFG"},
    )

    # Alice sees no recommendations
    response = client.get("/recommend/trending/Alice?days=3")
    assert response.status_code == 204


def test_trending_recommendations_multi_user(
    client,
    seeded_users,
    seeded_food_data,
    seeded_food_categories,
):
    """
    Test when the trending food item matches the name of a Carleton food item
    """
    # Turn on stats for Bob
    client.post(
        "/profile/edit",
        json={"show_stats": True, "username": "Bob"},
    )

    # Add an item for Charlie
    response = client.post(
        "/logging/log-by-id",
        json={"username": "Bob", "food_id": 1},
    )

    # Add three items for Charlie
    response = client.post(
        "/logging/log-by-id",
        json={"username": "Charlie", "food_id": 2},
    )
    response = client.post(
        "/logging/log-by-id",
        json={"username": "Charlie", "food_id": 2},
    )
    response = client.post(
        "/logging/log-by-id",
        json={"username": "Charlie", "food_id": 2},
    )

    # Make sure Alice is recommended the item from Bob (Charlie's items are hidden)
    response = client.get("/recommend/trending/Alice")
    assert response.status_code == 200

    data = response.get_json()
    assert len(data["food_items"]) == 1

    recommended_item = data["food_items"][0]
    assert recommended_item["dining_location"] == "Basil Box"
    assert recommended_item["id"] == 1
    assert recommended_item["name"] == "Caesar Salad"

    # Turn on stats for Charlie
    client.post(
        "/profile/edit",
        json={"show_stats": True, "username": "Charlie"},
    )

    # Make sure Alice is recommended the item from Charlie first
    response = client.get("/recommend/trending/Alice")
    assert response.status_code == 200

    data = response.get_json()
    assert len(data["food_items"]) == 2

    recommended_item_1 = data["food_items"][0]
    assert recommended_item_1["dining_location"] == "Basil Box"
    assert recommended_item_1["id"] == 2
    assert recommended_item_1["name"] == "Hamburger"

    recommended_item_2 = data["food_items"][1]
    assert recommended_item_2["dining_location"] == "Basil Box"
    assert recommended_item_2["id"] == 1
    assert recommended_item_2["name"] == "Caesar Salad"

    # Try restricting the items shown, should only see Charlie's item
    response = client.get("/recommend/trending/Alice?items=1")
    assert response.status_code == 200

    data = response.get_json()
    assert len(data["food_items"]) == 1

    recommended_item = data["food_items"][0]
    assert recommended_item["dining_location"] == "Basil Box"
    assert recommended_item["id"] == 2
    assert recommended_item["name"] == "Hamburger"


def test_random_recommendation_no_overlap(
    client, seeded_users, seeded_food_data, seeded_transactions
):
    # Test requesting items less than the number of uneaten items
    # This means that recommendations should not include consumed food items

    # Alice already consumed Salad and Hamburger, the only uneaten item in the loaf
    response = client.get("/recommend/random/Alice?items=1")
    assert response.status_code == 200

    data = response.get_json()
    assert len(data["food_items"]) == 1

    recommended_item = data["food_items"][0]
    assert recommended_item["dining_location"] == "Basil Box"
    assert recommended_item["id"] == 3
    assert recommended_item["name"] == "Banana Bread"

    # Bob has already consumed Salad
    response = client.get("/recommend/random/Bob?items=1")
    assert response.status_code == 200

    data = response.get_json()
    assert len(data["food_items"]) == 1

    # Check that the item is not Ceasar Salad
    recommended_item = data["food_items"][0]
    assert recommended_item["dining_location"] == "Basil Box"
    assert recommended_item["id"] != 1
    assert recommended_item["name"] != "Caesar Salad"

    # Make Alice allergic to all items
    client.post(
        "/profile/edit",
        json={"has_egg_allergy": True, "username": "Alice"},
    )

    response = client.get("/recommend/random/Alice?items=1")
    assert response.status_code == 204


def test_random_recommendation_overlap(
    client, seeded_users, seeded_food_data, seeded_transactions
):
    # Test requesting items more than the number of uneaten items
    # This means that recommendations will include the uneaten items
    # plus some already-eaten items

    # Alice already consumed Salad and Hamburger
    response = client.get("/recommend/random/Alice?items=2")
    assert response.status_code == 200

    data = response.get_json()
    assert len(data["food_items"]) == 2

    # Top recommendation should be the uneaten item
    recommended_item1 = data["food_items"][0]
    assert recommended_item1["dining_location"] == "Basil Box"
    assert recommended_item1["id"] == 3
    assert recommended_item1["name"] == "Banana Bread"

    # Check that the second item is different
    recommended_item2 = data["food_items"][1]
    assert recommended_item2["name"] != "Banana Bread"

    # Bob has already consumed Salad
    response = client.get("/recommend/random/Bob?items=3")
    assert response.status_code == 200

    data = response.get_json()
    assert len(data["food_items"]) == 3

    # Check that the first two items are not Salad
    recommended_item1 = data["food_items"][0]
    recommended_item2 = data["food_items"][1]
    assert recommended_item1["name"] != "Caesar Salad"
    assert recommended_item2["name"] != "Caesar Salad"

    # Check that the last of the recommended items is the Salad
    recommended_item3 = data["food_items"][2]
    assert recommended_item3["dining_location"] == "Basil Box"
    assert recommended_item3["id"] == 1
    assert recommended_item3["name"] == "Caesar Salad"


def test_ideal_recommendation_old_user(
    client, seeded_users, seeded_transactions, seeded_extended_food_data
):
    # Test using Alice, who has already logged a few items
    response = client.get("/recommend/ideal/Alice?items=10")
    assert response.status_code == 200

    data = response.get_json()
    # Number of ttems requested will try to be as close to requested as possible
    assert len(data["food_items"]) == 2

    # Based on Alice's consumption patterns, a Hamburger is prefered over Salad
    recommended_item = data["food_items"][0]
    assert recommended_item["dining_location"] == "Basil Box"
    assert recommended_item["id"] == 2
    assert recommended_item["name"] == "Hamburger"

    recommended_item = data["food_items"][1]
    assert recommended_item["dining_location"] == "Basil Box"
    assert recommended_item["id"] == 1
    assert recommended_item["name"] == "Caesar Salad"

    # Banana loaf should not show up as a recommendation due to high sugar

    # Make Alice allergic all items
    client.post(
        "/profile/edit",
        json={"has_egg_allergy": True, "username": "Alice"},
    )

    response = client.get("/recommend/ideal/Alice?items=10")
    assert response.status_code == 204


def test_ideal_recommendation_new_user(client, seeded_extended_food_data):
    # Add a new user
    response = client.post(
        "/auth/register", json={"username": "Ellen", "password": "HelloWorld123!@#"}
    )

    response = client.get("/recommend/ideal/Ellen?items=10")
    assert response.status_code == 200

    data = response.get_json()
    assert len(data["food_items"]) == 2

    # At a baseline (no history), a Caesar salad is recommended over a burger
    recommended_item = data["food_items"][0]
    assert recommended_item["dining_location"] == "Basil Box"
    assert recommended_item["id"] == 1
    assert recommended_item["name"] == "Caesar Salad"

    recommended_item = data["food_items"][1]
    assert recommended_item["dining_location"] == "Basil Box"
    assert recommended_item["id"] == 2
    assert recommended_item["name"] == "Hamburger"


def test_nutrient_recommendation_new_user(client, seeded_extended_food_data):
    # Add a new user
    response = client.post(
        "/auth/register", json={"username": "Ellen", "password": "HelloWorld123!@#"}
    )

    # Expect no content because no logged items to calculate a deficient nutrient
    response = client.get("/recommend/nutrient/Ellen?items=10")
    assert response.status_code == 204


def test_nutrient_recommendation(
    client, seeded_users, seeded_transactions, seeded_extended_food_data
):
    # Test using Alice, who has already logged a few items
    response = client.get("/recommend/nutrient/Alice?items=10")
    assert response.status_code == 200

    data = response.get_json()
    assert data["deficient_nutrient"] == "Fat"

    # Number of ttems requested will try to be as close to requested as possible
    assert len(data["food_items"]) == 2

    # Hamburgers are higher in fat than salads
    recommended_item = data["food_items"][0]
    assert recommended_item["dining_location"] == "Basil Box"
    assert recommended_item["id"] == 2
    assert recommended_item["name"] == "Hamburger"

    recommended_item = data["food_items"][1]
    assert recommended_item["dining_location"] == "Basil Box"
    assert recommended_item["id"] == 1
    assert recommended_item["name"] == "Caesar Salad"

    # Banana loaf should not show up as a recommendation due to high sugar

    # Make Alice allergic all items
    client.post(
        "/profile/edit",
        json={"has_egg_allergy": True, "username": "Alice"},
    )

    response = client.get("/recommend/nutrient/Alice?items=10")
    data = response.get_json()

    assert data["deficient_nutrient"] == "Fat"
    assert len(data["food_items"]) == 0


def test_similar_recommendations_no_items_logged(client, seeded_users):
    # Turn on stats for Charlie
    client.post(
        "/profile/edit",
        json={"show_stats": True, "username": "Charlie"},
    )

    # No items logged by users (no seeded_transactions), so no items to compare
    response = client.get("/recommend/similar/Alice")
    assert response.status_code == 204


def test_similar_recommendations_no_users_showing_stats(
    client, seeded_users, seeded_transactions
):
    # All seeded users have show stats are off by default
    # Turn on show_stats for Alice
    client.post(
        "/profile/edit",
        json={"show_stats": True, "username": "Alice"},
    )

    # Alice should not get recommendations based on herself
    response = client.get("/recommend/similar/Alice")
    assert response.status_code == 204


def test_similar_recommendations_full_overlap(
    client,
    seeded_users,
    seeded_food_data,
    seeded_food_categories,
    seeded_transactions,
):
    """
    Test when there is no extra overlap between similar users
    """
    # Turn on stats for Bob
    client.post(
        "/profile/edit",
        json={"show_stats": True, "username": "Bob"},
    )

    # Alice has eaten a hamburger and salad, Bob has only eaten the salad
    response = client.get("/recommend/similar/Alice")
    assert response.status_code == 204


def test_similar_recommendations_some_overlap(
    client,
    seeded_users,
    seeded_food_data,
    seeded_food_categories,
    seeded_transactions,
):
    """
    Test when there is only overlap between similar users
    """
    # Turn on stats for Charlie
    client.post(
        "/profile/edit",
        json={"show_stats": True, "username": "Charlie"},
    )

    # Alice has eaten a hamburger and salad, Charlie has eaten Banana bread and salad
    response = client.get("/recommend/similar/Alice")
    assert response.status_code == 200

    data = response.get_json()
    assert len(data["food_items"]) == 1

    # Check that the item is Banana bread
    recommended_item = data["food_items"][0]
    assert recommended_item["dining_location"] == "Basil Box"
    assert recommended_item["id"] == 3
    assert recommended_item["name"] == "Banana Bread"

    # Check recommendation in the reverse direction
    # Turn on stats for Alice
    client.post(
        "/profile/edit",
        json={"show_stats": True, "username": "Alice"},
    )

    response = client.get("/recommend/similar/Charlie")
    assert response.status_code == 200

    data = response.get_json()
    assert len(data["food_items"]) == 1

    # Check that the item is Hamburger
    recommended_item = data["food_items"][0]
    assert recommended_item["dining_location"] == "Basil Box"
    assert recommended_item["id"] == 2
    assert recommended_item["name"] == "Hamburger"

    # Make Alice allergic all items
    client.post(
        "/profile/edit",
        json={"has_egg_allergy": True, "username": "Alice"},
    )

    response = client.get("/recommend/similar/Alice")
    assert response.status_code == 204
