# Project imports
from backend.extensions import db

class UsersProfile(db.Model):
    # Specify the database and the table
    __bind_key__ = "profiles"
    __tablename__ = "users_profile"

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

    @classmethod
    def create(cls, username, show_stats=False, has_egg_allergy=False, has_dairy_intolerance=False, 
               has_peanut_allergy=False, has_sesame_allergy=False, has_shellfish_allergy=False,
               has_soy_allergy=False, has_treenut_allergy=False, has_wheat_allergy=False,
               has_gluten_allergy=False, is_vegan=False, is_vegetarian=False, prefers_kosher=False,
               prefers_halal=False):
        """Create a new dietary profile and store it in the database"""

        user = cls(username=username, show_stats=show_stats, has_egg_allergy=has_egg_allergy,
                   has_dairy_intolerance=has_dairy_intolerance, has_peanut_allergy=has_peanut_allergy,
                   has_sesame_allergy=has_sesame_allergy, has_shellfish_allergy=has_shellfish_allergy,
                   has_soy_allergy=has_soy_allergy, has_treenut_allergy=has_treenut_allergy,
                   has_wheat_allergy=has_wheat_allergy, has_gluten_allergy=has_gluten_allergy,
                   is_vegan=is_vegan, is_vegetarian=is_vegetarian, prefers_kosher=prefers_kosher,
                   prefers_halal=prefers_halal)
        
        db.session.add(user)
        db.session.commit()
        print(f"UsersProfile: Created profile for user {username}")
        return user
