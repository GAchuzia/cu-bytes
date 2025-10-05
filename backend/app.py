from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)

# Configure CORS to allow requests from any origin during development
CORS(
    app,
    origins="*",
    methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type"],
)


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
            "timestamp": "2024-01-15T12:30:00Z",
        }
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV") == "development"
    print(f"Starting server on http://0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
