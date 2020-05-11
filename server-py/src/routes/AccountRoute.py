import datetime
from ..model.AccountEntity import AccountEntity
from ..server import app, CLIFF_DB_SESSION, login_manager
from flask_login import login_required, logout_user, current_user, login_user

@app.route('/accounts', methods=['GET'])
@login_required
def get_all_accounts():
    return {
        'accounts': [x.to_dict() for x in CLIFF_DB_SESSION.query(AccountEntity).all()]
    }

@app.route('/protected', methods=['POST'])
@login_required
def protected():
    print(current_user)
    return {
        'username': current_user.username,
        'isAuthenticated': current_user.is_authenticated
    }

@app.route('/public', methods=['POST'])
def public():
    return {
        'hello': 'world!',
        'isAuthenticated': False
    }

@app.route('/login', methods=['POST'])
def login():
    # TODO this id should be an input parameter
    account = CLIFF_DB_SESSION.query(AccountEntity).filter_by(id=1).one()
    login_user(account)
    return {
        'username': account.username,
        'isAuthenticated': account.is_authenticated
    }

@app.route('/logout', methods=['POST'])
def logout():
    logout_user()
    return {
        'isAuthenticated': False
    }

@login_manager.user_loader
def load_user(userid):
    return CLIFF_DB_SESSION.query(AccountEntity).filter_by(id=userid).one()
