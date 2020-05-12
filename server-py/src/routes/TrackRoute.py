from ..model.TrackEntity import TrackEntity
from ..server import app, CLIFF_DB_SESSION
from flask_login import login_required
from flask import request
import datetime
from sqlalchemy import func, desc, Numeric
from sqlalchemy.sql import func as sqlfunc


@app.route('/api/tracks', methods=['GET'])
@login_required
def get_all_tracks():
    result = list(CLIFF_DB_SESSION.execute("""
        select sum(counter::numeric) as counter, date(createdat)
        from track group by date(createdat)
        order by date(createdat) desc
    """))
    return {
        'tracks': [x.to_dict() for x in CLIFF_DB_SESSION.query(TrackEntity).all()],
        'summary': [{'counter': float(x[0]), 'date': x[1].strftime("%a %d %B %Y")} for x in result],
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
