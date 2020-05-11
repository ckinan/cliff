from flask import Flask
import datetime
import os
from .model.Model import SessionManager
from flask_login import LoginManager
from flask_session import Session
from flask_cors import CORS
import redis

app = Flask(__name__)

if int(os.environ.get('FLASK_DEBUG')) == 1:
    import ptvsd
    ptvsd.enable_attach(address=('0.0.0.0', 3000))

CLIFF_DB_SESSION = SessionManager(os.environ.get('SQLALCHEMY_DATABASE_URI')).get_session()

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_REDIS'] = redis.from_url(os.environ.get('SESSION_REDIS'))
login_manager = LoginManager()
login_manager.init_app(app)
sess = Session()
sess.init_app(app)

app.logger.info('------------>>>>>>> client url')
app.logger.info(os.environ.get('CLIENT_URL'))

CORS(
    app,
    supports_credentials=True,
    resources={'/api/*': {
        "origins": os.environ.get('CLIENT_URL')
    }}
)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000')

from .routes import AuthRoute, AccountRoute, TrackRoute