const AWS = require("aws-sdk"),
  Redis = require("ioredis");

const ddbTable = "messages";
const redisHost = process.env.REDIS_HOST;
const redis = new Redis(redisHost);

// Get the messages for the various communities.
module.exports.getMessages = function(req, res) {
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
    KeyConditionExpression: "#ch = :channel",
    ExpressionAttributeNames: {
      "#ch": "channel"
    },
    ExpressionAttributeValues: {
      ":channel": c
    },
    Limt: 40,
    ScanIndexForward: false
  };

  docClient.query(params, function(err, data) {
    if (err) {
      console.log("Message getting error: " + err);
      res.json("Error");
    } else {
      res.render("layout", {
        c: c,
        posts: data.Items,
        success: succ,
        error: error
      });
    }
  });
};

// A random id generator from Instagram engineering.
// A helper funciton used by `postMessages()`
const EPOCH = 1300000000000;
function generateRowId(subid) {
  var ts = new Date().getTime() - EPOCH; // limit to recent
  var randid = Math.floor(Math.random() * 512);
  ts = ts * 64; // bit-shift << 6
  ts = ts + subid;
  return ts * 512 + randid % 512;
}

// When a new message for a community is POSTED:
module.exports.postMessages = function(req, res) {
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

  const ddb = new AWS.DynamoDB();
  ddb.putItem(
    {
      TableName: ddbTable,
      Item: item
    },
    function(err, data) {
      if (err) {
        console.log("Message insert error: " + err);
        res.redirect("/c/" + channel + "?error=1");
      } else {
        // Add item to redis
        redis.zincrby("channels", 1, channel);
        redis.sadd("channelsSet", channel);
        res.redirect("/c/" + channel + "?success=1");
      }
    }
  );
};

// Helpful function to redirect to home
module.exports.toHome = function(req, res) {
  res.redirect("/c/home");
};
