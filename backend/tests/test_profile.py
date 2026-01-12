# Project imports
from backend.tests.test_helpers import seeded_users, add_test_user

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
    assert len(data) == 18

    assert data["username"] == "Alice"
    assert data["has_configured_settings"] is False
    assert data["show_stats"] is False
    assert data["has_egg_allergy"] is False
    assert data["has_fish_allergy"] is False # Added 01/11/2026
    assert data["has_dairy_intolerance"] is False
    assert data["has_milk_allergy"] is False # Added 01/11/2026
    assert data["has_peanut_allergy"] is False
    assert data["has_sesame_allergy"] is False
    assert data["has_shellfish_allergy"] is False
    assert data["has_soy_allergy"] is False
    assert data["has_treenut_allergy"] is False
    assert data["has_wheat_allergy"] is False
    assert data["has_gluten_allergy"] is False
    assert data["is_vegan"] is False
    assert data["is_vegetarian"] is False
    assert data["prefers_kosher"] is False
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
    assert len(data) == 18

    assert data["username"] == "Alice"
    assert data["has_configured_settings"] is True
    assert data["show_stats"] is False
    assert data["has_egg_allergy"] is False
    assert data["has_fish_allergy"] is False # Added 01/11/2026
    assert data["has_dairy_intolerance"] is False
    assert data["has_milk_allergy"] is False # Added 01/11/2026
    assert data["has_peanut_allergy"] is False
    assert data["has_sesame_allergy"] is False
    assert data["has_shellfish_allergy"] is False
    assert data["has_soy_allergy"] is False
    assert data["has_treenut_allergy"] is True
    assert data["has_wheat_allergy"] is False
    assert data["has_gluten_allergy"] is False
    assert data["is_vegan"] is True
    assert data["is_vegetarian"] is False
    assert data["prefers_kosher"] is False
    assert data["prefers_halal"] is False


def test_edit_whole_user_profile(client, seeded_users):
    # Specify all available features
    response = client.post(
        "/profile/edit",
        json={
            "has_configured_settings": True,
            "has_dairy_intolerance": False,
            "has_egg_allergy": False,
            "has_fish_allergy": False, # Added 01/11/2026
            "has_gluten_allergy": True,
            "has_milk_allergy": False, # Added 01/11/2026
            "has_peanut_allergy": True,
            "has_sesame_allergy": True,
            "has_shellfish_allergy": True,
            "has_soy_allergy": True,
            "has_treenut_allergy": True,
            "has_wheat_allergy": True,
            "is_vegan": True,
            "is_vegetarian": True,
            "prefers_halal": True,
            "prefers_kosher": False,
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
    assert len(data) == 18

    assert data["username"] == "Alice"
    assert data["has_configured_settings"] is True
    assert data["show_stats"] is True
    assert data["has_egg_allergy"] is False
    assert data["has_fish_allergy"] is False # Added 01/11/2026
    assert data["has_dairy_intolerance"] is False
    assert data["has_milk_allergy"] is False # Added 01/11/2026
    assert data["has_peanut_allergy"] is True
    assert data["has_sesame_allergy"] is True
    assert data["has_shellfish_allergy"] is True
    assert data["has_soy_allergy"] is True
    assert data["has_treenut_allergy"] is True
    assert data["has_wheat_allergy"] is True
    assert data["has_gluten_allergy"] is True
    assert data["is_vegan"] is True
    assert data["is_vegetarian"] is True
    assert data["prefers_kosher"] is False
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
    assert len(data) == 18

    assert data["username"] == "Alice"
    assert data["has_configured_settings"] is False
    assert data["show_stats"] is False
    assert data["has_egg_allergy"] is False
    assert data["has_fish_allergy"] is False # Added 01/11/2026
    assert data["has_dairy_intolerance"] is False
    assert data["has_milk_allergy"] is False # Added 01/11/2026
    assert data["has_peanut_allergy"] is False
    assert data["has_sesame_allergy"] is False
    assert data["has_shellfish_allergy"] is False
    assert data["has_soy_allergy"] is False
    assert data["has_treenut_allergy"] is False
    assert data["has_wheat_allergy"] is False
    assert data["has_gluten_allergy"] is False
    assert data["is_vegan"] is False
    assert data["is_vegetarian"] is False
    assert data["prefers_kosher"] is False
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
