// Environment variables
const dotenv = require('dotenv');
dotenv.config();
const APP_PORT = process.env.APP_PORT;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const LocalStrategy = require('passport-local').Strategy;

// App
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(expressSession);
const redisClient = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
});
const bcrypt = require('bcrypt');

passport.use(
  new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'username',
      passwordField: 'password',
      // passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    async function (username, password, cb) {
      const pool = new Pool();
      let account;
      account = await pool.query('SELECT * FROM account WHERE username = $1', [
        username,
      ]);
      if (account.rows == 0) {
        return cb(null, false);
      }

      if (!bcrypt.compareSync(password, account.rows[0].password)) {
        return cb(null, false);
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
app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://localhost:5000', // allow to server to accept request from different origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // allow session cookie from browser to pass through
  })
);

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

app.get('/hc', (req, res) => res.send('Server is up and running!'));

app.post(
  '/login',
  passport.authenticate('local', { failureRedirect: 'http://localhost:5000/' }),
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

app.get('/api/server/checkauth', isAuthenticated, function (req, res) {
  res.status(200).json({
    isAuthenticated: true,
  });
});

app.get('/api/server/tracks', isAuthenticated, async function (req, res) {
  const pool = new Pool();
  let tracks = await pool.query('SELECT * FROM track order by id desc');
  await pool.end();
  res.status(200).json({
    tracks: tracks.rows,
  });
});

app.post('/api/server/track', isAuthenticated, async function (req, res) {
  const pool = new Pool();
  await pool.query('INSERT INTO track (counter) VALUES ($1)', [
    req.body.counter,
  ]);
  await pool.end();

  res.status(200).json({
    status: true,
  });
});

app.get('/api/server/logout', (req, res) => {
  req.logout();
  res.status(200).json({
    isAuthenticated: false,
  });
});

app.listen(APP_PORT, () => console.log(`Running on port: ${APP_PORT}`));
