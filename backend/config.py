import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev-secret-key-change-in-production"
    FLASK_ENV = os.environ.get("FLASK_ENV") or "development"
    PORT = int(os.environ.get("PORT")) or 5000


class DevelopmentConfig(Config):
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    # fmt: off
    SQLALCHEMY_BINDS = {
        "auth": f"sqlite:///{os.path.join(BASE_DIR, 'database/auth.db')}", # noqa
        "profiles": f"sqlite:///{os.path.join(BASE_DIR, 'database/profiles.db')}", # noqa
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
    }
    # fmt: on
    DEBUG = False


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
