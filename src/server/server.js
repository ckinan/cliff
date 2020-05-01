const express = require('express');
const serverless = require('serverless-http');
const app = express();

const router = express.Router();
router.get('/fn2', (req, res) => {
  console.log('here');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use('/api/server', router); // path must route to lambda: http://localhost:8888/api/server/fn2

module.exports = app;
module.exports.handler = serverless(app);
