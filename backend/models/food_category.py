# Project imports
from backend.extensions import db


class FoodCategory(db.Model):
    # Specify the database, the table and primary key
    __bind_key__ = "food_data"
    __tablename__ = "food_categories"

    # Primary key
    category_name = db.Column(db.String(80), primary_key=True, nullable=False)

    # General attributes
    calories = db.Column(db.Integer, nullable=False)
    percent_fruit_veg = db.Column(db.Integer, nullable=False)
    percent_grain = db.Column(db.Integer, nullable=False)
    percent_dairy = db.Column(db.Integer, nullable=False)
    percent_protein = db.Column(db.Integer, nullable=False)

    # Nutrients
    fat_g = db.Column(db.Float, nullable=False)
    carbs_g = db.Column(db.Float, nullable=False)
    proteins_g = db.Column(db.Float, nullable=False)
    fiber_g = db.Column(db.Float, nullable=False)
    sugar_g = db.Column(db.Float, nullable=False)

    # Dietary attributes
    is_vegan = db.Column(db.Boolean, default=None, nullable=True)
    is_gluten_free = db.Column(db.Boolean, default=None, nullable=True)
    is_halal = db.Column(db.Boolean, default=None, nullable=True)
    is_vegetarian = db.Column(db.Boolean, default=None, nullable=True)
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

    def __repr__(self):
        return f"<FoodCategory {self.category_name}>"

    @classmethod
    def create(
        cls,
        category_name,
        calories,
        percent_fruit_veg,
        percent_grain,
        percent_dairy,
        percent_protein,
        fat_g,
        carbs_g,
        proteins_g,
        fiber_g,
        sugar_g,
        is_vegan,
        is_gluten_free,
        is_halal,
        is_vegetarian,
        is_dairy_free,
        has_eggs,
        has_fish_or_shellfish,
        has_milk,
        has_peanuts,
        has_sesame,
        has_soy,
        has_treenuts,
        has_wheat,
    ):
        """Create a new food category and store it in the database"""

        food_category = cls(
            category_name=category_name,
            calories=calories,
            percent_fruit_veg=percent_fruit_veg,
            percent_grain=percent_grain,
            percent_dairy=percent_dairy,
            percent_protein=percent_protein,
            fat_g=fat_g,
            carbs_g=carbs_g,
            proteins_g=proteins_g,
            fiber_g=fiber_g,
            sugar_g=sugar_g,
            is_vegan=is_vegan,
            is_gluten_free=is_gluten_free,
            is_halal=is_halal,
            is_vegetarian=is_vegetarian,
            is_dairy_free=is_dairy_free,
            has_eggs=has_eggs,
            has_fish_or_shellfish=has_fish_or_shellfish,
            has_milk=has_milk,
            has_peanuts=has_peanuts,
            has_sesame=has_sesame,
            has_soy=has_soy,
            has_treenuts=has_treenuts,
            has_wheat=has_wheat,
        )

        db.session.add(food_category)
        db.session.commit()
        print(f"FoodCategory: Created food category called {category_name}")
        return food_category

    @classmethod
    def get_by_name(cls, category_name):
        """
        Retrieve a FoodCategory by name (case insensitive)
        """
        return cls.query.filter(cls.category_name.ilike(category_name)).first()
