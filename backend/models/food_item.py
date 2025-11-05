# Project imports
from backend.extensions import db


class FoodItem(db.Model):
    # Specify the database, the table and primary key
    __bind_key__ = "food_data"
    __tablename__ = "food_items"

    # Primary key
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # Main attributes
    food_name = db.Column(db.String(80), nullable=False)
    dining_location = db.Column(db.String(80), nullable=False)

    # General attributes
    # Distinctive defaults to make it easy to spot errors
    cost = db.Column(db.Double, default=-1.0)
    calories = db.Column(db.Integer, default=-1)
    comments = db.Column(db.String(200), default="")
    last_updated = db.Column(db.String(20), default="Unknown")

    # Dietary attributes
    is_vegan = db.Column(db.Boolean, default=None, nullable=True)
    is_gluten_free = db.Column(db.Boolean, default=None, nullable=True)
    is_halal = db.Column(db.Boolean, default=None, nullable=True)
    is_kosher = db.Column(db.Boolean, default=None, nullable=True)
    is_dairy_free = db.Column(db.Boolean, default=None, nullable=True)

    # Allergens
    has_eggs = db.Column(db.Boolean, default=None, nullable=True)
    has_fish = db.Column(db.Boolean, default=None, nullable=True)
    has_milk = db.Column(db.Boolean, default=None, nullable=True)
    has_peanuts = db.Column(db.Boolean, default=None, nullable=True)
    has_sesame = db.Column(db.Boolean, default=None, nullable=True)
    has_soy = db.Column(db.Boolean, default=None, nullable=True)
    has_treenuts = db.Column(db.Boolean, default=None, nullable=True)
    has_wheat = db.Column(db.Boolean, default=None, nullable=True)

    def __repr__(self):
        return f"<FoodItem {self.food_name} from {self.dining_location}>"

    @classmethod
    def create(
        cls,
        food_name,
        dining_location,
        cost,
        calories,
        comments,
        last_updated,
        is_vegan,
        is_gluten_free,
        is_halal,
        is_kosher,
        is_dairy_free,
        has_eggs,
        has_fish,
        has_milk,
        has_peanuts,
        has_sesame,
        has_soy,
        has_treenuts,
        has_wheat,
    ):
        """Create a new food item and store it in the database"""

        food_item = cls(
            food_name=food_name,
            dining_location=dining_location,
            cost=cost,
            calories=calories,
            comments=comments,
            last_updated=last_updated,
            is_vegan=is_vegan,
            is_gluten_free=is_gluten_free,
            is_halal=is_halal,
            is_kosher=is_kosher,
            is_dairy_free=is_dairy_free,
            has_eggs=has_eggs,
            has_fish=has_fish,
            has_milk=has_milk,
            has_peanuts=has_peanuts,
            has_sesame=has_sesame,
            has_soy=has_soy,
            has_treenuts=has_treenuts,
            has_wheat=has_wheat,
        )

        db.session.add(food_item)
        db.session.commit()
        print(f"FoodItem: Created food item called {food_name} from {dining_location}")
        return food_item
