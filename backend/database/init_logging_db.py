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
        create_transaction("Alice", 651, 500)
        create_transaction("Alice", 7, 777)
        create_transaction("Bob", 651, 450)
        create_transaction("Bob", 2, 375)
        create_transaction("Bob", 2, 375)
        print("Created logging.db and added dummy transactions.")
