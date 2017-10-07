const port = process.env.PORT || 3000;
const ddbTable = 'messages';
const express = require('express'),
      ejs = require('ejs'),
      AWS = require('aws-sdk');
      bodyParser = require('body-parser'),
      timeAgo = require('node-time-ago'),
      marked = require('marked'),
      Redis = require('ioredis');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

AWS.config.update({region: process.env.AWS_REGION});

const messages = require('./controllers/messages');
const api = require('./controllers/api');

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', messages.toHome);
app.get('/c', messages.toHome);
app.get('/c/:comm', messages.getMessages);
app.post('/message', messages.postMessages);

app.get('/overview', function(req, res) {
  res.render('overview');
});

app.get('/api/overview', api.overview);
app.get('/api/search', api.search);

app.listen(port, function() {
  console.log(`Message board app listening on port ${port}`);
});
