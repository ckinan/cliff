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

@app.route('/me', methods=['GET'])
@login_required
def protected():
    return {
        'username': current_user.username
    }
