from ..model.TrackEntity import TrackEntity
from .. import db
from flask_login import login_required
from flask import request, current_app as app
import datetime

@app.route('/api/tracks', methods=['GET'])
@login_required
def get_all_tracks():
    tracks_summary = list(db.session.execute("""
        select sum(counter::numeric) as counter, date(createdat)
        from track group by date(createdat)
        order by date(createdat) desc
    """))

    tracks_by_hour = list(db.session.execute("""
        select sum(counter::numeric),
        date_trunc('hour', createdat)
        from track
        where createdat >= current_date - cast(extract(dow from current_date) as int) + 1
        group by date_trunc('hour', createdat)
        order by 2
    """))
    return {
        'tracks': [x.to_dict() for x in db.session.query(TrackEntity).order_by(TrackEntity.createdat.asc()).all()],
        'summary': [{'counter': float(x[0]), 'date': x[1].strftime("%a %d %B %Y")} for x in tracks_summary],
        'tracksByHour': [{'counter': float(x[0]), 'date': x[1]} for x in tracks_by_hour],
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
