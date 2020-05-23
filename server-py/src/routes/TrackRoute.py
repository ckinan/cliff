from ..model.TrackEntity import TrackEntity
from .. import db
from flask_login import login_required
from flask import request, current_app as app
import datetime
from sqlalchemy.sql import text, bindparam
from sqlalchemy.types import Numeric, DateTime


@app.route('/api/tracks', methods=['GET'])
@login_required
def get_all_tracks():
    page = int(request.args.get('page'))
    stmt = text("""
        select sum(counter::numeric),
        date_trunc('hour', createdat)
        from track
        where createdat >= date_trunc('week', current_date + :x)
          and createdat < date_trunc('week', current_date + (:x + 7))
        group by date_trunc('hour', createdat)
        order by 2
    """)
    stmt = stmt.bindparams(
        bindparam("x", type_=Numeric)
    )
    tracks_by_hour = list(db.session.execute(stmt, {'x': page}))
    return {
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
