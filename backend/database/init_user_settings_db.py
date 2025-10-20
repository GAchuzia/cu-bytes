# Project imports
from backend.app import create_app
from backend.extensions import db
from backend.models.users_profile import UsersProfile

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        db.drop_all(bind_key="profiles")
        db.create_all(bind_key="profiles")

        # Create dummy users
        UsersProfile.create(
            username="Alice",
            has_egg_allergy=True,
            has_peanut_allergy=True,
            has_shellfish_allergy=True,
            has_treenut_allergy=True,
        )
        UsersProfile.create(username="Bob", is_vegan=True, has_gluten_allergy=True)
        UsersProfile.create(
            username="Charlie",
            show_stats=False,
            has_dairy_intolerance=True,
            prefers_kosher=True,
        )
        print("Created profiles.db and added dummy users.")
