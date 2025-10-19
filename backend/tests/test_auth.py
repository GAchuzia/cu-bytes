# Project imports
from backend.models.users_auth import UsersAuth

# Arguments like client and app are automatically injected from conftest.py
def test_register_missing_password(client):
    response = client.post(
        "/auth/register",
        json={"username": "Dave", "password": ""}
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Username and password are required." in data["message"]

def test_register_missing_username(client):
    response = client.post(
        "/auth/register",
        json={"username": "", "password": "HelloWorld123!@#"}
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Username and password are required." in data["message"]

def test_register_username_too_long(client):
    response = client.post(
        "/auth/register",
        json={"username": "abcde12345abcde12345abcde12345abcde12345abcde12345abcde12345abcde12345abcde123450", "password": "HelloWorld123!@#"}
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Username must be between 1 and 80 characters" in data["message"]

def test_register_username_too_long(client):
    response = client.post(
        "/auth/register",
        json={"username": ":)", "password": "HelloWorld123!@#"}
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Username can only contain letters, numbers, underscores and spaces." in data["message"]


def test_register_password_too_short(client):
    response = client.post(
        "/auth/register",
        json={"username": "Dave", "password": "aB1@"}
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Password must be between 10 and 120 characters." in data["message"]

def test_register_password_missing_special_character(client):
    response = client.post(
        "/auth/register",
        json={"username": "Dave", "password": "aaaaaBBBBB1"}
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Password must contain at least one special character." in data["message"]

def test_register_password_missing_numeric_character(client):
    response = client.post(
        "/auth/register",
        json={"username": "Dave", "password": "aaaaaBBBBB@"}
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Password must contain at least one numeric character." in data["message"]

def test_register_password_missing_uppercase_character(client):
    response = client.post(
        "/auth/register",
        json={"username": "Dave", "password": "aaaaabbbbb1@"}
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Password must contain at least one uppercase character." in data["message"]

def test_register_password_missing_lowercase_character(client):
    response = client.post(
        "/auth/register",
        json={"username": "Dave", "password": "AAAAABBBBB1@"}
    )

    data = response.get_json()

    assert response.status_code == 400
    assert data["status"] == "error"
    assert "Password must contain at least one lowercase character." in data["message"]

def test_register_duplicated_username(client):
    # Add user the first time
    response = client.post(
        "/auth/register",
        json={"username": "Dave", "password": "aaaaaBBBBB1@"}
    )

    data = response.get_json()

    assert response.status_code == 201

    # Add user again
    response = client.post(
        "/auth/register",
        json={"username": "Dave", "password": "aaaaaBBBBB1@!"}
    )

    data = response.get_json()

    assert response.status_code == 409
    assert data["status"] == "error"
    assert "This username is already in use." in data["message"]

def test_register_valid_user(client, app):
    response = client.post(
        "/auth/register",
        json={"username": "Dave", "password": "aaaaaBBBBB1@"}
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
        "/auth/register",
        json={"username": "Dave", "password": "aaaaaBBBBB1@"}
    )

    data = response.get_json()
    assert response.status_code == 201

    response = client.post(
        "/auth/register",
        json={"username": "Ellen O_o", "password": "aaaaaBBBBB1@"}
    )

    data = response.get_json()
    assert response.status_code == 201

    response = client.post(
        "/auth/register",
        json={"username": "Felix123", "password": "aaaaaBBBBB1@"}
    )

    data = response.get_json()
    assert response.status_code == 201
