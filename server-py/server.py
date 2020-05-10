from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import datetime
import os

app = Flask(__name__)

print(os.environ.get('SQLALCHEMY_DATABASE_URI'))
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get('SQLALCHEMY_DATABASE_URI')
db = SQLAlchemy(app)

class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, nullable=False)
    password = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f'<User id:{self.id}, username:{self.username}>'

class Track(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    counter = db.Column(db.Float, nullable=False)
    createdat = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f'<Track id:{self.id}, counter:{self.counter}, createdat:{self.createdat}>'

import ptvsd
ptvsd.enable_attach(address=('0.0.0.0', 3000))
print('ptvsd is started')


@app.route('/')
def hello_world():
    print(Account.query.filter_by(username='ckinan').first())
    new_track = Track(counter=0.4, createdat=datetime.datetime.now())
    db.session.add(new_track)
    db.session.commit()
    print(Track.query.all())
    return 'Hey, we have Flask in a Docker container!'


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000')
