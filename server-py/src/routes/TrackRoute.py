import datetime
from ..model.TrackEntity import TrackEntity
from ..server import app, CLIFF_DB_SESSION

@app.route('/tracks', methods=['GET'])
def get_all_tracks():
    return f'Tracks: {CLIFF_DB_SESSION.query(TrackEntity).all()}'
