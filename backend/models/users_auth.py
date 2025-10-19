# Library imports
import hashlib
import os

# Project imports
from backend.extensions import db

class UsersAuth(db.Model):
    # Specify the database and the table
    __bind_key__ = 'auth'
    __tablename__ = "users_auth"

    username = db.Column(db.String(80), primary_key=True)
    password = db.Column(db.String(64), nullable=False)
    salt = db.Column(db.String(32), nullable=False)

    def __repr__(self):
        return f"<UsersAuth {self.username}>"

    @staticmethod
    def hash_with_salt(password, salt):
        """Returns SHA256 hash of password + salt"""
        return hashlib.sha256((password + salt).encode()).hexdigest()

    @classmethod
    def create(cls, username, password, salt):
        """Create a new user and store it in the database"""
        user = cls(username=username, password=password, salt=salt)

        db.session.add(user)
        db.session.commit()
        return user

    def verify_password(self, password_attempt):
        """Verify password using stored salt"""
        return self.password == self.hash_with_salt(password_attempt, self.salt)
