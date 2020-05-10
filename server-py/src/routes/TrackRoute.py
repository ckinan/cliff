import datetime
from ..model.TrackEntity import TrackEntity
from ..server import app, CLIFF_DB_SESSION

@app.route('/tracks', methods=['GET'])
def get_all_tracks():
    return {
        'tracks': [x.to_dict() for x in CLIFF_DB_SESSION.query(TrackEntity).all()]
    }
