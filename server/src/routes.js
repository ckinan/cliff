const CLIENT_URL = process.env.CLIENT_URL;

const express = require('express');
const router = express.Router();
const passport = require('passport');
const CliffDb = require('./cliffDb');

router.get('/hc', (req, res) => res.send('Server is up and running!'));

router.post(
  '/login',
  passport.authenticate('local', { failureRedirect: CLIENT_URL }),
  function (req, res) {
    res.status(200).json({
      isAuthenticated: true,
    });
  }
);

const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).json({
      isAuthenticated: false,
    });
  }
};

router.get('/api/server/checkauth', isAuthenticated, function (req, res) {
  res.status(200).json({
    isAuthenticated: true,
  });
});

router.get('/api/server/tracks', isAuthenticated, async function (req, res) {
  res.status(200).json({
    tracks: await CliffDb.findAllTracks(),
  });
});

router.post('/api/server/track', isAuthenticated, async function (req, res) {
  await CliffDb.saveTrack(req.body.counter);
  res.status(200).json({
    status: true,
  });
});

router.get('/api/server/logout', (req, res) => {
  req.logout();
  res.status(200).json({
    isAuthenticated: false,
  });
});

module.exports = router;
