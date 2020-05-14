import os
from flask import Flask
from flask_login import LoginManager
from flask_session import Session
from flask_cors import CORS
from .config import Config
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
login_manager = LoginManager()
sess = Session()
cors = CORS()


def create_app():
    # Debug configuration
    if int(os.environ.get('FLASK_DEBUG')) == 1:
        import pydevd_pycharm
        pydevd_pycharm.settrace(os.environ.get('HOST_DOCKER_INTERNAL'), port=3000, stdoutToServer=False,
                                stderrToServer=False)

    """Construct the core application."""
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object(Config())

    # Initialize app variables
    db.init_app(app)
    login_manager.init_app(app)
    sess.init_app(app)

    cors.init_app(app, supports_credentials=True, resources={'/api/*': {"origins": os.environ.get('CLIENT_URL')}})

    app.logger.info(os.environ.get('CLIENT_URL'))
    app.logger.info('App has been initialized')

    with app.app_context():
        from .routes import AccountRoute, AuthRoute, TrackRoute
        return app
