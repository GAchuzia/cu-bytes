# Project imports
from backend.extensions import db


class FoodLogging(db.Model):
    # Specify the database and the table
    __bind_key__ = "logging"
    __tablename__ = "food_logging"

    # Primary key is user + timestamp combo
    username = db.Column(db.String(80), primary_key=True)
    transaction_time = db.Column(db.DateTime, primary_key=True)

    # Reference to FoodItem.food_id
    food_id = db.Column(db.Integer, nullable=False)

    # Total calories consumed: May differ from recorded calorie value
    calories = db.Column(db.Integer, nullable=True)

    def __repr__(self):
        return (
            f"<FoodLogging {self.username} logged {self.food_id} "
            f"at {self.transaction_time}>"
        )

    @classmethod
    def create(cls, username, transaction_time, food_id, calories):
        """Create a new food logging entry and store it in the database"""

        transaction = cls(
            username=username,
            transaction_time=transaction_time,
            food_id=food_id,
            calories=calories,
        )

        db.session.add(transaction)
        db.session.commit()
        return transaction
