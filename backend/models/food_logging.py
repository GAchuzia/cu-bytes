# Project imports
from backend.extensions import db


class FoodLogging(db.Model):
    # Specify the database and the table
    __bind_key__ = "logging"
    __tablename__ = "food_logging"

    # Primary key is user + timestamp combo
    username = db.Column(db.String(80), primary_key=True)
    transaction_time = db.Column(db.DateTime, primary_key=True)

    # Name of the food item
    food_name = db.Column(db.String(80), nullable=False)

    calories = db.Column(db.Integer, nullable=True)

    # Percentages of each food group
    percent_fruit_veg = db.Column(db.Integer, default=0)
    percent_grain = db.Column(db.Integer, default=0)
    percent_dairy = db.Column(db.Integer, default=0)
    percent_protein = db.Column(db.Integer, default=0)

    def __repr__(self):
        return (
            f"<FoodLogging {self.username} logged {self.food_id} "
            f"at {self.transaction_time}>"
        )

    @classmethod
    def create(
        cls,
        username,
        transaction_time,
        food_name,
        calories,
        percent_fruit_veg,
        percent_grain,
        percent_dairy,
        percent_protein,
    ):
        """Create a new food logging entry and store it in the database"""

        transaction = cls(
            username=username,
            transaction_time=transaction_time,
            food_name=food_name,
            calories=calories,
            percent_fruit_veg=percent_fruit_veg,
            percent_grain=percent_grain,
            percent_dairy=percent_dairy,
            percent_protein=percent_protein,
        )

        db.session.add(transaction)
        db.session.commit()
        return transaction
