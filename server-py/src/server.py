from flask import Flask
import datetime
import os
from .model.Model import SessionManager
import ptvsd

app = Flask(__name__)
ptvsd.enable_attach(address=('0.0.0.0', 3000))
CLIFF_DB_SESSION = SessionManager(os.environ.get('SQLALCHEMY_DATABASE_URI')).get_session()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000')

from .routes import AccountRoute, TrackRoute