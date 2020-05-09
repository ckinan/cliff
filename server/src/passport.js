const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const SESSION_SECRET = process.env.SESSION_SECRET;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const redisClient = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
});
const bcrypt = require('bcrypt');
const CliffDb = require('./cliffDb');

module.exports = (app) => {
  app.use(cookieParser(SESSION_SECRET));
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: new Date(Date.now() + 30 * 86400 * 1000),
      },
      store: new redisStore({
        client: redisClient,
      }),
    })
  );

  passport.serializeUser(function (account, cb) {
    cb(null, account.id);
  });

  passport.deserializeUser(async function (id, cb) {
    cb(null, await CliffDb.findAccountById(id));
  });

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

  app.use(passport.initialize());
  app.use(passport.session());
};
