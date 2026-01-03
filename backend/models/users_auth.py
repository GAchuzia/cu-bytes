# Library imports
from argon2 import PasswordHasher

# Project imports
from backend.extensions import db

ph = PasswordHasher()


class UsersAuth(db.Model):
    # Specify the database and the table
    __bind_key__ = "auth"
    __tablename__ = "users_auth"

    username = db.Column(db.String(80), primary_key=True)
    password = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f"<UsersAuth {self.username}>"

    @classmethod
    def create(cls, username, password):
        """Create a new user and store it in the database"""
        hashed_password = ph.hash(password)
        user = cls(username=username, password=hashed_password)

        db.session.add(user)
        db.session.commit()
        return user

    @classmethod
    def get_user_by_name(cls, username):
        """
        Retrieve a user object from the database by username.
        Returns None if not found.
        """
        return cls.query.filter_by(username=username).first()

    def verify_password(self, password_attempt):
        """Verify password using stored salt"""
        try:
            # Verify the password attempt against the stored hash
            if ph.verify(self.password, password_attempt):
                return True
        except Exception:
            # Includes VerifyMismatchError which triggers on wrong password
            return False
