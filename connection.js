const config     = require('./config');
const redis      = require('redis');
const subscriber = redis.createClient(config.redis.port, config.redis.host);
const publisher  = redis.createClient(config.redis.port, config.redis.host);
const model = require('./model');

function channel(app, name) {
    return app + "/"  + name;
}

exports.run = function(app, io) {
    app.post('/publish/:app', function(req, res){
        publisher.publish(channel(req.params.app, req.body.channel),
                          JSON.stringify({
                              name : req.body.name,
                              data : req.body.data
                          }));
        res.send('published');
    });

    io.sockets.on('connection', function (socket) {
        socket.emit('connected', {});

        const app = socket.handshake.query.app;

        socket.on("subscribe", function(name){
            const ch = channel(app, name);
            subscriber.subscribe(ch);
        });

        subscriber.on("message", function(channel, data){
            const obj = JSON.parse(data);
            socket.emit(obj.name, channel, obj.data);
        });

        socket.on('disconnect', function() {
            socket.emit('disconnected', {})
        });
    });
}