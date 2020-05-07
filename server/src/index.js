const SERVER_PORT = process.env.SERVER_PORT;
const CLIENT_URL = process.env.CLIENT_URL;
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./routes');
const passport = require('./passport');
const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());
passport(app);
app.use(
  cors({
    origin: CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })
);
app.use(routes);
app.listen(SERVER_PORT, () => console.log(`Running on port: ${SERVER_PORT}`));
