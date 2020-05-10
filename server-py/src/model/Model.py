from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, PickleType
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class SessionManager():

    def __init__(self, connection_string):
        self.session = self.__create_session(connection_string)

    def get_session(self):
        return self.session

    def __create_session(self, connection_string):
        engine = create_engine(connection_string)
        return sessionmaker(bind=engine)()


class Account(Base):
    __tablename__ = "account"

    id = Column(Integer, primary_key=True)
    username = Column(Text, nullable=False)
    password = Column(Text, nullable=False)

    def __repr__(self):
        return f'User id:{self.id}, username:{self.username}'

class Track(Base):
    __tablename__ = "track"

    id = Column(Integer, primary_key=True)
    counter = Column(Float, nullable=False)
    createdat = Column(DateTime, nullable=False)

    def __repr__(self):
        return f'Track id:{self.id}, counter:{self.counter}, createdat:{self.createdat}'