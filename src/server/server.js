const express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

// Netlify particulars
const serverless = require('serverless-http');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Start - Passport js portion
// From https://github.com/passport/express-4.x-facebook-example/blob/master/server.js

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:8888/api/server/auth/google/callback`,
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log('------------strategy-----------');
      console.log(profile);
      return cb(null, profile);
    }
  )
);

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
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(
  require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  })
);

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes. http://localhost:8888/api/server/
app.get('/api/server', function (req, res) {
  console.log('------------home-----------');
  console.log(req.user);
  res.render('home', { user: req.user });
});

app.get('/api/server/login', function (req, res) {
  // http://localhost:8888/api/server/login
  console.log('------------login-----------');
  res.render('login');
});

app.get(
  '/api/server/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

app.get(
  '/api/server/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/server/login',
  }),
  function (req, res) {
    console.log('------------callback-----------');
    console.log(req.user);
    res.redirect('/protected');
  }
);

app.get(
  '/api/server/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function (req, res) {
    res.render('profile', { user: req.user });
  }
);

// End - Passport js portion

// Netlify Particulars

// app.use('/api/server', router); // path must route to lambda: http://localhost:8888/api/server/fn2

module.exports = app;
module.exports.handler = serverless(app);
