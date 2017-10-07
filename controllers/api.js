const Redis = require("ioredis");
const redisHost = process.env.REDIS_HOST;
const redis = new Redis(redisHost);

// Return some of the most active channels for the graph:
module.exports.overview = function(req, res) {
  redis.zrevrange("channels", 0, 12, "withscores").then(function(results) {
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
};

// A basic search endpoint, return all the channels to be searched:
module.exports.search = function(req, res) {
  redis.smembers("channelsSet").then(function(results) {
    res.json(results);
  });
};
