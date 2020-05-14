from .. import db
from flask_login import UserMixin


class AccountEntity(UserMixin, db.Model):
    __tablename__ = "account"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, nullable=False)
    password = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f'User id:{self.id}, username:{self.username}'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'password': self.password
        }
