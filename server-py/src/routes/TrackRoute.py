from ..model.TrackEntity import TrackEntity
from .. import db
from flask_login import login_required
from flask import request, current_app as app
import datetime

@app.route('/api/tracks', methods=['GET'])
@login_required
def get_all_tracks():
    result = list(db.session.execute("""
        select sum(counter::numeric) as counter, date(createdat)
        from track group by date(createdat)
        order by date(createdat) desc
    """))
    return {
        'tracks': [x.to_dict() for x in db.session.query(TrackEntity).all()],
        'summary': [{'counter': float(x[0]), 'date': x[1].strftime("%a %d %B %Y")} for x in result],
    }

@app.route('/api/track', methods=['POST'])
@login_required
def save_track():
    req_data = request.get_json()
    counter = req_data['counter']
    track = TrackEntity(counter=float(counter), createdat=datetime.datetime.now())
    db.session.add(track)
    db.session.commit()
    return {
        'status': 'OK'
    }, 200
