import pandas as pd
import numpy as np

"""
CSV files are expected to contain the following columns
Food Item | Dining Location | Cost | Calories | Nuts | Vegan
Gluten Free | Halal | Vegetarian | No Dairy |Comments | Eggs
Fish | Milk | Peanuts | Sesame | Soy | TreeNuts | Wheat | Kosher
Last Updated
"""


def create_single_csv():
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

    # Group by the key and combine non-empty values
    def combine_non_empty(series):
        # Drop NaNs and join the remaining unique values
        unique_vals = series.dropna().unique()
        if len(unique_vals) == 0:
            return ""  # if all empty
        elif len(unique_vals) == 1:
            return unique_vals[0]
        else:
            # In case there are multiple non-empty, take the first
            return unique_vals[0]

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


if __name__ == "__main__":
    create_single_csv()
