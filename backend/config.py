import os
from dotenv import load_dotenv

# Detect Azure environment (Azure will always create this variable)
IS_AZURE = os.getenv("HOME") == "/home"

# Set database directory
if IS_AZURE:
    DB_DIR = os.path.join(os.getenv("HOME"), "site", "wwwroot", "backend", "database")
else:
    DB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "database")

# Ensure database directory exists
os.makedirs(DB_DIR, exist_ok=True)

IDEAL_TARGETS = {
    "fat_pct": 0.275,
    "carbs_pct": 0.55,
    "protein_pct": 0.20,
    "fiber_per1000": 14,
    "sugar_per1000": 25,
    "fruit_veg_pct": 0.40,
    "grain_pct": 0.30,
    "dairy_pct": 0.10,
    "protein_pct_fg": 0.20,
}  # Hardcoded ideal targets (USDA/AMDR 2000-cal adult)

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev-secret-key-change-in-production"
    FLASK_ENV = os.environ.get("FLASK_ENV") or "development"
    PORT = int(os.environ.get("PORT") or 5000)


class DevelopmentConfig(Config):
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # If all models are properly linked SQLALCHEMY_DATABASE_URI actually does not matter
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(DB_DIR, 'main.db')}"  # noqa
    SQLALCHEMY_BINDS = {
        "auth": f"sqlite:///{os.path.join(DB_DIR, 'auth.db')}",  # noqa
        "profiles": f"sqlite:///{os.path.join(DB_DIR, 'profiles.db')}",  # noqa
        "food_data": f"sqlite:///{os.path.join(DB_DIR, 'food_data.db')}",  # noqa
        "logging": f"sqlite:///{os.path.join(DB_DIR, 'logging.db')}",  # noqa
    }
    DEBUG = True


class ProductionConfig(Config):
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(DB_DIR, 'main.db')}"  # noqa
    SQLALCHEMY_BINDS = {
        "auth": f"sqlite:///{os.path.join(DB_DIR, 'auth.db')}",  # noqa
        "profiles": f"sqlite:///{os.path.join(DB_DIR, 'profiles.db')}",  # noqa
        "food_data": f"sqlite:///{os.path.join(DB_DIR, 'food_data.db')}",  # noqa
        "logging": f"sqlite:///{os.path.join(DB_DIR, 'logging.db')}",  # noqa
    }
    DEBUG = False


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
