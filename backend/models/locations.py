# Project imports
from backend.extensions import db


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
