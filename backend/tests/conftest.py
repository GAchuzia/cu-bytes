# Library imports
import os
import tempfile
import pytest

# Project imports
from backend.app import create_app, db


# These objects are automatically injected
@pytest.fixture(scope="session")
def temp_dbs():
    """Create temp DB files for the test session."""
    tmp_auth = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
    tmp_profiles = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
    tmp_food = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
    tmp_logging = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
    tmp_auth.close()
    tmp_profiles.close()
    tmp_food.close()
    tmp_logging.close()

    yield {
        "auth": tmp_auth.name,
        "profiles": tmp_profiles.name,
        "food_data": tmp_food.name,
        "logging": tmp_logging.name,
    }

    # Lines after yield occur on teardown
    # Dispose engines before deleting files
    for path in (tmp_auth.name, tmp_profiles.name, tmp_food.name):
        try:
            os.unlink(path)
        except (PermissionError, FileNotFoundError):
            pass


@pytest.fixture
def app(temp_dbs):
    """Create a Flask app using the temp DBs."""
    test_config = {
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": f"sqlite:///{temp_dbs['auth']}",  # noqa
        "SQLALCHEMY_BINDS": {
            "auth": f"sqlite:///{temp_dbs['auth']}",  # noqa
            "profiles": f"sqlite:///{temp_dbs['profiles']}",  # noqa
            "food_data": f"sqlite:///{temp_dbs['food_data']}",  # noqa
            "logging": f"sqlite:///{temp_dbs['logging']}",  # noqa
        },
    }

    app = create_app(test_config)

    with app.app_context():
        db.create_all()
        yield app
        # Lines after yield occur on teardown
        db.session.remove()
        db.drop_all()

        # Dispose engines
        for engine in db.engines.values():
            engine.dispose()


@pytest.fixture
def client(app):
    """
    A test client for the app.
    This is used to simulate HTTP requests.
    """
    return app.test_client()
