# Project imports
from backend.app import create_app
from backend.extensions import db
from backend.services.authentication_service import create_user
from backend.services.profile_service import edit_profile_json

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        db.drop_all(bind_key="auth")
        db.create_all(bind_key="auth")

        usernames = [
            "Alice",
            "Bob",
            "Charlie",
            "Carol",
            "Eve",
            "Grace",
            "Judy",
            "Mallory",
            "Olivia",
            "Peggy",
            "Trent",
            "Victor",
        ]

        # Create dummy users with stats sharing enabled
        for name in usernames:
            create_user(name, "Password123!")
            edit_profile_json(
                {
                    "username": name,
                    "show_stats": True,
                }
            )

        print("Created auth.db and added dummy users.")
