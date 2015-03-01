// mongodb
exports.mongodb = process.env.MONGO_URL || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/keimadb';
// redis
exports.redis = {
        host : 'localhost',
        port : 6379
};
var redisURL = process.env.REDIS_URL || process.env.REDISTOGO_URL;
if (redisURL) {
  var rtg = require("url").parse(redisURL);
  exports.redis = {
        host : rtg.hostname,
        port : rtg.port,
        password: rtg.auth.split(":")[1]
  };
}
// twiiter
exports.twitter = {
        consumerKey : process.env.TWITTER_CONSUMER_KEY || '98QWlHwFPYhE3NAbyufs9A',
        consumerSecret : process.env.TWITTER_CONSUMER_SECRET || 'CovBLwmZOE5wkZ53lgoE9QjrJxTIsn9WeiDJNDx0TS8',
        callback : process.env.TWITTER_CALLBACK
};
