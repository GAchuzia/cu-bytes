# Library imports
import os
from flask import Flask, jsonify
from flask_cors import CORS

# Project imports
from backend.config import config
from backend.endpoints.authentication_endpoints import auth_bp
from backend.extensions import db

# App Factory
def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    db.init_app(app)

    # Register Blueprints (equivalent to importing endpoint functions)
    app.register_blueprint(auth_bp, url_prefix="/auth")

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
    print(f"Starting server on http://0.0.0.0:{port}")
    print(f"Debug Mode is {debug}")
    app.run(host="0.0.0.0", port=port, debug=debug)
