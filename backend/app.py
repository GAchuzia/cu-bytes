# Library imports
import os
from flask import Flask, jsonify
from flask_cors import CORS

# Project imports
from backend.config import config
from backend.endpoints.authentication_endpoints import auth_bp
from backend.endpoints.browsing_endpoints import browse_bp
from backend.endpoints.locations_endpoints import locations_bp
from backend.endpoints.food_entry_endpoints import logging_bp
from backend.endpoints.ml_endpoints import ml_bp
from backend.endpoints.profile_endpoints import profile_bp
from backend.endpoints.recommendations_endpoints import recommendations_bp
from backend.endpoints.statistics_endpoints import statistics_bp
from backend.extensions import db


# App Factory
# Use config_overide to pass in test configuration
def create_app(config_override=None):
    app = Flask(__name__)
    app.config.from_object(config[os.getenv("FLASK_ENV") or "default"])

    if config_override:
        app.config.update(config_override)

    db.init_app(app)

    # Register Blueprints (equivalent to importing endpoint functions)
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(browse_bp, url_prefix="/browse")
    app.register_blueprint(locations_bp, url_prefix="/locations")
    app.register_blueprint(logging_bp, url_prefix="/logging")
    app.register_blueprint(ml_bp, url_prefix="/ml")
    app.register_blueprint(profile_bp, url_prefix="/profile")
    app.register_blueprint(recommendations_bp, url_prefix="/recommend")
    app.register_blueprint(statistics_bp, url_prefix="/statistics")

    # Configure CORS (Which domains are permitted to access this app)
    CORS(
        app,
        origins="*",
        methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["Content-Type"],
    )

    # Homepage Endpoints to Delete Later
    @app.route("/")
    def home():
        return jsonify(
            {
                "message": "Welcome to Cu-Bytes Flask API",
                "version": "1.0.0",
                "endpoints": ["/api/health"],
            }
        )

    @app.route("/api/health")
    def health_check():
        return jsonify(
            {
                "status": "healthy",
                "message": "CU-Bytes server is running",
                "timestamp": "Todays date and time lol",
            }
        )

    return app


# Run the server
if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV") == "development"
    print(f"Starting server on http://127.0.0.1:{port}")  # noqa: E231
    print(f"Debug Mode is {debug}")
    app.run(host="127.0.0.1", port=port, debug=debug)
