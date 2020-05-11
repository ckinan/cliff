import datetime
from ..model.TrackEntity import TrackEntity
from ..server import app, CLIFF_DB_SESSION
from flask_login import login_required
from flask import request
import datetime

@app.route('/tracks', methods=['GET'])
@login_required
def get_all_tracks():
    return {
        'tracks': [x.to_dict() for x in CLIFF_DB_SESSION.query(TrackEntity).all()]
    }

@app.route('/track', methods=['POST'])
@login_required
def save_track():
    req_data = request.get_json()
    counter = req_data['counter']
    track = TrackEntity(counter=float(counter), createdat=datetime.datetime.now())
    CLIFF_DB_SESSION.add(track)
    CLIFF_DB_SESSION.commit()
    return {
        'status': 'OK'
    }, 200