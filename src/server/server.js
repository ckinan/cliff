const express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const serverless = require('serverless-http');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const cookieParser = require('cookie-parser');

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:8888/api/server/auth/google/callback`,
      passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, cb) {
      //console.log('------------strategy-----------');
      //console.log(profile);
      const pool = new Pool();
      let account;
      account = await pool.query(
        'SELECT * FROM account WHERE provider_id = $1 AND provider_type = $2',
        [profile.id, 'google']
      );
      if (account.rows == 0) {
        account = await pool.query(
          'INSERT INTO account (provider_id, provider_type) VALUES ($1, $2) RETURNING *',
          [profile.id, 'google']
        );
      }
      await pool.end();
      return cb(null, account.rows[0]);
    }
  )
);

passport.serializeUser(function (user, cb) {
  console.log('---------serializeUser---------');
  console.log(user.id);
  cb(null, user.id);
});

passport.deserializeUser(async function (obj, cb) {
  console.log('---------deserializeUser---------');
  console.log(obj);
  const pool = new Pool();
  const account = await pool.query('SELECT * FROM account WHERE id = $1', [
    obj,
  ]);
  await pool.end();
  cb(null, account.rows[0]);
});

var app = express();
app.use(require('morgan')('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Define routes
app.get('/api/server', function (req, res) {
  //console.log('------------home-----------');
  //console.log(req.user);
  res.redirect('/');
});

app.get(
  '/api/server/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

app.get(
  '/api/server/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/server',
  }),
  function callback(req, res) {
    console.log('------------callback-----------');
    //console.log(req.user);
    console.info(`login user ${req.user && req.user.id} and redirect`);
    console.log('wooo we authenticated, here is our user object:', req.user);
    console.log(req.isAuthenticated());
    console.log(req.session);
    console.log('Inside req.login() callback');
    console.log(
      `req.session.passport: ${JSON.stringify(req.session.passport)}`
    );
    console.log(`req.user: ${JSON.stringify(req.user)}`);
    return res.redirect('/');
  }
);

const isAuthenticated = function (req, res, next) {
  console.log('------------isAuthenticated-----------');
  console.log(req.session);
  console.log(req.sessionID);
  console.log(req.user);
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).json({
      message: 'must be logged in to continue',
    });
  }
};

app.get('/api/server/checkauth', isAuthenticated, function (req, res) {
  console.log('------------checkauth-----------');
  console.log(req.session.passport);
  console.log(req.isAuthenticated());
  res.status(200).json({
    status: 'Login successful!',
  });
});

//module.exports = app;
module.exports.handler = serverless(app);
