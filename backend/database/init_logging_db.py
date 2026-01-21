# Project imports
from backend.app import create_app
from backend.extensions import db
from backend.services.logging_service import create_transaction


app = create_app()

if __name__ == "__main__":
    with app.app_context():
        db.drop_all(bind_key="logging")
        db.create_all(bind_key="logging")

        # Create dummy transactions
        create_transaction(
            username="Alice",
            food_name="Yogurt Parfait",
            calories=320,
            percent_fruit_veg=40,
            percent_grain=30,
            percent_dairy=30,
            percent_protein=0,
            fat_g=6.5,
            carbs_g=45.2,
            proteins_g=12.8,
            fiber_g=5.4,
            sugar_g=22.0,
        )

        create_transaction(
            username="Alice",
            food_name="Chicken Salad",
            calories=420,
            percent_fruit_veg=50,
            percent_grain=10,
            percent_dairy=0,
            percent_protein=40,
            fat_g=14.3,
            carbs_g=18.7,
            proteins_g=32.5,
            fiber_g=6.1,
            sugar_g=4.2,
        )

        create_transaction(
            username="Alice",
            food_name="Oatmeal",
            calories=250,
            percent_fruit_veg=20,
            percent_grain=70,
            percent_dairy=10,
            percent_protein=0,
            fat_g=4.2,
            carbs_g=42.0,
            proteins_g=9.5,
            fiber_g=6.8,
            sugar_g=7.1,
        )

        create_transaction(
            username="Bob",
            food_name="Cheeseburger",
            calories=650,
            percent_fruit_veg=10,
            percent_grain=30,
            percent_dairy=20,
            percent_protein=40,
            fat_g=34.6,
            carbs_g=45.8,
            proteins_g=32.1,
            fiber_g=3.2,
            sugar_g=6.5,
        )

        create_transaction(
            username="Bob",
            food_name="Pepperoni Pizza",
            calories=720,
            percent_fruit_veg=5,
            percent_grain=45,
            percent_dairy=25,
            percent_protein=25,
            fat_g=38.9,
            carbs_g=68.3,
            proteins_g=28.4,
            fiber_g=4.1,
            sugar_g=8.7,
        )

        create_transaction(
            username="Bob",
            food_name="Apple",
            calories=95,
            percent_fruit_veg=100,
            percent_grain=0,
            percent_dairy=0,
            percent_protein=0,
            fat_g=0.3,
            carbs_g=25.1,
            proteins_g=0.5,
            fiber_g=4.4,
            sugar_g=18.9,
        )

        print("Created logging.db and added dummy transactions.")
