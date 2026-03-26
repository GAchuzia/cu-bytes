# Project imports
from datetime import datetime, timedelta
from backend.app import create_app
from backend.extensions import db
from backend.services.logging_service import create_transaction


app = create_app()


def load_dummy_transactions_from_file(path: str):
    """
    Load and create dummy transactions from a file.

    Each non-empty, non-comment line in the file represents a single transaction.
    Columns must be separated by "|" and appear in the following order:
        username
        food_name
        dining_location (int)
        calories (int)
        percent_fruit_veg (int)
        percent_grain (int)
        percent_dairy (int)
        percent_protein (int)
        fat_g (float)
        carbs_g (float)
        proteins_g (float)
        fiber_g (float)
        sugar_g (float)
        days_ago (int)
    """
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue  # skip empty or commented lines

            (
                username,
                food_name,
                dining_location,
                calories,
                percent_fruit_veg,
                percent_grain,
                percent_dairy,
                percent_protein,
                fat_g,
                carbs_g,
                proteins_g,
                fiber_g,
                sugar_g,
                days_ago,
            ) = line.split("|")

            create_transaction(
                username=username,
                food_name=food_name,
                dining_location=int(dining_location),
                calories=int(calories),
                percent_fruit_veg=int(percent_fruit_veg),
                percent_grain=int(percent_grain),
                percent_dairy=int(percent_dairy),
                percent_protein=int(percent_protein),
                fat_g=float(fat_g),
                carbs_g=float(carbs_g),
                proteins_g=float(proteins_g),
                fiber_g=float(fiber_g),
                sugar_g=float(sugar_g),
                transaction_time=datetime.now() - timedelta(days=int(days_ago)),
            )


if __name__ == "__main__":
    with app.app_context():
        db.drop_all(bind_key="logging")
        db.create_all(bind_key="logging")

        # Create dummy transactions
        load_dummy_transactions_from_file("backend/database/dummy_transactions.txt")

        print("Created logging.db and added dummy transactions.")
