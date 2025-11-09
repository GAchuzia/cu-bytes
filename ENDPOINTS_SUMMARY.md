# CU-Bytes Endpoints Summary

Summary of endpoints.

## Table Of Contents

- [CU-Bytes Endpoints Summary](#cu-bytes-endpoints-summary)
  - [Table Of Contents](#table-of-contents)
    - [Login](#login)
    - [Register](#register)
    - [Browse](#browse)


### Login

    """
    POST /login

    Request Body (JSON):
    {
        "username": "string",   # required
        "password": "string"    # required
    }

    Responses:
    201 Success - User logged in successfully
    400 Bad Request - Wrong username or password
    """

### Register

    """
    POST /register

    Request Body (JSON):
    {
        "username": "string",   # required
        "password": "string"    # required
    }

    Restrictions:
    Usernames must be between 1 and 80 characters, unique, and can
    only contain letters, numbers, underscores and spaces
    Passwords must be between 10 and 120 characters, with at least
    one special character, one number, one uppercase and one lowercase

    Responses:
    201 Success - User registered successfully
    400 Bad Request - Missing or invalid data
    409 Conflict - Username already exists
    """

### Browse

    """
    GET /food-items

    Description:
    Retrieves all available food items from the database.

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved all food items
        Response Body (JSON):
        {
            "food_items": [
                {
                    "id": 651,
                    "name": "Yogurt & Berries Parfait"
                },
                {
                    "id": 652,
                    "name": "Yogurt Parfait"
                }
                ...
            ]
        }

    500 Internal Server Error - Database retrieval failed or unexpected error occurred
    """

    """
    GET /food-item/{id}

    Description:
    Retrieve information about the food item with id {id}

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved all food items
        Response Body (JSON):
        {
            "calories": 310,
            "comments": "",
            "cost": 5.7,
            "dining_location": "Tunnel Junction",
            "has_eggs": null,
            "has_fish": null,
            "has_milk": null,
            "has_peanuts": null,
            "has_sesame": null,
            "has_soy": null,
            "has_treenuts": null,
            "has_wheat": null,
            "id": 651,
            "is_dairy_free": null,
            "is_gluten_free": false,
            "is_halal": null,
            "is_kosher": null,
            "is_vegan": false,
            "last_updated": "9/26/2025",
            "name": "Yogurt & Berries Parfait"
        }

    404 Bad Request - Item not found
    500 Internal Server Error - Database retrieval failed or unexpected error occurred
    """
