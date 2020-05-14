from ..model.AccountEntity import AccountEntity
from .. import db
from flask import current_app as app
from flask_login import login_required, current_user

@app.route('/api/accounts', methods=['GET'])
@login_required
def get_all_accounts():
    return {
        'accounts': [x.to_dict() for x in db.session.query(AccountEntity).all()]
    }

@app.route('/api/me', methods=['GET'])
@login_required
def protected():
    return {
        'username': current_user.username,
        'isAuthenticated': True
    }
