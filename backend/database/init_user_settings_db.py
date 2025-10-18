from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# -----------------------------
# Script to create User Settings Database
# -----------------------------
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///user_settings.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# -----------------------------
# Underlying Data Structure stored
# -----------------------------
class UsersProfile(db.Model):
    username = db.Column(db.String(80), primary_key=True)

    # Whether or not the user is comfortable sharing stats
    show_stats = db.Column(db.Boolean, default=True)

    # Allergies and intolerances
    has_egg_allergy = db.Column(db.Boolean, default=False)
    has_fish_allergy = db.Column(db.Boolean, default=False)
    has_dairy_intolerance = db.Column(db.Boolean, default=False)
    has_peanut_allergy = db.Column(db.Boolean, default=False)
    has_sesame_allergy = db.Column(db.Boolean, default=False)
    has_shellfish_allergy = db.Column(db.Boolean, default=False)
    has_soy_allergy = db.Column(db.Boolean, default=False)
    has_treenut_allergy = db.Column(db.Boolean, default=False)
    has_wheat_allergy = db.Column(db.Boolean, default=False)
    has_gluten_allergy = db.Column(db.Boolean, default=False)

    # Dietary preferences
    is_vegan = db.Column(db.Boolean, default=False)
    is_vegetarian = db.Column(db.Boolean, default=False)
    prefers_kosher = db.Column(db.Boolean, default=False)
    prefers_halal = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f"<UsersProfile {self.username}>"

# -----------------------------
# Initialize Database
# -----------------------------
if __name__ == "__main__":
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Dummy users
        user1 = UsersProfile(username="Alice", has_egg_allergy=True, has_peanut_allergy=True, has_shellfish_allergy=True, has_treenut_allergy=True)
        user2 = UsersProfile(username="Bob", is_vegan=True, has_gluten_allergy=True)
        user3 = UsersProfile(username="Charlie", show_stats=False, has_dairy_intolerance=True, prefers_kosher=True)
        user4 = UsersProfile(username="David")
        user5 = UsersProfile(username="Eleanor", show_stats=False)
        user6 = UsersProfile(username="Fiona")

        db.session.add_all([user1, user2, user3, user4, user5, user6])
        db.session.commit()
        print("user_settings.db created and populated with dummy data.")
