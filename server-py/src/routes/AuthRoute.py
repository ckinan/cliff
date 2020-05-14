from ..model.AccountEntity import AccountEntity
from .. import db, login_manager
from flask import request, current_app as app
from flask_login import login_required, logout_user, login_user
import bcrypt

@app.errorhandler(401)
def unauthorized(e):
    return {
        'isAuthenticated': False,
        'message': str(e)
    }, 401

@app.route('/api/login', methods=['POST'])
def login():
    req_data = request.get_json()
    username = req_data['username']
    password = req_data['password']
    account = db.session.query(AccountEntity).filter_by(username=username).one()
    if bcrypt.checkpw(password.encode('utf8'), account.password.encode('utf8')):
        login_user(account)
        return {
            'username': account.username,
            'isAuthenticated': account.is_authenticated
        }, 200
    else:
        return {
            'isAuthenticated': False
        }, 401
    
@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return {
        'isAuthenticated': False
    }

@login_manager.user_loader
def load_user(userid):
    return db.session.query(AccountEntity).filter_by(id=userid).one()
