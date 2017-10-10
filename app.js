const port = process.env.PORT || 3000;

const express = require('express');
const ejs = require('ejs');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');

let DEBUG;
if (process.env.NODE_ENV !== 'production') {
  DEBUG = true;
}
DEBUG = DEBUG ? require('dotenv').load() : DEBUG = false;

AWS.config.update({ region: process.env.AWS_REGION });

const messages = require('./controllers/messages');
const api = require('./controllers/api');

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }));

app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));

app.get('/', messages.toHome);
app.get('/c', messages.toHome);
app.get('/c/:comm', messages.getMessages);
app.post('/message', messages.postMessages);

app.get('/overview', (req, res) => res.render('overview'));

app.get('/api/overview', api.overview);
app.get('/api/search', api.search);

app.listen(port, console.log(`Message board app listening on port ${port}.`));
