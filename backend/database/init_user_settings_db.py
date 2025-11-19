# Project imports
from backend.app import create_app
from backend.extensions import db

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        db.drop_all(bind_key="profiles")
        db.create_all(bind_key="profiles")

        print("Created profiles.db and NO dummy profiles added.")
