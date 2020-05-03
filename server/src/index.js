// Environment variables
const dotenv = require('dotenv');
dotenv.config();
const APP_PORT = process.env.APP_PORT;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

// App
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:3333/api/server/auth/google/callback`,
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
  cors({
    origin: /localhost:3000.*/, // allow to server to accept request from different origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
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

app.get('/', (req, res) => res.send('Hello World!2'));

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
    res.redirect('http://localhost:3000/');
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

app.get('/api/server/logout', (req, res) => {
  req.logout();
  res.status(200).json({
    isAuthenticated: false,
  });
});

app.listen(APP_PORT, () => console.log(`Running on port: ${APP_PORT}`));
