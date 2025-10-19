# Project imports
from backend.app import create_app
from backend.extensions import db
from backend.services.authentication_service import create_user

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        db.drop_all(bind_key="auth")
        db.create_all(bind_key="auth")

        # Create dummy users
        create_user("Alice", "pass123")
        create_user("Bob", "secret456")
        create_user("Charlie", "admin789")
        print("Created auth.db and added dummy users.")
