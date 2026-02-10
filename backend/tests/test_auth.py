# Project imports
from backend.models.users_auth import UsersAuth
from backend.tests.test_helpers import add_test_user, seeded_users

# Arguments like client and app are automatically injected from conftest.py


# ------------------------------------
# Testing Register
# ------------------------------------
def test_register_missing_password(client):
    response = client.post("/auth/register", json={"username": "Dave", "password": ""})

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Username and password are required." in data["message"]


def test_register_missing_username(client):
    response = client.post(
        "/auth/register", json={"username": "", "password": "HelloWorld123!@#"}
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Username and password are required." in data["message"]


def test_register_username_too_long(client):
    response = client.post(
        "/auth/register",
        json={
            "username": "abcde12345abcde12345abcde12345abcde12345abcde12345 \
              abcde12345abcde12345abcde123450",
            "password": "HelloWorld123!@#",
        },
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Username must be between 1 and 80 characters" in data["message"]


def test_register_username_invalid(client):
    response = client.post(
        "/auth/register", json={"username": ":)", "password": "HelloWorld123!@#"}
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert (
        "Username can only contain letters, numbers and underscores." in data["message"]
    )


def test_register_password_too_short(client):
    response = client.post(
        "/auth/register", json={"username": "Dave", "password": "aB1@"}
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Password must be between 10 and 120 characters." in data["message"]


def test_register_password_missing_special_character(client):
    response = client.post(
        "/auth/register", json={"username": "Dave", "password": "aaaaaBBBBB1"}
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Password must contain at least one special character." in data["message"]


def test_register_password_missing_numeric_character(client):
    response = client.post(
        "/auth/register", json={"username": "Dave", "password": "aaaaaBBBBB@"}
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Password must contain at least one numeric character." in data["message"]


def test_register_password_missing_uppercase_character(client):
    response = client.post(
        "/auth/register", json={"username": "Dave", "password": "aaaaabbbbb1@"}
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Password must contain at least one uppercase character." in data["message"]


def test_register_password_missing_lowercase_character(client):
    response = client.post(
        "/auth/register", json={"username": "Dave", "password": "AAAAABBBBB1@"}
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Password must contain at least one lowercase character." in data["message"]


def test_register_duplicated_username(client):
    # Add user the first time
    response = client.post(
        "/auth/register", json={"username": "Dave", "password": "aaaaaBBBBB1@"}
    )

    data = response.get_json()

    assert response.status_code == 201

    # Add user again
    response = client.post(
        "/auth/register", json={"username": "Dave", "password": "aaaaaBBBBB1@!"}
    )

    data = response.get_json()

    assert response.status_code == 409
    assert data["status"] == "error"
    assert "This username is already in use." in data["message"]


def test_register_valid_user(client, app):
    response = client.post(
        "/auth/register", json={"username": "Dave", "password": "aaaaaBBBBB1@"}
    )

    data = response.get_json()

    assert response.status_code == 201
    assert data["status"] == "success"
    assert "User registered successfully." in data["message"]

    # Ensure the user object has been created in the database
    with app.app_context():
        user = UsersAuth.get_user_by_name("Dave")
        assert user is not None
        assert user.username == "Dave"


def test_register_many_valid_users(client):
    response = client.post(
        "/auth/register", json={"username": "Dave", "password": "aaaaaBBBBB1@"}
    )
    assert response.status_code == 201

    response = client.post(
        "/auth/register", json={"username": "Ellen_O_o", "password": "aaaaaBBBBB1@"}
    )
    assert response.status_code == 201

    response = client.post(
        "/auth/register", json={"username": "Felix123", "password": "aaaaaBBBBB1@"}
    )
    assert response.status_code == 201


# ------------------------------------
# Testing Login
# ------------------------------------


def test_login_missing_username(client, app):
    add_test_user(app, username="Ellen", password="Password123!")

    response = client.post(
        "/auth/login", json={"username": "", "password": "Password123!"}
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Invalid password or username." in data["message"]


def test_login_missing_password(client, app):
    add_test_user(app, username="Ellen", password="Password123!")

    response = client.post("/auth/login", json={"username": "Ellen", "password": ""})

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Invalid password or username." in data["message"]


def test_login_dangerous_username(client, app):
    add_test_user(app, username="Ellen", password="Password123!")

    response = client.post(
        "/auth/login",
        json={"username": "'; DROP TABLE auth; --", "password": "Hacker@123"},
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Invalid password or username." in data["message"]


def test_login_case_insensitive_username(client, app):
    add_test_user(app, username="Ellen", password="Password123!")

    response = client.post(
        "/auth/login", json={"username": "ellen", "password": "Password123!"}
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Invalid password or username." in data["message"]


def test_login_case_insensitive_password(client, app):
    add_test_user(app, username="Ellen", password="Password123!")

    response = client.post(
        "/auth/login", json={"username": "Ellen", "password": "password123!"}
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Invalid password or username." in data["message"]


def test_login_success(client, app):
    add_test_user(app, username="Ellen", password="Password123!")

    response = client.post(
        "/auth/login", json={"username": "Ellen", "password": "Password123!"}
    )

    data = response.get_json()

    assert response.status_code == 200
    assert data["status"] == "success"
    assert "User logged in successfully." in data["message"]

    # Try again
    response = client.post(
        "/auth/login", json={"username": "Ellen", "password": "Password123!"}
    )

    data = response.get_json()

    assert response.status_code == 200
    assert data["status"] == "success"
    assert "User logged in successfully." in data["message"]


# ------------------------------------
# Testing Changing Password
# ------------------------------------
def test_change_pw_missing_fields(client, seeded_users):
    # Test missing username
    response = client.post(
        "/auth/change-pw",
        json={
            "username": "",
            "old_password": "1234",
            "new_password": "Password123!",
        },
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Username, old password and new password required." in data["message"]

    # Test missing old password
    response = client.post(
        "/auth/change-pw",
        json={
            "username": "Alice",
            "new_password": "Password123!",
        },
    )
    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Username, old password and new password required." in data["message"]

    # Test missing new password
    response = client.post(
        "/auth/change-pw",
        json={
            "username": "Alice",
            "old_password": "Password123!",
        },
    )
    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Username, old password and new password required." in data["message"]


def test_change_pw_username_invalid(client, seeded_users):
    response = client.post(
        "/auth/change-pw",
        json={
            "username": "helloworld",
            "old_password": "Password123!",
            "new_password": "HelloWorld123!@#&",
        },
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "user does not exist" in data["message"]


def test_change_pw_wrong_password(client, seeded_users):
    response = client.post(
        "/auth/change-pw",
        json={
            "username": "Alice",
            "old_password": "Password1234!",
            "new_password": "HelloWorld123!@#&",
        },
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "password does not match" in data["message"]


def test_change_pw_invalid_new_password(client, seeded_users):
    # Try password too short
    response = client.post(
        "/auth/change-pw",
        json={
            "username": "Alice",
            "old_password": "Password123!",
            "new_password": "Bp1!",
        },
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Password must be between 10 and 120 characters." in data["message"]

    # Try password missing special character
    response = client.post(
        "/auth/change-pw",
        json={
            "username": "Alice",
            "old_password": "Password123!",
            "new_password": "BestPassword789",
        },
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Password must contain at least one special character." in data["message"]

    # Try password missing numberic character
    response = client.post(
        "/auth/change-pw",
        json={
            "username": "Alice",
            "old_password": "Password123!",
            "new_password": "BestPassword?!#",
        },
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Password must contain at least one numeric character." in data["message"]

    # Try password missing uppercase
    response = client.post(
        "/auth/change-pw",
        json={
            "username": "Alice",
            "old_password": "Password123!",
            "new_password": "bestpassword789?!#",
        },
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Password must contain at least one uppercase character." in data["message"]

    # Try password missing lowercase
    response = client.post(
        "/auth/change-pw",
        json={
            "username": "Alice",
            "old_password": "Password123!",
            "new_password": "BESTPASSWORD789?!#",
        },
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Password must contain at least one lowercase character." in data["message"]


def test_change_pw_valid(client, seeded_users):
    # Sucessfully change the password
    response = client.post(
        "/auth/change-pw",
        json={
            "username": "Alice",
            "old_password": "Password123!",
            "new_password": "HelloWorld123!@#&",
        },
    )

    data = response.get_json()

    assert response.status_code == 201
    assert "password changed successfully" in data["message"]

    # Try logging in with the old password
    response = client.post(
        "/auth/login",
        json={"username": "Alice", "password": "Password123!"},
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Invalid password or username." in data["message"]

    # Try logging in with the new password
    response = client.post(
        "/auth/login",
        json={"username": "Alice", "password": "HelloWorld123!@#&"},
    )

    data = response.get_json()

    assert response.status_code == 200
    assert data["status"] == "success"
    assert "User logged in successfully." in data["message"]
