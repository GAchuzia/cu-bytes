# Project imports
from backend.extensions import db

# List of dining locations
DINING_LOCATIONS = {
    1: "Basil Box",
    2: "Bento Boxes",
    3: "Bridgehead",
    4: "Burger 101",
    5: "Colonel by Chicken",
    6: "CT-Pastry",
    7: "La Cocina",
    8: "Leo's Lounge",
    9: "Medi Eats",
    10: "Mike's Place",
    11: "Oasis",
    12: "Ollies",
    13: "Riverbank Social",
    14: "Rodney's Kitchen",
    15: "Rooster's",
    16: "Shawarma Palace",
    17: "Starbucks",
    18: "Subway",
    19: "Teraanga Commons Dining Hall",
    20: "Thai Kitchen",
    21: "The Market Pizzeria",
    22: "Tim Hortons",
    23: "Tunnel Junction",
    24: "Twisted Beet",
    25: "Urban Deli",
}


# ID to name lookup
def get_dining_location_name(dining_location_id):
    return DINING_LOCATIONS.get(dining_location_id, "Unknown")


class DiningLocation(db.Model):
    # Specify the database, the table and primary key
    __bind_key__ = "food_data"
    __tablename__ = "dining_locations"

    # Primary key
    dining_service_id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # Main attribute
    dining_location_name = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return f"<DiningLocation {self.dining_location_name}>"

    @classmethod
    def create(cls, dining_location_name):
        """
        Create a new dining location and store it in the database
        """

        dining_location = cls(dining_location_name=dining_location_name)

        db.session.add(dining_location)
        db.session.commit()
        print(f"DiningLocation: Created dining location called {dining_location_name}")

    @classmethod
    def get_by_name(cls, dining_location_name):
        """
        Retrieve a DiningLocation by name
        """
        return db.session.get(cls, dining_location_name)

    def to_json(self):
        """
        Return a JSON-serializable dict representing the food items at
        this dining location.
        """
        return {
            "id": self.dining_service_id,
            "dining_location": self.dining_location_name,
        }
