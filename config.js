// mongodb
exports.mongodb = process.env.MONGO_URL || process.env.MONGOHQ_URL || 'mongodb://localhost/keimadb';
// redis
exports.redis = {
        host : 'localhost',
        port : 6379
};
if (process.env.REDISTOGO_URL) {
  var rtg = require("url").parse(process.env.REDISTOGO_URL);
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
