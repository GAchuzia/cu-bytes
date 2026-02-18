# CU-Bytes Endpoints Summary

Summary of endpoints.

## Table Of Contents

- [CU-Bytes Endpoints Summary](#cu-bytes-endpoints-summary)
  - [Table Of Contents](#table-of-contents)
    - [Authentication](#authentication)
    - [Browse](#browse)
    - [Logging](#logging)
    - [Profiles](#profiles)
    - [Dining Locations](#dining-locations)
    - [ML Prediction](#ml-prediction)
    - [Statistics](#statistics)
    - [Recommendations](#recommendations)


### Authentication

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

    """
    POST /auth/change-pw

    Request Body (JSON):
    {
        "username": "string",       # required
        "old_password": "string"    # required
        "new_password": "string"    # required
    }

    Restrictions:
    The password will only be changed if the old password is correct.
    New passwords must be between 10 and 120 characters, with at least
    one special character, one number, one uppercase and one lowercase

    Responses:
    201 Success - Password changed successfully
    400 Bad Request - Missing or invalid data
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
                    "name": "Yogurt & Berries Parfait",
                    "location": 10
                },
                {
                    "id": 652,
                    "name": "Yogurt Parfait",
                    "location": 11
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
    200 OK - Successfully retrieved the specified food item
        Response Body (JSON):
        {
            "calories": 389,
            "carbs_g": 79.8,
            "comments": "",
            "cost": 9.5,
            "dining_location": "Shawarma Palace",
            "fat_g": 3.56,
            "fiber_g": 1.96,
            "food_category": "Shawarma",
            "has_eggs": false,
            "has_fish_or_shellfish": false,
            "has_milk": false,
            "has_peanuts": false,
            "has_sesame": null,
            "has_soy": false,
            "has_treenuts": null,
            "has_wheat": true,
            "id": 100,
            "is_dairy_free": true,
            "is_gluten_free": false,
            "is_halal": null,
            "is_vegan": false,
            "is_vegetarian": false,
            "last_updated": "9/26/2025",
            "name": "Beef Shawarma Sandwich",
            "proteins_g": 9.43,
            "sugar_g": 0.287
            }

    400 Bad Request - Item not found
    500 Internal Server Error - Database retrieval failed or unexpected error occurred
    """


    """
    GET /browse/food-item-by-name

    Description:
    Retrieve a list of food items that match the provided food name
    If the food name does not match a generic category the list of food ids
    will be empty.

    Request Body:
    {
        "food_name": "Bagel"
    }

    Responses:
    200 OK - Successfully retrieved the specified food item
        {
            "food_items": [
                {
                    "dining_location": "Starbucks",
                    "id": 426,
                    "name": "Mini Everything Bagels"
                },
                {
                    "dining_location": "Tim Hortons",
                    "id": 479,
                    "name": "Plain Bagel"
                },
            ]
        }
    400 Bad Request - Missing food_name parameter
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
        [
            {
                "calories": 480,
                "carbs_g": 75.733,
                "dining_location": "Starbucks",
                "fat_g": 19.319,
                "fiber_g": 2.489,
                "food_name": "Double Chocolate Brownie",
                "proteins_g": 5.689,
                "sugar_g": 43.378,
                "transaction_time": "Sat, 07 Feb 2026 14:12:17 GMT"
            },
            {
                "calories": 320,
                "carbs_g": 27.0,
                "dining_location": "Mike's Place",
                "fat_g": 19.0,
                "fiber_g": 0.0,
                "food_name": "Popcorn Shrimp",
                "proteins_g": 11.0,
                "sugar_g": 9.09,
                "transaction_time": "Sat, 07 Feb 2026 14:12:05 GMT"
            },
            {
                "calories": -1,
                "carbs_g": -1.0,
                "dining_location": "Unknown",
                "fat_g": -1.0,
                "fiber_g": -1.0,
                "food_name": "Shrimp And Grits",
                "proteins_g": -1.0,
                "sugar_g": -1.0,
                "transaction_time": "Sat, 07 Feb 2026 14:11:46 GMT"
            }
        ]
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
            "has_fish_or_shellfish_allergy": false,
            "has_soy_allergy": false,
            "has_treenut_allergy": false,
            "has_wheat_allergy": false,
            "is_vegan": true,
            "is_vegetarian": false,
            "prefers_halal": true,
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
        "username": "string",                       # required
        "show_stats": "boolean",                    # optional
        "has_egg_allergy: "boolean",                # optional
        "has_fish_or_shellfish_allergy: "boolean",  # optional
        "has_dairy_intolerance: "boolean",          # optional
        "has_milk_allergy": "boolean",              # optional
        "has_peanut_allergy: "boolean",             # optional
        "has_sesame_allergy: "boolean",             # optional
        "has_soy_allergy: "boolean",                # optional
        "has_treenut_allergy: "boolean",            # optional
        "has_wheat_allergy: "boolean",              # optional
        "has_gluten_allergy: "boolean",             # optional
        "is_vegan: "boolean",                       # optional
        "is_vegetarian: "boolean",                  # optional
        "prefers_halal: "boolean",                  # optional
    }

    Responses:
    200 OK - Successfully recorded the transaction
    400 Bad Request - Invalid argument
    500 Internal Server Error - Error adding transaction to database
    """

    """
    DELETE /profile/{username}

    Description:
    Delete all user data associated with the username.
    The password for the user must be included for authentication.

    Request Body (JSON):
    {
        "password": "string",   # required
    }

    Responses:
    200 OK - Successfully deleted the user
    400 Bad Request - Invalid argument
    500 Internal Server Error - Error deleting the user
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

### Statistics
    """
    GET /statistics/daily/{username}

    Description:
    Retrieve day-by-day nutrition and calorie breakdown for a user
    across a configurable number of recent days.

    Query Parameters:
    - days (optional, default=7): Number of days to include

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved daily statistics
        Response Body (JSON):
        {
            {
                "2026-01-31": {
                    "calories": 320,
                    "carbs_g": 45.2,
                    "fat_g": 6.5,
                    "fiber_g": 5.4,
                    "items_logged": 1,
                    "proteins_g": 12.8,
                    "sugar_g": 22.0
                },
                "2026-02-01": {
                    "calories": 70,
                    "carbs_g": 6.64,
                    "fat_g": 0.37,
                    "fiber_g": 2.6,
                    "items_logged": 1,
                    "proteins_g": 2.82,
                    "sugar_g": 1.7
                }
            }
        }
    204 No Content - Could not create statistics because
    user has not logged any food items
    400 Bad Request - Invalid username or query parameters
    500 Internal Server Error - Statistics generation failed
    """


    """
    GET /statistics/aggregate/{username}

    Description:
    Retrieve aggregate nutrition statistics for a user over a
    configurable number of recent days.

    Query Parameters:
    - days (optional, default=7): Number of days to include

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved aggregate statistics
        Response Body (JSON):
        {
            "days_active": 3,
            "items_logged": 4,
            "percent_dairy": 11.42,
            "percent_fruit_veg": 43.21,
            "percent_grain": 29.53,
            "percent_protein": 15.85,
            "top_dining_location": "Unknown",
            "top_food": "Chicken Salad",
            "total_calories": 1060,
            "total_carbs_g": 112.54,
            "total_fat_g": 25.37,
            "total_fiber_g": 20.9,
            "total_protein_g": 57.62,
            "total_sugar_g": 35.0
        }
    204 No Content - Could not create statistics because
    user has not logged any food items
    400 Bad Request - Invalid username or query parameters
    500 Internal Server Error - Statistics generation failed
    """


    """
    GET /statistics/global

    Description:
    Retrieve global user statistics over a configurable number of recent days.
    Only users who have consented to share their data will be included.

    Query Parameters:
    - days (optional, default=7): Number of days to include

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved global statistics
        Response Body (JSON):
        {
            "trending_item_1": "Pizza",
            "trending_item_2": "Donut",
            "trending_item_3": "Lasagna",
            "trending_item_4": "Pad Thai",
            "trending_item_5": "French Fries",
            "trending_location_1": "Bridgehead",
            "trending_location_2": "Subway",
            "trending_location_3": "Tim Hortons",
        }
    400 Bad Request - Invalid query parameters
    500 Internal Server Error - Statistics generation failed
    """


    """
    GET /statistics/comparative/{username}

    Description:
    Retrieve user percentiles for various statistics over a
    configurable number of recent days.
    Food group and macronutrient percentiles are calculated on being
    closest to the recommended amounts.
    The user must have allowed for statistics sharing.
    Only users who have consented to share their data will be compared against.

    Query Parameters:
    - days (optional, default=7): Number of days to include

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved comparative statistics
        Response Body (JSON):
        {
            "balanced_food_groups_percentile": 100,
            "balanced_macronutrients_percentile": 100,
            "carbs_percentile": 100,
            "checkin_percentile": 100,
            "dairy_percentile": 100,
            "fat_percentile": 100,
            "fiber_percentile": 100,
            "food_logging_percentile": 100,
            "fruits_veg_percentile": 100,
            "grain_percentile": 100,
            "protein_fg_percentile": 100,
            "sugar_percentile": 0
        }
    204 No Content - Could not create statistics because
    user has not logged any food items
    400 Bad Request - Invalid username or query parameters
    403 Forbidden - User has not configured their settings for statistics sharing
    500 Internal Server Error - Statistics generation failed
    """

### Recommendations
    """
    GET /recommend/trending/{username}

    Description:
    Retrieves the top X (default=3) food items from the database that
    are trending in the last 7 days among other users who have enabled
    statistics sharing.

    If there are not enough trending items, the number of items will
    be as close as possible to the desired amount. Items will be
    listed with the most popular item first with no tiebreaking
    mechanism.

    Query Parameters:
    - items (optional, default=3): Number of fooditems to return

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved recommended food items
        Response Body (JSON):
        {
            "food_items": [
                {
                "dining_location": "Bridgehead",
                "id": 658,
                "name": "Yogurt Parfait"
                },
                {
                "dining_location": "Bento Boxes",
                "id": 259,
                "name": "Donburi Inari Tofu"
                },
                {
                "dining_location": "Leo's Lounge",
                "id": 451,
                "name": "Oatmeal"
                }
            ]
        }
    204 No Content - Could not create statistics because there are no valid
    entries made by other users who have statistics enabled
    400 Bad Request - Invalid username or query parameters
    500 Internal Server Error - Database retrieval failed or unexpected error occurred
    """

    """
    GET /recommend/random/{username}

    Description:
    Retrieves random (default=3) food items from the database that
    the user has not yet tried.

    In the unlikely case that there are not enough untried items
    the endpoint will recommend items that the user has already consumed
    to make up the difference.

    Query Parameters:
    - items (optional, default=3): Number of fooditems to return

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved recommended food items
        Response Body (JSON):
        {
            "food_items": [
                {
                "dining_location": "Starbucks",
                "id": 241,
                "name": "Cookies & Cream Cake Pop"
                },
                {
                "dining_location": "Bento Boxes",
                "id": 594,
                "name": "Tempura Shrimp Poke Bowl"
                },
                {
                "dining_location": "Bridgehead",
                "id": 77,
                "name": "Bacon, Egg & Cheese Bagel"
                }
            ]
        }
    400 Bad Request - Invalid username or query parameters
    500 Internal Server Error - Database retrieval failed or unexpected error occurred
    """

    """
    GET /recommend/ideal/{username}

    Description:
    Retrieves (default=3) food items from the database that bring the user
    closest to the ideal dietary proportions. IDEAL_TARGETS are based on
    the USDA/AMDR 2000-cal adult.

    Query Parameters:
    - items (optional, default=3): Number of fooditems to return

    Note: If there are not enough items that pass nutrient-filtering
    to reach the item count, the number of returned items may not match
    the requested query amount

    Request Body:
    None

    Responses:
    200 OK - Successfully retrieved recommended food items
        Response Body (JSON):
        {
            "food_items": [
                {
                "dining_location": "Starbucks",
                "id": 241,
                "name": "Cookies & Cream Cake Pop"
                },
                {
                "dining_location": "Bento Boxes",
                "id": 594,
                "name": "Tempura Shrimp Poke Bowl"
                },
                {
                "dining_location": "Bridgehead",
                "id": 77,
                "name": "Bacon, Egg & Cheese Bagel"
                }
            ]
        }
    400 Bad Request - Invalid username or query parameters
    500 Internal Server Error - Database retrieval failed or unexpected error occurred
    """
