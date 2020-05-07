// Environment variables
const SERVER_PORT = process.env.SERVER_PORT;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const CLIENT_URL = process.env.CLIENT_URL;
const LocalStrategy = require('passport-local').Strategy;

// App
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
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

// App Modules
const CliffDb = require('./cliffDb');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async function (username, password, cb) {
      const account = await CliffDb.findAccountByUsername(username);
      if (!account || !bcrypt.compareSync(password, account.password)) {
        return cb(null, false);
      }
      return cb(null, account);
    }
  )
);

passport.serializeUser(function (account, cb) {
  cb(null, account.id);
});

passport.deserializeUser(async function (id, cb) {
  cb(null, await CliffDb.findAccountById(id));
});

var app = express();
app.use(require('morgan')('combined'));
app.use(cookieParser('keyboard cat'));
app.use(bodyParser.json());
app.use(
  cors({
    origin: CLIENT_URL, // allow to server to accept request from different origin
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

app.get('/api/server/checkauth', isAuthenticated, function (req, res) {
  res.status(200).json({
    isAuthenticated: true,
  });
});

app.get('/api/server/tracks', isAuthenticated, async function (req, res) {
  res.status(200).json({
    tracks: await CliffDb.findAllTracks(),
  });
});

app.post('/api/server/track', isAuthenticated, async function (req, res) {
  await CliffDb.saveTrack(req.body.counter);
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

app.listen(SERVER_PORT, () => console.log(`Running on port: ${SERVER_PORT}`));
