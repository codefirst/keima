
/**
 * Module dependencies.
 */

const express = require('express');
const Resource = require('express-resource');
const app = module.exports = express.createServer();

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(require('stylus').middleware({ src: __dirname + '/public' }));
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes
app.get('/', function(req, res){
    res.redirect('/app');
});

app.get('/about', function(req, res) {
    res.render('about', {
        title : 'About'
    });
});

app.get('/help', function(req, res) {
    res.render('help', {
        title : 'Help'
    });
});

function resource(server, name, actions) {
    server.resource(name, actions);
    for(key in actions.extras){
        server.get('/' + name + '/:app/' + key, actions.extras[key]);
    }
}
resource(app, 'app', require('./app'));



app.listen(app.settings.env == 'development' ? 3001 : 80);

// socket.io
const io = require('socket.io').listen(app);
const connection = require('./connection');
connection.run(app, io);

console.log("Express server listening on port %d in %s mode",
            app.address().port,
            app.settings.env);
