const AWS = require('aws-sdk');
const Redis = require('ioredis');

const ddbTable = 'messages';
const redisHost = process.env.REDIS_HOST;
const redis = new Redis(redisHost);

// Get the messages for the various communities.
module.exports.getMessages = (req, res) => {
  const c = req.params.comm;
  let { error, success: succ } = req.query;
  if (parseInt(succ, 10) === 1) {
    succ = true;
  } else {
    succ = false;
  }
  if (parseInt(error, 10) == 1) {
    error = true;
  } else {
    error = false;
  }
  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: ddbTable,
    KeyConditionExpression: '#ch = :channel',
    ExpressionAttributeNames: {
      '#ch': 'channel',
    },
    ExpressionAttributeValues: {
      ':channel': c,
    },
    Limt: 40,
    ScanIndexForward: false,
  };

  docClient.query(params, (err, data) => {
    if (err) {
      console.log(`Message getting error: ${err}`);
      res.json('Error');
    } else {
      res.render('layout', {
        c,
        posts: data.Items,
        success: succ,
        error,
      });
    }
  });
};

// A random id generator from Instagram engineering.
// A helper funciton used by `postMessages()`
const EPOCH = 1300000000000;
function generateRowId(subid) {
  let ts = new Date().getTime() - EPOCH; // limit to recent
  const randid = Math.floor(Math.random() * 512);
  ts *= 64; // bit-shift << 6
  ts += subid;
  return ts * 512 + randid % 512;
}

// When a new message for a community is POSTED:
module.exports.postMessages = (req, res) => {
  const date = new Date();
  const { message, channel } = req.body;
  const time = Date.now().toString();
  const item = {
    message: { S: message },
    channel: { S: channel },
    createdate: { S: date.toISOString() },
    id: { N: generateRowId(4).toString() },
    time: { N: time },
  };

  const ddb = new AWS.DynamoDB();
  ddb.putItem(
    {
      TableName: ddbTable,
      Item: item,
    },
    (err) => {
      if (err) {
        console.log(`Message insert error: ${err}`);
        res.redirect(`/c/${channel}?error=1`);
      } else {
        // Add item to redis
        redis.zincrby('channels', 1, channel);
        redis.sadd('channelsSet', channel);
        res.redirect(`/c/${channel}?success=1`);
      }
    });
};

// Helpful function to redirect to home
module.exports.toHome = (req, res) => {
  res.redirect('/c/home');
};
