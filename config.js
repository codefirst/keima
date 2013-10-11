exports.mongodb = process.env.MONGO_URL || process.env.MONGOHQ_URL || 'mongodb://localhost/keimadb';
exports.redis   = {
        host : 'localhost',
        port : 6379
};
