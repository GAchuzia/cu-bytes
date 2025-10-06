import requests
import csv
import os

# Date from which to fetch the weekly menu (MM/DD/YYYY)
date = "10/06/2025"

# URL to access the Caf's menu for the week of "date"
url = "https://carleton.campusdish.com/api/menu/GetMenus?locationId=24967&storeIds=&mode=Weekly&date=" + date + "&time=&periodId=2084&fulfillmentMethod="

# Fetch JSON data
response = requests.get(url)
data = response.json()

# Construct the full path for the CSV
script_dir = os.path.dirname(os.path.abspath(__file__))
csv_file = os.path.join(script_dir, "cafFoodInfo.csv")

# Headers for the CSV
headers = [
    "Food Item", "Dining Location", "Cost", "Calories", "Nuts", "Vegan",
    "Gluten Free", "Halal", "Vegetarian", "No Dairy", "Comments",
    "Eggs", "Fish", "Milk", "Peanuts", "Sesame", "Shellfish", "Soy",
    "TreeNuts", "Wheat", "Kosher", "Last Updated"
]

# Helper to function convert boolean to 'T' / 'F'
def bool_to_tf(value):
    if value is True:
        return "T"
    elif value is False:
        return "F"
    return ""

# Keep track of marketing names to avoid duplicates
added_names = set()

# Open CSV for writing
with open(csv_file, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.DictWriter(file, fieldnames=headers)
    writer.writeheader()

    # Iterate over products in MenuProducts
    for menu_product in data.get("Menu", {}).get("MenuProducts", []):
        product = menu_product.get("Product", {})
        marketing_name = product.get("MarketingName", "")

        # Skip duplicates
        if marketing_name in added_names:
            continue
        added_names.add(marketing_name)

        # Extract dietary info
        filters = product.get("AvailableFilters", {})

        # Extract calories from NutritionalTree
        calories = ""
        for nutrient in product.get("NutritionalTree", []):
            if nutrient.get("Name") == "Calories":
                calories = nutrient.get("Value", "")
                break

        # Prepare CSV row
        row = {
            "Food Item": marketing_name,
            "Dining Location": "Teraanga Commons Dining Hall",
            "Cost": "",
            "Calories": calories,
            "Nuts": "",
            "Vegan": bool_to_tf(filters.get("IsVegan")),
            "Gluten Free": bool_to_tf(filters.get("IsGlutenFree")),
            "Halal": bool_to_tf(filters.get("IsHalal")),
            "Vegetarian": bool_to_tf(filters.get("IsVegetarian")),
            "No Dairy": "",
            "Comments": product.get("ShortDescription", ""),
            "Eggs": bool_to_tf(filters.get("Eggs")),
            "Fish": bool_to_tf(filters.get("Fish")),
            "Milk": bool_to_tf(filters.get("Milk")),
            "Peanuts": bool_to_tf(filters.get("Peanuts")),
            "Sesame": bool_to_tf(filters.get("Sesame")),
            "Shellfish": bool_to_tf(filters.get("Shellfish")),
            "Soy": bool_to_tf(filters.get("Soy")),
            "TreeNuts": bool_to_tf(filters.get("TreeNuts")),
            "Wheat": bool_to_tf(filters.get("Wheat")),
            "Kosher": bool_to_tf(filters.get("IsKosher")),
            "Last Updated": date,
        }

        writer.writerow(row)

print(f"Data exported successfully to {csv_file}.")
