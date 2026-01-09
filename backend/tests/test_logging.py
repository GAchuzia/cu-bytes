# Project imports
from backend.tests.test_helpers import seeded_food_data, seeded_users


def test_valid_transactions_by_id(client, seeded_food_data, seeded_users):
    response = client.post(
        "/logging/log-by-id",
        json={"username": "Alice", "food_id": 1},
    )
    data = response.get_json()

    assert response.status_code == 200
    assert "Transaction recorded" in data["message"]

    # Do it again - Duplicates are allowed
    response = client.post(
        "/logging/log-by-id",
        json={"username": "Alice", "food_id": 1},
    )
    data = response.get_json()

    assert response.status_code == 200
    assert "Transaction recorded" in data["message"]


def test_transaction_missing_fields_by_id(client, seeded_food_data, seeded_users):
    # Try empty username
    response = client.post(
        "/logging/log-by-id",
        json={"username": "", "food_id": 1},
    )
    data = response.get_json()

    assert response.status_code == 400
    assert "username is required" in data["message"]

    # Try missing food_id
    response = client.post(
        "/logging/log-by-id",
        json={"username": "Alice"},
    )
    data = response.get_json()

    assert response.status_code == 400
    assert "food_id is required" in data["message"]

    # Try misspelling field name. Fields are case sensitive so Food_id != food_id
    response = client.post(
        "/logging/log-by-id",
        json={"username": "Alice", "Food_id": 1},
    )
    data = response.get_json()

    assert response.status_code == 400
    assert "food_id is required" in data["message"]


def test_transaction_wrong_datatype_by_id(client, seeded_food_data, seeded_users):
    # food_id expects integer, pass in a string
    response = client.post(
        "/logging/log-by-id",
        json={"username": "Alice", "food_id": "Bob"},
    )
    data = response.get_json()

    assert response.status_code == 400
    assert "must be an integer" in data["message"]


def test_transaction_nonexistent_user_by_id(client, seeded_food_data, seeded_users):
    response = client.post(
        "/logging/log-by-id",
        json={"username": "Daniel", "food_id": 1},
    )
    data = response.get_json()

    assert response.status_code == 400
    assert "No matching username found" in data["message"]


def test_transaction_nonexistent_food_id(client, seeded_food_data, seeded_users):
    response = client.post(
        "/logging/log-by-id",
        json={"username": "Alice", "food_id": 1111},
    )
    data = response.get_json()

    assert response.status_code == 400
    assert "No matching food_id found" in data["message"]


def test_valid_transactions_by_name(client, seeded_food_data, seeded_users):
    response = client.post(
        "/logging/log-by-name",
        json={"username": "Alice", "food_name": "Pizza"},
    )
    data = response.get_json()

    assert response.status_code == 200
    assert "Transaction recorded" in data["message"]

    # Do it again - Duplicates are allowed
    response = client.post(
        "/logging/log-by-name",
        json={"username": "Alice", "food_name": "Pizza"},
    )
    data = response.get_json()

    assert response.status_code == 200
    assert "Transaction recorded" in data["message"]


def test_transaction_missing_fields_by_name(client, seeded_food_data, seeded_users):
    # Try empty username
    response = client.post(
        "/logging/log-by-name",
        json={"username": "", "food_name": "Pizza"},
    )
    data = response.get_json()

    assert response.status_code == 400
    assert "username is required" in data["message"]

    # Try missing food_name
    response = client.post(
        "/logging/log-by-name",
        json={"username": "Alice"},
    )
    data = response.get_json()

    assert response.status_code == 400
    assert "food_name is required" in data["message"]

    # Try misspelling field name. Fields are case sensitive so Name_id != name_id
    response = client.post(
        "/logging/log-by-name",
        json={"username": "Alice", "Food_name": "Pizza"},
    )
    data = response.get_json()

    assert response.status_code == 400
    assert "food_name is required" in data["message"]


def test_transaction_wrong_datatype_by_name(client, seeded_food_data, seeded_users):
    # food_name expects string, pass in an int
    response = client.post(
        "/logging/log-by-name",
        json={"username": "Alice", "food_name": 1},
    )
    data = response.get_json()

    assert response.status_code == 400
    assert "must be a string" in data["message"]


def test_transaction_nonexistent_user_by_name(client, seeded_food_data, seeded_users):
    response = client.post(
        "/logging/log-by-name",
        json={"username": "Daniel", "food_name": "Pizza"},
    )
    data = response.get_json()

    assert response.status_code == 400
    assert "No matching username found" in data["message"]


# Fiona TODO: Uncomment this test - Currently fails because no label checking
# def test_transaction_nonexistent_food_name(client, seeded_food_data, seeded_users):
#     response = client.post(
#         "/logging/log-by-name",
#         json={"username": "Alice", "food_name": "Notebook"},
#     )
#     data = response.get_json()

#     assert response.status_code == 400
#     assert "No matching food_name found" in data["message"]
