# Library imports
import csv
import pandas as pd
import numpy as np

# Project imports
from backend.app import create_app
from backend.extensions import db
from backend.models.food_item import FoodItem

"""
CSV files are expected to contain the following columns
Food Item | Dining Location | Cost | Calories | Nuts | Vegan
Gluten Free | Halal | Vegetarian | No Dairy |Comments | Eggs
Fish | Milk | Peanuts | Sesame | Soy | TreeNuts | Wheat | Kosher
Last Updated
"""


app = create_app()


def create_single_csv():
    """
    Creates a single CSV files from various FoodInfo csvs
    Duplicate entries are combined to provide maximum information
    """
    # Paths to CSV files
    f1 = "backend/automated_data_collection/cafFoodInfo.csv"
    f2 = "backend/automated_data_collection/roostersFoodInfo.csv"
    f3 = "backend/automated_data_collection/manualFoodInfo.csv"

    # List of files to include
    csv_files = [f1, f2, f3]

    # Read and concatenate all CSVs
    all_dataframes = [pd.read_csv(f) for f in csv_files]
    df = pd.concat(all_dataframes, ignore_index=True)

    # Replace empty strings with NaN for easier aggregation
    df.replace("", np.nan, inplace=True)

    # Join Duplicate entries
    # Define primary key columns
    key_cols = ["Food Item", "Dining Location"]

    # Apply the merge
    consolidated_df = df.groupby(key_cols, as_index=False).agg(combine_non_empty)

    # Save to CSV
    consolidated_df.to_csv(
        "backend/automated_data_collection/FoodInfo.csv", index=False
    )
    print(
        "InitFoodDb: Created consolidated csv containing all food items called "
        "FoodInfo.csv in backend/automated_data_collection"
    )


def combine_non_empty(series):
    """
    Helper function that combines rows with the same primary key
    Non-empty values take precedence over empty values
    """
    # Drop NaNs and join the remaining unique values
    unique_vals = series.dropna().unique()
    if len(unique_vals) == 0:
        return ""  # if all empty
    elif len(unique_vals) == 1:
        return unique_vals[0]
    else:
        # In case there are multiple non-empty, take the first
        return unique_vals[0]


def clear_existing_data():
    """
    Clear existing data in food_data.db
    """
    with app.app_context():
        db.drop_all(bind_key="food_data")
        db.create_all(bind_key="food_data")


def create_food_table():
    # Open csv
    csvfile = open(
        "backend/automated_data_collection/FoodInfo.csv", newline="", encoding="utf-8"
    )
    reader = csv.DictReader(csvfile)

    with app.app_context():
        # Add each row to the database as a FoodItem
        for row in reader:
            FoodItem.create(
                food_name=row.get("Food Item"),
                dining_location=row.get("Dining Location"),
                cost=-1.0 if row.get("Cost") == "" else row.get("Cost"),
                calories=-1 if row.get("Calories") == "" else row.get("Calories"),
                comments=row.get("Comments"),
                last_updated="Unknown"
                if row.get("Last Updated") == ""
                else row.get("Last Updated"),
                is_vegan=parse_bool(row.get("Vegan")),
                is_gluten_free=parse_bool(row.get("Gluten Free")),
                is_halal=parse_bool(row.get("Halal")),
                is_kosher=parse_bool(row.get("Kosher")),
                is_dairy_free=parse_bool(row.get("No Dairy")),
                has_eggs=parse_bool(row.get("Eggs")),
                has_fish=parse_bool(row.get("Fish")),
                has_milk=parse_bool(row.get("Milk")),
                has_peanuts=parse_bool(row.get("Peanuts")),
                has_sesame=parse_bool(row.get("Sesame")),
                has_soy=parse_bool(row.get("Soy")),
                has_treenuts=parse_bool(row.get("Treenuts")),
                has_wheat=parse_bool(row.get("Wheat")),
            )

    csvfile.close()


def parse_bool(value):
    """
    Helper function to convert Y/N/'' into Boolean
    """
    if value in ("T", "Y", "1"):
        return True
    if value in ("F", "N", "0"):
        return False
    return None


if __name__ == "__main__":
    create_single_csv()
    clear_existing_data()
    create_food_table()
    print("Created food_data.db and added food items.")
