# Library imports
import pytest

# Project imports
from backend.app import create_app, db

# These objects are automatically injected
@pytest.fixture
def app():
    """
    A new app instance for each test.
    This is used to interact with app configuration and database.
    """
    app = create_app()
    app.config['TESTING'] = True

    # Use temporary database in memory
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SQLALCHEMY_BINDS'] = {}

    with app.app_context():
        db.create_all()
        yield app
        # Lines after yield occur on teardown
        db.drop_all()

@pytest.fixture
def client(app):
    """
    A test client for the app.
    This is used to simulate HTTP requests.
    """
    return app.test_client()
