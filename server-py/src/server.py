import os
from .model.Model import SessionManager
from flask import Flask
from flask_login import LoginManager
from flask_session import Session
from flask_cors import CORS
from .config import Config

# Debug configuration
if int(os.environ.get('FLASK_DEBUG')) == 1:
    import pydevd_pycharm
    pydevd_pycharm.settrace(os.environ.get('HOST_DOCKER_INTERNAL'), port=3000, stdoutToServer=False, stderrToServer=False)

# Initialize app variables
app = Flask(__name__)
login_manager = LoginManager()
sess = Session()

# App configuration
app.config.from_object(Config())
login_manager.init_app(app)
sess.init_app(app)
CORS(app, supports_credentials=True, resources={'/api/*': {"origins": os.environ.get('CLIENT_URL')}})

# "Global" variables
CLIFF_DB_SESSION = SessionManager(os.environ.get('SQLALCHEMY_DATABASE_URI')).get_session()

app.logger.info('App has been initialized')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000')

# Load routes implicitly
from .routes import AuthRoute, AccountRoute, TrackRoute
