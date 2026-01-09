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
        create_transaction("Alice", 651, 500, 40, 30, 20, 10)
        create_transaction("Alice", 7, 550, 40, 30, 20, 10)
        create_transaction("Bob", 651, 700, 40, 30, 20, 10)
        create_transaction("Bob", 2, 50, 40, 30, 20, 10)
        create_transaction("Bob", 2, 5, 40, 30, 20, 10)
        print("Created logging.db and added dummy transactions.")
