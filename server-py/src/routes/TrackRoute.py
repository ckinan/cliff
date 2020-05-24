from ..model.TrackEntity import TrackEntity
from .. import db
from flask_login import login_required
from flask import request, current_app as app
from datetime import datetime
from sqlalchemy.sql import text, bindparam
from sqlalchemy.types import String


@app.route('/api/tracks', methods=['GET'])
@login_required
def get_all_tracks():
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')

    # Assert input
    try:
        assert isinstance(start_date, str), start_date
        assert isinstance(end_date, str), end_date
        assert len(start_date) > 0
        assert len(end_date) > 0
    except AssertionError:
        return {
            'errorMessage': f'Bad request: Invalid startDate={start_date} or endDate={end_date}'
        }, 400

    stmt = text("""
        select sum(counter::numeric),
        date_trunc('hour', createdat)
        from track
        where createdat::date >= to_date(:start_date,'YYYY-MM-DD')
          and createdat::date <= to_date(:end_date,'YYYY-MM-DD')
        group by date_trunc('hour', createdat)
        order by 2
    """)
    stmt = stmt.bindparams(
        bindparam('start_date', type_=String),
        bindparam('end_date', type_=String)
    )
    tracks = list(db.session.execute(stmt, {
        'start_date': start_date,
        'end_date': end_date,
    }))
    return {
        'tracks': [{'counter': float(x[0]), 'date': x[1]} for x in tracks],
        'startDate': start_date,
        'endDate': end_date,
    }


@app.route('/api/track', methods=['POST'])
@login_required
def save_track():
    req_data = request.get_json()
    counter = req_data['counter']
    track = TrackEntity(counter=float(counter), createdat=datetime.now())
    db.session.add(track)
    db.session.commit()
    return {
        'status': 'OK'
    }, 200
