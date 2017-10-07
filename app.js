const port = process.env.PORT || 3000;
const ddbTable = 'messages';
const express = require('express'),
      ejs = require('ejs'),
      AWS = require('aws-sdk');
      bodyParser = require('body-parser'),
      timeAgo = require('node-time-ago'),
      marked = require('marked'),
      NodeRSA = require('node-rsa'),
      Redis = require('ioredis');

const app = express();

// AWS.config.loadFromPath('./aws.json');
AWS.config.update({region: 'us-west-1'});
const ddb = new AWS.DynamoDB();

const redisHost = process.env.REDIS_HOST;
const redisPort = 6379;
let redis = new Redis(redisHost);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.redirect('/c/home');
});

app.get('/c/:comm', function(req, res) {
  const c = req.params.comm;
  let succ = req.query.success;
  let error = req.query.error;
  if (succ == 1) {
    succ = true;
  } else {
    succ = false;
  }
  if (error == 1) {
    error = true;
  } else {
    error = false;
  }
  let docClient = new AWS.DynamoDB.DocumentClient();

  let params = {
    TableName: ddbTable,
    KeyConditionExpression: '#ch = :channel',
    ExpressionAttributeNames: {
      '#ch': 'channel'
    },
    ExpressionAttributeValues: {
      ':channel': c
    },
    Limt: 40,
    ScanIndexForward: false
  };

  docClient.query(params, function(err, data) {
    if (err) {
      console.log('Message getting error: ' + err);
      res.json('Error');
    } else {
      res.render('layout', {
        c: c,
        posts: data.Items,
        success: succ,
        error: error
      });
    }
  });
});

app.get('/c', function(req, res) {
  res.redirect('/c/home');
});

// A random id generator from Instagram engineering.
const EPOCH = 1300000000000;
function generateRowId(subid) {
  var ts = new Date().getTime() - EPOCH; // limit to recent
  var randid = Math.floor(Math.random() * 512);
  ts = ts * 64; // bit-shift << 6
  ts = ts + subid;
  return ts * 512 + randid % 512;
}

app.post('/message', function(req, res) {
  const date = new Date();
  const message = req.body.message;
  const channel = req.body.channel;
  const time = Date.now().toString();
  let item = {
    message: { S: message },
    channel: { S: channel },
    createdate: { S: date.toISOString() },
    id: { N: generateRowId(4).toString() },
    time: { N: time }
  };

  ddb.putItem(
    {
      TableName: ddbTable,
      Item: item
    },
    function(err, data) {
      if (err) {
        console.log('Message insert error: ' + err);
        res.redirect('/c/' + channel + '?error=1');
      } else {
        // Add item to redis
        redis.zincrby('channels', 1, channel);
        redis.sadd('channelsSet', channel);
        res.redirect('/c/' + channel + '?success=1');
      }
    }
  );
});

app.get('/overview', function(req, res) {
  res.render('overview');
});

app.get('/api/overview', function(req, res) {
  redis.zrevrange('channels', 0, 12, 'withscores').then(function(results) {
    const resToJSON = new Promise((resolve, reject) => {
      let g = {};
      for (let i = 0; i < results.length; i += 2) {
        g[results[i]] = parseInt(results[i + 1]);
      }
      resolve(JSON.stringify(g));
    });
    resToJSON.then(
      value => {
        res.json(JSON.parse(value)); // Success!
      },
      reason => {
        console.log(reason); // Error!
      }
    );
  });
});

app.get('/api/search', function(req, res) {
  redis.smembers('channelsSet').then(function(results) {
    res.json(results);
  });
});

app.listen(port, function() {
  console.log('Message board app listening on port ' + port);
});
