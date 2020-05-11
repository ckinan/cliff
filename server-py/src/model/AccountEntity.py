from sqlalchemy import Column, Integer, Text
from .Model import Base
from flask_login import UserMixin

class AccountEntity(UserMixin, Base):
    __tablename__ = "account"

    id = Column(Integer, primary_key=True)
    username = Column(Text, nullable=False)
    password = Column(Text, nullable=False)

    def __repr__(self):
        return f'User id:{self.id}, username:{self.username}'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'password': self.password
        }
