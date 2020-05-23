import os
import redis
from datetime import timedelta
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    # Session
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SESSION_TYPE = 'redis'
    SESSION_REDIS = redis.from_url(os.environ.get('SESSION_REDIS'))
    SESSION_COOKIE_NAME = 'sid'
    PERMANENT_SESSION_LIFETIME = timedelta(days=180)
    SESSION_COOKIE_SECURE = os.environ.get('SESSION_REDIS') == 'production'
    SESSION_USE_SIGNER = True
    SESSION_KEY_PREFIX = 'sid:'
    # Others
    FLASK_RUN_PORT = os.environ.get('FLASK_RUN_PORT')
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # https://stackoverflow.com/a/33790196/7054799
