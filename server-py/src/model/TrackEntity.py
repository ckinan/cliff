from .. import db


class TrackEntity(db.Model):
    __tablename__ = "track"

    id = db.Column(db.Integer, primary_key=True)
    counter = db.Column(db.Float, nullable=False)
    createdat = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f'Track id:{self.id}, counter:{self.counter}, createdat:{self.createdat}'

    def to_dict(self):
        return {
            'id': self.id,
            'counter': self.counter,
            'createdat': self.createdat
        }
