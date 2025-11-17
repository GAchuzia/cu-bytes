# CU-Bytes Backend Guide

Guide for backend infrastructure and available endpoints.

## Table Of Contents

- [CU-Bytes Backend Guide](#cu-bytes-backend-guide)
  - [Table Of Contents](#table-of-contents)
    - [Architecture](#architecture)
    - [Databases](#databases)
        - [auth.db]
        - [profiles.db]
        - [food_data.db]

### Architecture
The Backend Architecture follows the Service-Based Architecture described in section 10.0 of our proposal.

API Layer: app.py acts as the API layer. To ensure app.py doesn't grow into one enormous file containing all endpoints, endpoints for different features have been filed under the endpoints/ directory.

Domain Services: The API layer calls the business logic from the corresponding service in the services/ directory. Separate services keep related logic together and independant from unrelated services.

Models: The models/ directory contains the entity objects and methods to interact with them. This creates a unified way for services to interact with the data.

Databases: The databases/ directory holds the SQLite databases and contains scripts that can set up these databases with dummy data.

### Databases
Databases can be created by running the corresponding init_XXXXX_db.py script in /backend/database/. When running these scripts, make sure you are in the project root directory, ie. cu-bytes, NOT backend/.

#### auth.db
This database contains usernames and passwords. Passwords are hashed with salts for security reasons.

Steps to create:
cd cu-bytes
python -m backend.database.init_auth_db

Database schema:
sqlite> PRAGMA table_info('users_auth');
0|username|VARCHAR(80)|1||1
1|password|VARCHAR(64)|1||0
2|salt|VARCHAR(32)|1||0

#### profiles.db
This database contains usernames along with dietary restrictions information.

Steps to create:
cd cu-bytes
python -m backend.database.init_user_settings_db

Database schema:
sqlite> PRAGMA table_info('users_profile');
0|username|VARCHAR(80)|1||1
1|show_stats|BOOLEAN|0||0
2|has_egg_allergy|BOOLEAN|0||0
3|has_fish_allergy|BOOLEAN|0||0
4|has_dairy_intolerance|BOOLEAN|0||0
5|has_peanut_allergy|BOOLEAN|0||0
6|has_sesame_allergy|BOOLEAN|0||0
7|has_shellfish_allergy|BOOLEAN|0||0
8|has_soy_allergy|BOOLEAN|0||0
9|has_treenut_allergy|BOOLEAN|0||0
10|has_wheat_allergy|BOOLEAN|0||0
11|has_gluten_allergy|BOOLEAN|0||0
12|is_vegan|BOOLEAN|0||0
13|is_vegetarian|BOOLEAN|0||0
14|prefers_kosher|BOOLEAN|0||0
15|prefers_halal|BOOLEAN|0||0

#### food_data.db
This database contains a list of the food items available at Carleton University.

Steps to create:
cd cu-bytes
python -m backend.database.init_food_db

Database schema:
sqlite> PRAGMA table_info('food_items');
0|id|INTEGER|1||1
1|food_name|VARCHAR(80)|1||0
2|dining_location|VARCHAR(80)|1||0
3|cost|DOUBLE|0||0
4|calories|INTEGER|0||0
5|comments|VARCHAR(200)|0||0
6|last_updated|VARCHAR(20)|0||0
7|is_vegan|BOOLEAN|0||0
8|is_gluten_free|BOOLEAN|0||0
9|is_halal|BOOLEAN|0||0
10|is_kosher|BOOLEAN|0||0
11|is_dairy_free|BOOLEAN|0||0
12|has_eggs|BOOLEAN|0||0
13|has_fish|BOOLEAN|0||0
14|has_milk|BOOLEAN|0||0
15|has_peanuts|BOOLEAN|0||0
16|has_sesame|BOOLEAN|0||0
17|has_soy|BOOLEAN|0||0
18|has_treenuts|BOOLEAN|0||0
19|has_wheat|BOOLEAN|0||0

#### logging.db
This database contains a transactions that record which food item was consumed by which user.

Steps to create:
cd cu-bytes
python -m backend.database.init_logging_db

Database schema:
sqlite> PRAGMA table_info('food_logging');
0|username|VARCHAR(80)|1||1
1|transaction_time|DATETIME|1||2
2|food_id|INTEGER|1||0
3|calories|INTEGER|0||0
