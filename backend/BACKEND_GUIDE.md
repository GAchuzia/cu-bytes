# CU-Bytes Backend Guide

Guide for backend infrastructure and available endpoints.

## Table Of Contents

- [CU-Bytes Backend Guide](#cu-bytes-backend-guide)
  - [Table Of Contents](#table-of-contents)
    - [Configuration Tips](#configuration-tips)
    - [Architecture](#architecture)
    - [Databases](#databases)
        - [auth.db]
        - [profiles.db]
        - [food_data.db]
        - [logging.db]

### Configuration Tips
If you are having issues running the backend, it might help to delete the .db files and rerun the database initialization scripts. A commit could have been pushed that modifies the database format.

### Architecture
The Backend Architecture follows the Service-Based Architecture described in section 10.0 of our proposal.

API Layer: app.py acts as the API layer. To ensure app.py doesn't grow into one enormous file containing all endpoints, endpoints for different features have been filed under the endpoints/ directory.

Domain Services: The API layer calls the business logic from the corresponding service in the services/ directory. Separate services keep related logic together and independant from unrelated services.

Models: The models/ directory contains the entity objects and methods to interact with them. This creates a unified way for services to interact with the data.

Databases: The databases/ directory holds the SQLite databases and contains scripts that can set up these databases with dummy data.

### Databases
Databases can be created by running the corresponding init_XXXXX_db.py script in /backend/database/. When running these scripts, make sure you are in the project root directory, ie. cu-bytes, NOT backend/.

#### auth.db
This database contains usernames and passwords. Passwords are hashed with argon2id (which includes salt) for security reasons.

Steps to create:
cd cu-bytes
python -m backend.database.init_auth_db

Database schema:
sqlite> PRAGMA table_info('users_auth');
0|username|VARCHAR(80)|1||1
1|password|VARCHAR(255)|1||0

#### profiles.db
This database contains usernames along with dietary restrictions information.

Steps to create:
cd cu-bytes
python -m backend.database.init_user_settings_db

Database schema:
sqlite> PRAGMA table_info('users_profile');
0|username|VARCHAR(80)|1||1
1|has_configured_settings|BOOLEAN|0||0
2|show_stats|BOOLEAN|0||0
3|has_egg_allergy|BOOLEAN|0||0
4|has_fish_allergy|BOOLEAN|0||0
5|has_dairy_intolerance|BOOLEAN|0||0
6|has_milk_allergy|BOOLEAN|0||0
7|has_peanut_allergy|BOOLEAN|0||0
8|has_sesame_allergy|BOOLEAN|0||0
9|has_shellfish_allergy|BOOLEAN|0||0
10|has_soy_allergy|BOOLEAN|0||0
11|has_treenut_allergy|BOOLEAN|0||0
12|has_wheat_allergy|BOOLEAN|0||0
13|has_gluten_allergy|BOOLEAN|0||0
14|is_vegan|BOOLEAN|0||0
15|is_vegetarian|BOOLEAN|0||0
16|prefers_kosher|BOOLEAN|0||0
17|prefers_halal|BOOLEAN|0||0

#### food_data.db
This database contains a list of the food items available at Carleton University.
This database also contains a list of the dining locations on the Carleton University Campus.

Steps to create:
cd cu-bytes
python -m backend.database.init_food_db

Database schema for food items:
sqlite> PRAGMA table_info('food_items');
0|id|INTEGER|1||1
1|food_name|VARCHAR(80)|1||0
2|dining_location|INTEGER|1||0
3|cost|DOUBLE|0||0
4|calories|INTEGER|0||0
5|comments|VARCHAR(200)|0||0
6|last_updated|VARCHAR(20)|0||0
7|is_vegan|BOOLEAN|0||0
8|is_vegetarian|BOOLEAN|0||0
9|is_gluten_free|BOOLEAN|0||0
10|is_halal|BOOLEAN|0||0
11|is_kosher|BOOLEAN|0||0
12|is_dairy_free|BOOLEAN|0||0
13|has_eggs|BOOLEAN|0||0
14|has_fish|BOOLEAN|0||0
15|has_milk|BOOLEAN|0||0
16|has_peanuts|BOOLEAN|0||0
17|has_sesame|BOOLEAN|0||0
18|has_shellfish|BOOLEAN|0||0
19|has_soy|BOOLEAN|0||0
20|has_treenuts|BOOLEAN|0||0
21|has_wheat|BOOLEAN|0||0

Database schema for dining locations:
sqlite> PRAGMA table_info('dining_locations');
0|dining_service_id|INTEGER|1|1
1|dining_location_name|VARCHAR(80)|1||0

Database schema for generic food categories:
sqlite> PRAGMA table_info('food_categories');
0|category_name|VARCHAR(80)|1||1
1|calories|INTEGER|1||0
2|percent_fruit_veg|INTEGER|1||0
3|percent_grain|INTEGER|1||0
4|percent_dairy|INTEGER|1||0
5|percent_protein|INTEGER|1||0
6|is_vegan|BOOLEAN|0||0
7|is_gluten_free|BOOLEAN|0||0
8|is_halal|BOOLEAN|0||0
9|is_kosher|BOOLEAN|0||0
10|is_vegetarian|BOOLEAN|0||0
11|is_dairy_free|BOOLEAN|0||0
12|has_eggs|BOOLEAN|0||0
13|has_fish|BOOLEAN|0||0
14|has_milk|BOOLEAN|0||0
15|has_peanuts|BOOLEAN|0||0
16|has_sesame|BOOLEAN|0||0
17|has_shellfish|BOOLEAN|0||0
18|has_soy|BOOLEAN|0||0
19|has_treenuts|BOOLEAN|0||0
20|has_wheat|BOOLEAN|0||0

#### logging.db
This database contains a transactions that record which food item was consumed by which user.

Steps to create:
cd cu-bytes
python -m backend.database.init_logging_db

Database schema:
sqlite> PRAGMA table_info('food_logging');
0|username|VARCHAR(80)|1||1
1|transaction_time|DATETIME|1||2
2|food_name|VARCHAR(80)|1||0
3|calories|INTEGER|0||0
4|percent_fruit_veg|INTEGER|0||0
5|percent_grain|INTEGER|0||0
6|percent_dairy|INTEGER|0||0
7|percent_protein|INTEGER|0||0
