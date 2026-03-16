# Project imports
from backend.tests.test_helpers import (
    seeded_users,
    add_test_user,
    seeded_transactions,
)

# Arguments like client and app are automatically injected from conftest.py
# seeded_food_data is automatically injected from test_helpers.py
# To get the per-test food_data setup and teardown inject seeded_food_data


# ------------------------------------
# Testing Retreive User Profile
# ------------------------------------
def test_retreive_default_user_profile(client, seeded_users):
    response = client.get("/profile/retreive/Alice")
    data = response.get_json()

    assert response.status_code == 200
    assert len(data) == 17

    assert data["username"] == "Alice"
    assert data["has_configured_settings"] is False
    assert data["show_stats"] is False
    assert data["has_egg_allergy"] is False
    assert data["has_fish_or_shellfish_allergy"] is False
    assert data["has_dairy_intolerance"] is False
    assert data["has_milk_allergy"] is False
    assert data["has_peanut_allergy"] is False
    assert data["has_sesame_allergy"] is False
    assert data["has_soy_allergy"] is False
    assert data["has_sulfite_allergy"] is False
    assert data["has_treenut_allergy"] is False
    assert data["has_wheat_allergy"] is False
    assert data["has_gluten_allergy"] is False
    assert data["is_vegan"] is False
    assert data["is_vegetarian"] is False
    assert data["prefers_halal"] is False


def test_retreive_valid_user_profile(client, app):
    # Try a case with username consisting of possible valid characters
    add_test_user(app, username="Joe123_O", password="Password123!")
    response = client.get("/profile/retreive/Joe123_O")
    assert response.status_code == 200

    # Try a case with username consisting of numbers
    add_test_user(app, username=" ", password="Password123!")
    response = client.get("/profile/retreive/ ")
    assert response.status_code == 200

    # Try a case with username consisting of numbers
    add_test_user(app, username="1", password="Password123!")
    response = client.get("/profile/retreive/1")
    assert response.status_code == 200

    # Try a case with username consisting of underscores
    add_test_user(app, username="_", password="Password123!")
    response = client.get("/profile/retreive/_")
    assert response.status_code == 200


def test_retreive_invalid_user_profile(client):
    # Try a case with username consisting of possible valid characters
    response = client.get("/profile/retreive/Joe123_O")
    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "No matching username" in data["message"]

    # Try a case with username consisting of numbers
    response = client.get("/profile/retreive/123")
    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "No matching username" in data["message"]

    # Try a case with username consisting of numbers
    response = client.get("/profile/retreive/1")
    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "No matching username" in data["message"]

    # Try a case with username consisting of underscores
    response = client.get("/profile/retreive/_")
    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "No matching username" in data["message"]


# ------------------------------------
# Testing Retreive User Profile
# ------------------------------------
def test_default_configuration_flag(client, seeded_users):
    response = client.get("/profile/configured/Alice")
    data = response.get_json()

    assert response.status_code == 200
    assert data["has_configured_settings"] is False


# ------------------------------------
# Testing Edit User Profile
# ------------------------------------
def test_edit_partial_user_profile(client, seeded_users):
    # Change a small subset of features
    response = client.post(
        "/profile/edit",
        json={
            "username": "Alice",
            "is_vegan": True,
            "has_treenut_allergy": True,
            "prefers_halal": False,
        },
    )
    data = response.get_json()

    assert response.status_code == 200
    assert "Profile updated successfully" in data["message"]

    # Check that the returned user json reflects the edits
    response = client.get("/profile/retreive/Alice")
    data = response.get_json()

    assert response.status_code == 200
    assert len(data) == 17

    assert data["username"] == "Alice"
    assert data["has_configured_settings"] is True
    assert data["show_stats"] is False
    assert data["has_egg_allergy"] is False
    assert data["has_fish_or_shellfish_allergy"] is False
    assert data["has_dairy_intolerance"] is False
    assert data["has_milk_allergy"] is False
    assert data["has_peanut_allergy"] is False
    assert data["has_sesame_allergy"] is False
    assert data["has_soy_allergy"] is False
    assert data["has_sulfite_allergy"] is False
    assert data["has_treenut_allergy"] is True
    assert data["has_wheat_allergy"] is False
    assert data["has_gluten_allergy"] is False
    assert data["is_vegan"] is True
    assert data["is_vegetarian"] is False
    assert data["prefers_halal"] is False


def test_edit_whole_user_profile(client, seeded_users):
    # Specify all available features
    response = client.post(
        "/profile/edit",
        json={
            "has_configured_settings": True,
            "has_dairy_intolerance": False,
            "has_egg_allergy": False,
            "has_fish_or_shellfish_allergy": False,
            "has_gluten_allergy": True,
            "has_milk_allergy": False,
            "has_peanut_allergy": True,
            "has_sesame_allergy": True,
            "has_soy_allergy": True,
            "has_sulfite_allergy": True,
            "has_treenut_allergy": True,
            "has_wheat_allergy": True,
            "is_vegan": True,
            "is_vegetarian": True,
            "prefers_halal": True,
            "show_stats": True,
            "username": "Alice",
            "carleton_student_id": 10234521,  # Nonexsitant fields should be ignored
        },
    )
    data = response.get_json()

    assert response.status_code == 200
    assert "Profile updated successfully" in data["message"]

    # Check that the returned user json reflects the edits
    response = client.get("/profile/retreive/Alice")
    data = response.get_json()

    assert response.status_code == 200
    assert len(data) == 17

    assert data["username"] == "Alice"
    assert data["has_configured_settings"] is True
    assert data["show_stats"] is True
    assert data["has_egg_allergy"] is False
    assert data["has_fish_or_shellfish_allergy"] is False
    assert data["has_dairy_intolerance"] is False
    assert data["has_milk_allergy"] is False
    assert data["has_peanut_allergy"] is True
    assert data["has_sesame_allergy"] is True
    assert data["has_soy_allergy"] is True
    assert data["has_sulfite_allergy"] is True
    assert data["has_treenut_allergy"] is True
    assert data["has_wheat_allergy"] is True
    assert data["has_gluten_allergy"] is True
    assert data["is_vegan"] is True
    assert data["is_vegetarian"] is True
    assert data["prefers_halal"] is True


def test_edit_user_profile_invalid_type(client, seeded_users):
    # Try an invalid argument type
    response = client.post(
        "/profile/edit",
        json={"has_peanut_allergy": True, "show_stats": "True", "username": "Alice"},
    )
    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "must be a boolean" in data["message"]

    # Underlying user profile should remain unchanged
    response = client.get("/profile/retreive/Alice")
    data = response.get_json()

    assert response.status_code == 200
    assert len(data) == 17

    assert data["username"] == "Alice"
    assert data["has_configured_settings"] is False
    assert data["show_stats"] is False
    assert data["has_egg_allergy"] is False
    assert data["has_fish_or_shellfish_allergy"] is False
    assert data["has_dairy_intolerance"] is False
    assert data["has_milk_allergy"] is False
    assert data["has_peanut_allergy"] is False
    assert data["has_sesame_allergy"] is False
    assert data["has_soy_allergy"] is False
    assert data["has_sulfite_allergy"] is False
    assert data["has_treenut_allergy"] is False
    assert data["has_wheat_allergy"] is False
    assert data["has_gluten_allergy"] is False
    assert data["is_vegan"] is False
    assert data["is_vegetarian"] is False
    assert data["prefers_halal"] is False


def test_edit_user_profile_no_optional_args(client, seeded_users):
    # Sending no optional arguments still counts as having updated settings
    response = client.post("/profile/edit", json={"username": "Alice"})
    data = response.get_json()

    assert response.status_code == 200
    assert "Profile updated successfully" in data["message"]

    # Check settings flag in underlying user profile
    response = client.get("/profile/configured/Alice")
    data = response.get_json()

    assert response.status_code == 200
    assert data["has_configured_settings"] is True


# -------------------------------------
# Testing Deleting User and their Data
# -------------------------------------


def test_delete_user_invalid_username(client, seeded_users):
    response = client.delete("/profile/Alison", json={"password": "Password123!"})
    data = response.get_json()

    assert response.status_code == 400
    assert "No matching username" in data["message"]


def test_delete_user_invalid_password(client, seeded_users):
    # Try missing password field
    response = client.delete("/profile/Alice", json={"hello": "Alice"})
    data = response.get_json()

    assert response.status_code == 400
    assert "password is required" in data["message"]

    # Try wrong password
    response = client.delete("/profile/Alice", json={"password": "AliceIsMe123!"})
    data = response.get_json()

    assert response.status_code == 400
    assert "Password does not match" in data["message"]

    # Check that the user has Alice has not been deleted (can't reuse username)
    response = client.post(
        "/auth/register", json={"username": "Alice", "password": "aaaaaBBBBB1@!"}
    )

    data = response.get_json()

    assert response.status_code == 409
    assert data["status"] == "error"
    assert "This username is already in use." in data["message"]


def test_delete_user_valid(client, seeded_users, seeded_transactions):
    # Set Alice to be the only user contributing to global stats
    client.post(
        "/profile/edit",
        json={"show_stats": True, "username": "Alice"},
    )

    response = client.get("/statistics/global?days=5")
    data = response.get_json()

    # Ensure trending items are influenced solely by Alice
    assert data["trending_item_1"] == "Hamburger"
    assert data["trending_item_2"] == "Caesar Salad"

    # Now delete Alice and her data
    response = client.delete("/profile/Alice", json={"password": "Password123!"})
    data = response.get_json()

    assert response.status_code == 200
    assert "User deleted successfully" in data["message"]

    # Check that Alice's logs have been deleted (trending items lost Alice's logs)
    response = client.get("/statistics/global?days=5")
    data = response.get_json()
    assert data["trending_item_1"] == "Unknown"
    assert data["trending_item_2"] == "Unknown"

    # Check that the username Alice is now free
    response = client.post(
        "/auth/register", json={"username": "Alice", "password": "aaaaaBBBBB1@!"}
    )

    data = response.get_json()

    assert response.status_code == 201
    assert data["status"] == "success"
    assert "User registered successfully." in data["message"]
