import datetime
from ..model.Model import Account
from ..server import app, CLIFF_DB_SESSION

@app.route('/accounts', methods=['GET'])
def get_all_accounts():
    return f'Accounts: {CLIFF_DB_SESSION.query(Account).all()}'
