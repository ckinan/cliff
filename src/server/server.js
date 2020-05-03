const express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const serverless = require('serverless-http');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const redis = require('redis');

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

let redisStore = require('connect-redis')(expressSession);
let redisClient = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:8888/api/server/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
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
  cb(null, user.id);
});

passport.deserializeUser(async function (obj, cb) {
  const pool = new Pool();
  const account = await pool.query('SELECT * FROM account WHERE id = $1', [
    obj,
  ]);
  await pool.end();
  cb(null, account.rows[0]);
});

var app = express();
app.use(require('morgan')('combined'));
app.use(cookieParser('keyboard cat'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: new redisStore({
      client: redisClient,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/server', function (req, res) {
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
    res.redirect('/');
  }
);

const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).json({
      message: 'not authenticated',
    });
  }
};

app.get('/api/server/checkauth', isAuthenticated, function (req, res) {
  res.status(200).json({
    status: 'Login successful!',
  });
});

module.exports = app;
module.exports.handler = serverless(app);
