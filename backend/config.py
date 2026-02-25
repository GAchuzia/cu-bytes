import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
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
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    # fmt: off
    SQLALCHEMY_BINDS = {
        "auth": f"sqlite:///{os.path.join(BASE_DIR, 'database/auth.db')}", # noqa
        "profiles": f"sqlite:///{os.path.join(BASE_DIR, 'database/profiles.db')}", # noqa
        "food_data": f"sqlite:///{os.path.join(BASE_DIR, 'database/food_data.db')}", # noqa
        "logging": f"sqlite:///{os.path.join(BASE_DIR, 'database/logging.db')}", # noqa
    }
    # fmt: on
    DEBUG = True


class ProductionConfig(Config):
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    # fmt: off
    SQLALCHEMY_BINDS = {
        "auth": f"sqlite:///{os.path.join(BASE_DIR, 'database/auth.db')}", # noqa
        "profiles": f"sqlite:///{os.path.join(BASE_DIR, 'database/profiles.db')}", # noqa
        "food_data": f"sqlite:///{os.path.join(BASE_DIR, 'database/food_data.db')}", # noqa
        "logging": f"sqlite:///{os.path.join(BASE_DIR, 'database/logging.db')}", # noqa
    }
    # fmt: on
    DEBUG = False


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
