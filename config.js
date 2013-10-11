exports.mongodb = process.env.MONGO_URL || process.env.MONGOHQ_URL || 'mongodb://localhost/keimadb';
exports.redis   = {
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
