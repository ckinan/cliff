from sqlalchemy import Column, Integer, Float, DateTime
from .Model import Base

class TrackEntity(Base):
    __tablename__ = "track"

    id = Column(Integer, primary_key=True)
    counter = Column(Float, nullable=False)
    createdat = Column(DateTime, nullable=False)

    def __repr__(self):
        return f'Track id:{self.id}, counter:{self.counter}, createdat:{self.createdat}'

    def to_dict(self):
        return {
            'id': self.id,
            'counter': self.counter,
            'createdat': self.createdat
        }
