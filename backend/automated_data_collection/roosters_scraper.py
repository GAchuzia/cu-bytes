import requests
import csv
import os
import json
from datetime import datetime

"""
If the URL does not work:
1. Visit https://order2.silverwarepos.com/app/roosters#!/menu#%2Fmenu
2. Open developer tools (F12)
3. Go to the Network tab (wifi symbol)
4. Reload the page
5. The new URL is the call that ends in =getMenu
"""

# URL to access Roosters' menu
url = (
    "https://cdn.silverwarepos.com/api/JSON/order2/menu/"
    "FD59F9C32F5432F282FEFA745F52B3D194B8185A.json?callback=getMenu"
)

# Fetch response
response = requests.get(url)
raw_text = response.text.strip()

# Retreive JSON
start = raw_text.find("{")
end = raw_text.rfind("}") + 1

if start == -1 or end == -1:
    raise ValueError("Could not find valid JSON object in response")

json_str = raw_text[start:end]
data = json.loads(json_str)

# Get the timestamp in the form MM/DD/YYYY
last_updated = data.get("DateUpdated", "")

if last_updated:
    try:
        parsed_date = datetime.fromisoformat(last_updated.replace("Z", ""))
        last_updated = parsed_date.strftime("%m/%d/%Y")
    except ValueError:
        print("Date parsing failed.")
        pass

# Select target lists from the data
minor_classes = data.get("MinorClasses", [])
items = data.get("Items", [])

# Only extract food items
target_minor_ids = set()
for mc in minor_classes:
    if mc.get("Name") in ("Breakfast", "Pitas"):
        target_minor_ids.add(mc.get("ID"))

# Construct the full path for the CSV
script_dir = os.path.dirname(os.path.abspath(__file__))
csv_file = os.path.join(script_dir, "roostersFoodInfo.csv")

# Headers for the CSV
headers = [
    "Food Item",
    "Dining Location",
    "Cost",
    "Calories",
    "Nuts",
    "Vegan",
    "Gluten Free",
    "Halal",
    "Vegetarian",
    "No Dairy",
    "Comments",
    "Eggs",
    "Fish",
    "Milk",
    "Peanuts",
    "Sesame",
    "Shellfish",
    "Soy",
    "TreeNuts",
    "Wheat",
    "Kosher",
    "Last Updated",
    "Food Category",
]

# Open CSV for writing
with open(csv_file, mode="w", newline="", encoding="utf-8") as file:
    writer = csv.DictWriter(file, fieldnames=headers)
    writer.writeheader()

    for item in items:
        # Only process relevant menus
        if item.get("MinorClassID") not in target_minor_ids:
            continue

        description = item.get("Description", "")

        # Extract the price
        prices = item.get("Prices", [])
        amount = ""
        if prices:
            first_price = prices[0]
            amount = first_price.get("Amount", "")

        # Extract the description
        recipes = item.get("Recipes", [])
        text = ""
        if recipes:
            first_recipe = recipes[0]
            text = first_recipe.get("Text", "")

        # Prepare CSV row
        row = {
            "Food Item": description,
            "Dining Location": "Rooster's",
            "Cost": amount,
            "Calories": "",
            "Nuts": "",
            "Vegan": "",
            "Gluten Free": "",
            "Halal": "",
            "Vegetarian": "",
            "No Dairy": "",
            "Comments": text,
            "Eggs": "",
            "Fish": "",
            "Milk": "",
            "Peanuts": "",
            "Sesame": "",
            "Shellfish": "",
            "Soy": "",
            "TreeNuts": "",
            "Wheat": "",
            "Kosher": "",
            "Last Updated": last_updated,
            "Food Category": "",
        }

        writer.writerow(row)

print(
    f"Data exported successfully to {csv_file}. "
    "Please fill in the food category column yourself."
)
