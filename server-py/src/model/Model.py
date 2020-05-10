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
