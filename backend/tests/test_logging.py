# Project imports
from backend.tests.test_helpers import seeded_food_data, seeded_users


def test_valid_transactions(client, seeded_food_data, seeded_users):
    response = client.post(
        "/logging/log-by-id", json={"username": "Alice", "food_id": 1}
    )
    data = response.get_json()

    assert response.status_code == 200
    assert "Transaction recorded" in data["message"]

    # Do it again - Duplicates are allowed
    response = client.post(
        "/logging/log-by-id", json={"username": "Alice", "food_id": 1}
    )
    data = response.get_json()

    assert response.status_code == 200
    assert "Transaction recorded" in data["message"]


def test_transaction_missing_fields(client, seeded_food_data, seeded_users):
    # Try empty username
    response = client.post(
        "/logging/log-by-id",
        json={
            "username": "",
            "food_id": 1,
        },
    )
    data = response.get_json()

    assert response.status_code == 400
    assert "username is required" in data["message"]

    # Try missing food_id
    response = client.post(
        "/logging/log-by-id",
        json={
            "username": "Alice",
        },
    )
    data = response.get_json()

    assert response.status_code == 400
    assert "food_id is required" in data["message"]

    # Try misspelling field name. Fields are case sensitive so Food_id != food_id
    response = client.post(
        "/logging/log-by-id", json={"username": "Alice", "Food_id": 1}
    )
    data = response.get_json()

    assert response.status_code == 400
    assert "food_id is required" in data["message"]


def test_transaction_wrong_datatype(client, seeded_food_data, seeded_users):
    # food_id expects integer, pass in a string
    response = client.post(
        "/logging/log-by-id", json={"username": "Alice", "food_id": "Bob"}
    )
    data = response.get_json()

    assert response.status_code == 400
    assert "must be an integer" in data["message"]


def test_transaction_nonexistent_user(client, seeded_food_data, seeded_users):
    response = client.post(
        "/logging/log-by-id", json={"username": "Daniel", "food_id": 1}
    )
    data = response.get_json()

    assert response.status_code == 400
    assert "No matching username found" in data["message"]


def test_transaction_nonexistent_food_id(client, seeded_food_data, seeded_users):
    response = client.post(
        "/logging/log-by-id", json={"username": "Alice", "food_id": 1111}
    )
    data = response.get_json()

    assert response.status_code == 400
    assert "No matching food_id found" in data["message"]
