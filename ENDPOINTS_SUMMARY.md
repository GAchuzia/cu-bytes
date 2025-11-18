# CU-Bytes Endpoints Summary

Summary of endpoints.

## Table Of Contents

- [CU-Bytes Endpoints Summary](#cu-bytes-endpoints-summary)
  - [Table Of Contents](#table-of-contents)
    - [Login](#login)
    - [Register](#register)
    - [Browse](#browse)
    - [Logging] (#logging)
    - [Profiles] (#profiles)


### Login

    """
    POST /auth/login

    Request Body (JSON):
    {
        "username": "string",   # required
        "password": "string"    # required
    }

    Responses:
    200 OK - User logged in successfully
    400 Bad Request - Wrong username or password
    """

### Register

    """
    POST /auth/register

    Request Body (JSON):
    {
        "username": "string",   # required
        "password": "string"    # required
    }

    Restrictions:
    Usernames must be between 1 and 80 characters, unique, and can
    only contain letters, numbers and underscores
    Passwords must be between 10 and 120 characters, with at least
    one special character, one number, one uppercase and one lowercase

    Responses:
    201 Creation Success - User registered successfully
    400 Bad Request - Missing or invalid data
    409 Conflict - Username already exists
    """

### Browse

    """
    GET /browse/food-items

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
    GET /browse/food-item/{id}

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

    400 Bad Request - Item not found
    500 Internal Server Error - Database retrieval failed or unexpected error occurred
    """

### Logging
    """
    POST /logging/log

    Description:
    Records the intake of a food item by a user.

    Request Body (JSON):
    {
        "username": "string",       # required
        "food_id": 123,             # required, int
        "calories": 450             # required, int
    }

    Responses:
    200 OK - Successfully recorded the transaction
    400 Bad Request - Invalid argument
    500 Internal Server Error - Error adding transaction to database
    """

### Profiles
    """
    GET /profile/retreive/{username}

    Description:
    Retreive the profile of a particular user.

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved the specified user profile
        Response Body (JSON):
        {
            "has_configured_settings": true,
            "has_dairy_intolerance": false,
            "has_egg_allergy": false,
            "has_gluten_allergy": false,
            "has_peanut_allergy": false,
            "has_sesame_allergy": false,
            "has_shellfish_allergy": false,
            "has_soy_allergy": false,
            "has_treenut_allergy": false,
            "has_wheat_allergy": false,
            "is_vegan": true,
            "is_vegetarian": false,
            "prefers_halal": true,
            "prefers_kosher": false,
            "show_stats": true,
            "username": "Alice"
        }
    400 Bad Request - Invalid username
    """

    """
    GET /profile/configured/{username}

    Description:
    Retreive whether or not the user has configured their profile.

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved the specified user profile
        Response Body (JSON):
        {
            "has_configured_settings": true,
        }
    400 Bad Request - Invalid username
    """

    """
    POST /profile/edit

    Description:
    Edit the profile for a particular user.
    You only need to pass arguments that need changing.
    Sending an edit request with no optional arguments will
    still count as the user having configured their profile.

    Request Body (JSON):
    {
        "username": "string",               # required
        "show_stats": "boolean",            # optional
        "has_egg_allergy: "boolean",        # optional
        "has_dairy_intolerance: "boolean",  # optional
        "has_peanut_allergy: "boolean",     # optional
        "has_sesame_allergy: "boolean",     # optional
        "has_shellfish_allergy: "boolean",  # optional
        "has_soy_allergy: "boolean",        # optional
        "has_treenut_allergy: "boolean",    # optional
        "has_wheat_allergy: "boolean",      # optional
        "has_gluten_allergy: "boolean",     # optional
        "is_vegan: "boolean",               # optional
        "is_vegetarian: "boolean",          # optional
        "prefers_kosher: "boolean",         # optional
        "prefers_halal: "boolean",          # optional
    }

    Responses:
    200 OK - Successfully recorded the transaction
    400 Bad Request - Invalid argument
    500 Internal Server Error - Error adding transaction to database
    """
