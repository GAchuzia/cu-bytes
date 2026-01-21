# CU-Bytes Endpoints Summary

Summary of endpoints.

## Table Of Contents

- [CU-Bytes Endpoints Summary](#cu-bytes-endpoints-summary)
  - [Table Of Contents](#table-of-contents)
    - [Login](#login)
    - [Register](#register)
    - [Browse](#browse)
    - [Logging](#logging)
    - [Profiles](#profiles)
    - [Dining Locations](#dining-locations)
    - [ML Prediction](#ml-prediction)


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
            "food_category": "Parfait",
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
The following endpoint should be used when the food_id is known (manual entry):
    """
    POST /logging/log-by-id

    Description:
    Records the intake of a food item by a user.
    Nutrition data will be derived based on the food_id.

    Request Body (JSON):
    {
        "username": "string",       # required
        "food_id": 123,             # required, int
    }

    Responses:
    200 OK - Successfully recorded the transaction
    400 Bad Request - Invalid argument
    500 Internal Server Error - Error adding transaction to database
    """


The following endpoint should be used when food_name is determined through machine learning:
    """
    POST /logging/log-by-name

    Description:
    Records the intake of a food item by a user.
    Nutrition data will be derived based on the name.
    The name must match a generic food category.

    Request Body (JSON):
    {
        "username": "string",       # required
        "food_name": "string",      # required
    }

    Responses:
    200 OK - Successfully recorded the transaction
    400 Bad Request - Invalid argument
    500 Internal Server Error - Error adding transaction to database
    """


    """
    GET /logging/history/{username}

    Description:
    Gets the items logged by the user.
    Items will be returned with the most recently logged items at the start.

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved food history
        Response Body (JSON):
        {
            [
                {
                    "calories": 150,
                    "food_name": "Jello",
                    "transaction_time": "Thu, 08 Jan 2026 19:38:17 GMT"
                },
                {
                    "calories": 180,
                    "food_name": "Buffalo Chicken Pizza",
                    "transaction_time": "Thu, 08 Jan 2026 19:36:53 GMT"
                }
            ]
        }
    400 Bad Request - Invalid username
    500 Internal Server Error - Error retreiving food history
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

### Dining Locations
    """
    GET /locations/dining-locations

    Description:
    Retrieves all available dining locations from the database.

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved all dining locations
        Response Body (JSON):
        {
            [
                {
                    "id": 1,
                    "name": "Tim Hortons"
                },
                {
                    "id": 2,
                    "name": "Subway"
                }
                ...
            ]
        }

    500 Internal Server Error - Database retrieval failed or unexpected error occurred
    """

    """
    GET /locations/dining-locations/{id}

    Description:
    Retrieves all available food items from the dining location with id {id}

    Request Body:
    None

    Response:
    200 OK - Successfully retrieved all food items at the specified dining location
        Response Body (JSON):
        {
            [
                {
                    "id": 1,
                    "name": "12 Grain Bagel"
                },
                {
                    "id": 52,
                    "name": "Apple Fritter Donut"
                }
                ...
            ]
        }

    500 Internal Server Error - Database retrieval failed or unexpected error occurred
    """

### ML Prediction
    """
    POST /ml/predict

    Description:
    Upload an image and get food prediction with calories

    Request:
    - Content-Type: multipart/form-data
    - Body: image file (form field name: 'image')

    Responses:
    200 OK - Successfully predicted food
        Response Body (JSON):
        {
            "food_name": string,
            "confidence": float,
            "calories": int
            "fat_g": float,
            "carbs_g": float,
            "proteins_g": float,
            "fiber_g": float,
            "sugar_g": float,
            "is_vegan": bool,
            "is_gluten_free": bool,
            "is_halal": bool,
            "is_vegetarian": bool,
            "is_dairy_free": bool,
            "has_eggs": bool,
            "has_fish_or_shellfish": bool,
            "has_milk": bool,
            "has_peanuts": bool,
            "has_sesame": bool,
            "has_soy": bool,
            "has_treenuts": bool,
            "has_wheat": bool,
        }

    400 Bad Request - No file provided or invalid file
    500 Internal Server Error - Prediction failed
    """
