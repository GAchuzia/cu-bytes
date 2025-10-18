from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# -----------------------------
# Script to create Passwords Database
# -----------------------------
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///auth.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# -----------------------------
# Underlying Data Structure stored
# -----------------------------
class UsersAuth(db.Model):
    username = db.Column(db.String(80), primary_key=True)
    password = db.Column(db.String(120), nullable=False)
    salt = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f"<UsersAuth {self.username}>"

# -----------------------------
# Initialize Database
# -----------------------------
if __name__ == "__main__":
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Dummy users
        user1 = UsersAuth(username="Alice", password="pass123", salt="abc123")
        user2 = UsersAuth(username="Bob", password="secret456", salt="xyz456")
        user3 = UsersAuth(username="Charlie", password="admin789", salt="lmn789")
        user4 = UsersAuth(username="David", password="#$%@123", salt="7da9gs")
        user5 = UsersAuth(username="Eleanor", password="cubytes416", salt="me9vab")
        user6 = UsersAuth(username="Fiona", password="password", salt="l81bvl")

        db.session.add_all([user1, user2, user3, user4, user5, user6])
        db.session.commit()
        print("auth.db created and populated with dummy data.")
