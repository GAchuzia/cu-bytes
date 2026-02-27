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
    dining_location = db.Column(db.Integer, nullable=False)

    # General attributes
    # Distinctive defaults to make it easy to spot errors
    cost = db.Column(db.Double, default=-1.0)
    calories = db.Column(db.Integer, default=-1)
    comments = db.Column(db.String(200), default="")
    last_updated = db.Column(db.String(20), default="Unknown")

    # Dietary attributes
    is_vegan = db.Column(db.Boolean, default=None, nullable=True)
    is_vegetarian = db.Column(db.Boolean, default=None, nullable=True)
    is_gluten_free = db.Column(db.Boolean, default=None, nullable=True)
    is_halal = db.Column(db.Boolean, default=None, nullable=True)
    is_dairy_free = db.Column(db.Boolean, default=None, nullable=True)

    # Allergens
    has_eggs = db.Column(db.Boolean, default=None, nullable=True)
    has_fish_or_shellfish = db.Column(db.Boolean, default=None, nullable=True)
    has_milk = db.Column(db.Boolean, default=None, nullable=True)
    has_peanuts = db.Column(db.Boolean, default=None, nullable=True)
    has_sesame = db.Column(db.Boolean, default=None, nullable=True)
    has_soy = db.Column(db.Boolean, default=None, nullable=True)
    has_treenuts = db.Column(db.Boolean, default=None, nullable=True)
    has_wheat = db.Column(db.Boolean, default=None, nullable=True)

    # Foreign key to the associated FoodCategory
    food_category = db.Column(db.String(80), nullable=False)

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
        is_vegetarian,
        is_gluten_free,
        is_halal,
        is_dairy_free,
        has_eggs,
        has_fish_or_shellfish,
        has_milk,
        has_peanuts,
        has_sesame,
        has_soy,
        has_treenuts,
        has_wheat,
        food_category,
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
            is_vegetarian=is_vegetarian,
            is_gluten_free=is_gluten_free,
            is_halal=is_halal,
            is_dairy_free=is_dairy_free,
            has_eggs=has_eggs,
            has_fish_or_shellfish=has_fish_or_shellfish,
            has_milk=has_milk,
            has_peanuts=has_peanuts,
            has_sesame=has_sesame,
            has_soy=has_soy,
            has_treenuts=has_treenuts,
            has_wheat=has_wheat,
            food_category=food_category,
        )

        db.session.add(food_item)
        db.session.commit()
        print(f"FoodItem: Created food item called {food_name} from {dining_location}")
        return food_item

    @classmethod
    def get_by_id(cls, food_id):
        """
        Retrieve a FoodItem by id
        """
        return db.session.get(cls, food_id)

    def to_json(self):
        """Return a JSON-serializable dict representing this food item."""

        return {
            "id": self.id,
            "name": self.food_name,
            "dining_location": get_dining_location_name(self.dining_location),
            "cost": self.cost,
            "calories": self.calories,
            "comments": self.comments,
            "last_updated": self.last_updated,
            "is_vegan": self.is_vegan,
            "is_vegetarian": self.is_vegetarian,
            "is_gluten_free": self.is_gluten_free,
            "is_halal": self.is_halal,
            "is_dairy_free": self.is_dairy_free,
            "has_eggs": self.has_eggs,
            "has_fish_or_shellfish": self.has_fish_or_shellfish,
            "has_milk": self.has_milk,
            "has_peanuts": self.has_peanuts,
            "has_sesame": self.has_sesame,
            "has_soy": self.has_soy,
            "has_treenuts": self.has_treenuts,
            "has_wheat": self.has_wheat,
            "food_category": self.food_category,
        }


def get_dining_location_name(dining_location_id):
    if dining_location_id == 1:
        return "Tim Hortons"
    elif dining_location_id == 2:
        return "Subway"
    elif dining_location_id == 3:
        return "Colonel by Chicken"
    elif dining_location_id == 4:
        return "La Cocina"
    elif dining_location_id == 5:
        return "Mike's Place"
    elif dining_location_id == 6:
        return "Starbucks"
    elif dining_location_id == 7:
        return "Rodney's Kitchen"
    elif dining_location_id == 8:
        return "Leo's Lounge"
    elif dining_location_id == 9:
        return "Teraanga Commons Dining Hall"
    elif dining_location_id == 10:
        return "Tunnel Junction"
    elif dining_location_id == 11:
        return "Bridgehead"
    elif dining_location_id == 12:
        return "Rooster's"
    elif dining_location_id == 13:
        return "Riverbank Social"
    elif dining_location_id == 14:
        return "Oasis"
    elif dining_location_id == 15:
        return "Urban Deli"
    elif dining_location_id == 16:
        return "Shawarma Palace"
    elif dining_location_id == 17:
        return "Ollies"
    elif dining_location_id == 18:
        return "Burger 101"
    elif dining_location_id == 19:
        return "Bento Boxes"
    elif dining_location_id == 20:
        return "CT-Pastry"
    elif dining_location_id == 21:
        return "The Market Pizzeria"
    elif dining_location_id == 22:
        return "Thai Kitchen"
    else:
        return "Unknown"
