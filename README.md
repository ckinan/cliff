# cliff

Simple habit tracker.

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ckinan_cliff&metric=alert_status)](https://sonarcloud.io/dashboard?id=ckinan_cliff)

![](screenshot-0524.png)

## Features

- [x] Easy access button to log new entry of a habit
- [x] Multiple attempts of a habit in one day
- [x] Show a summary grouped by Day
- [x] Show all entries: Counter and timestamp
- [x] Login
- [x] Reports
- [ ] Edit attempt
- [ ] Delete attempt
- [ ] Manage Users

## TODOs
- [ ] Automation Tests

## Using

- ReactJS
- Java + Spring Boot
- Postgres
- Docker
- Redis
- Tailwind CSS

## Setup

### Pre-setup

Create `.env` file:

```.env
# Postgres
PGUSER={your postgres user}
PGHOST=cliff-postgres-container
PGPASSWORD={your postgres password}
PGDATABASE=cliff
PGPORT=5432
# Redis
REDIS_HOST=cliff-redis-container
REDIS_PORT=6379
REDIS_PASSWORD={your redis password}
# App
CLIENT_URL={your client url. e.g. http://localhost:7000}
SERVER_URL={your server url. e.g. http://localhost:7001}
SERVER_PORT=7001
# Python
SQLALCHEMY_DATABASE_URI=postgresql://{YOUR_PG_USER}:{YOUR_PG_PASSWORD}@cliff-postgres-container:5432/cliff
SECRET_KEY={your secret key for flask}
SESSION_REDIS={your redis connection string. e.g. redis://:<password>@cliff-redis-container:6379}
``` 

Insert your user - manually :'(  (for now):

```sql
INSERT INTO public.account (username, password) VALUES ('cesar', '<your password bcrypted>'); 
```

### Development

Run in docker:

```bash
docker-compose up --build
```

Open in browser: http://localhost:7000

## Tools used

- Pycharm
- Redis client (e.g. [Another Redis DeskTop Manager](https://www.electronjs.org/apps/anotherredisdesktopmanager))

## Refs:

These are the links of posts, documentation, Q&A, that helped me at some point during development.

- Tailwind setup: https://dev.to/hagnerd/setting-up-tailwind-with-create-react-app-4jd
- Google OpenID Connect: https://developers.google.com/identity/protocols/oauth2/openid-connect
- OAuth 2.0 and OpenID Connect (in plain English): https://www.youtube.com/watch?v=996OiexHze0
- User Authentication with OAuth 2.0: https://oauth.net/articles/authentication/
- OpenID Connect: https://openid.net/connect/
- Express Sessions: https://medium.com/@evangow/server-authentication-basics-express-sessions-passport-and-curl-359b7456003d
- Express on Netlify Functions: https://www.netlify.com/blog/2018/09/13/how-to-run-express.js-apps-with-netlify-functions/
- Netlify Functions + passportjs + google strategy: https://medium.com/@svengau/authentication-using-netlify-lambda-and-passportjs-%EF%B8%8F-51bfd80c6c11
- Netlify Functions + passportjs + github strategy: https://markus.oberlehner.net/blog/implementing-an-authentication-flow-with-passport-and-netlify-functions/
- Google OAuth in NodeJS: http://gregtrowbridge.com/node-authentication-with-google-oauth-part1-sessions/
- PassportJS (Twitter): https://medium.com/free-code-camp/how-to-set-up-twitter-oauth-using-passport-js-and-reactjs-9ffa6f49ef0
- PassportJS Repo: https://github.com/jaredhanson/passport/issues/244
- serverless-http: https://github.com/dougmoscrop/serverless-http/issues/41
- PassportJS (Examples) https://github.com/moribvndvs/passport-examples/blob/master/example-simple/passport.js
- Tutorial about how to setup docker in your React App: https://mherman.org/blog/dockerizing-a-react-app/
- Environment variables (ReactJS): https://stackoverflow.com/questions/52103155/reading-an-environment-variable-in-react-which-was-set-by-docker
