from ..model.TrackEntity import TrackEntity
from ..server import app, CLIFF_DB_SESSION
from flask_login import login_required
from flask import request
import datetime
from sqlalchemy import func, desc
from sqlalchemy.sql import func as sqlfunc


@app.route('/api/tracks', methods=['GET'])
@login_required
def get_all_tracks():
    return {
        'tracks': [x.to_dict() for x in CLIFF_DB_SESSION.query(TrackEntity).all()],
        'summary': CLIFF_DB_SESSION.query(sqlfunc.sum(TrackEntity.counter).label("counter"), func.date(TrackEntity.createdat)).group_by(func.date(TrackEntity.createdat)).order_by(desc(func.date(TrackEntity.createdat))).all()
    }

@app.route('/api/track', methods=['POST'])
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
