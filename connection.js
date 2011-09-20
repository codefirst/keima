const config     = require('./config');
const redis      = require('redis');
const subscriber = redis.createClient(config.redis.port, config.redis.host);
const publisher  = redis.createClient(config.redis.port, config.redis.host);
const model = require('./model');

function channel(app, name) {
    return app + "/"  + name;
}

exports.run = function(app, io) {
    app.get('/app/:app/demo', function(req, res){
        model.App.get(req.params.app,
                  function(app) {
                      res.render("demo",
                                 { title : "Getting start",
                                   app   : app })
                  });
    });

    app.post('/app/:app/publish', function(req, res){
        console.log(req.body);
        console.log("publish to : " + channel(req.params.app, req.body.channel));
        publisher.publish(channel(req.params.app, req.body.channel),
                          JSON.stringify({
                              name : req.body.name,
                              data : req.body.data
                          }));
        res.send('published');
    });

    io.sockets.on('connection', function (socket) {
        const app = socket.handshake.query.app;

        socket.on("subscribe", function(name){
            const ch = channel(app, name);
            console.log("subscribe:" + ch);
            subscriber.subscribe(ch);
        });

        subscriber.on("message", function(channel, data){
            const obj = JSON.parse(data);
            console.log("send message:" + data  + " at " + channel);
            socket.emit(obj.name, channel, obj.data);
        });
    });
}