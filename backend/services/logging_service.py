# Library imports
from datetime import datetime

# Project imports
from backend.models.food_logging import FoodLogging


def create_transaction(username, food_id, calories):
    """Create a new transaction and store it in the database"""
    transaction = FoodLogging.create(
        username=username,
        transaction_time=datetime.now(),
        food_id=food_id,
        calories=calories,
    )
    print(f"LoggingService: Logged food id {food_id} for user {username}")
    return transaction
