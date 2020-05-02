const express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('cookie-session');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // parse cookie header
const bodyParser = require('body-parser');

const { Pool, Client } = require('pg');
// pools will use environment variables
// for connection information

// Netlify particulars
const serverless = require('serverless-http');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Start - Passport js portion
// From https://github.com/passport/express-4.x-facebook-example/blob/master/server.js

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
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

// Create a new Express application.
var app = express();

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
/*app.use(
  cookieSession({
    name: 'session',
    keys: ['keyboard cat'],
    maxAge: 24 * 60 * 60 * 100,
  })
);*/
//app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    //cookie: {
    //      ephemeral: false,
    //secure: false,
    //},
  })
);

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: 'http://localhost:8888', // allow to server to accept request from different origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // allow session cookie from browser to pass through
  })
);

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

// Define routes. http://localhost:8888/api/server/
app.get('/api/server', function (req, res) {
  //console.log('------------home-----------');
  //console.log(req.user);
  res.redirect('/', { user: req.user });
});

app.get('/api/server/login', function (req, res) {
  // http://localhost:8888/api/server/login
  //console.log('------------login-----------');
  res.redirect('/');
});

app.get(
  '/api/server/auth/google',
  passport.authenticate('google', { scope: ['profile'], session: true })
);

app.get(
  '/api/server/auth/google/callback',
  passport.authenticate('google', {
    //successRedirect: '/',
    failureRedirect: '/api/server/login',
    session: true,
  }),
  function callback(req, res) {
    console.log('------------callback-----------');
    //console.log(req.user);
    console.info(`login user ${req.user && req.user.id} and redirect`);
    console.log('wooo we authenticated, here is our user object:', req.user);
    console.log(req.isAuthenticated());
    console.log(req.session);
    req.session.userId = req.user.id;
    res.redirect('/');
  }
);

/*
app.get(
  '/api/server/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function (req, res) {
    res.render('profile', { user: req.user });
  }
);
*/

const isAuthenticated = function (req, res, next) {
  console.log('------------isAuthenticated-----------');
  console.log(req.session);
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

// End - Passport js portion

// Netlify Particulars

// app.use('/api/server', router); // path must route to lambda: http://localhost:8888/api/server/fn2

module.exports = app;
module.exports.handler = serverless(app);
