
/**
 * Module dependencies.
 */

const express  = require('express');
const auth     = require('connect-auth');
const app = module.exports = express.createServer();

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(auth([
        auth.Twitter({consumerKey:    '98QWlHwFPYhE3NAbyufs9A',
                      consumerSecret: 'CovBLwmZOE5wkZ53lgoE9QjrJxTIsn9WeiDJNDx0TS8',
                      callback : 'http://0.0.0.0:3001/auth/twitter_callback' })]))
});

app.configure('production', function(){
    app.use(express.errorHandler());
    app.use(auth([
        auth.Twitter({consumerKey:    '98QWlHwFPYhE3NAbyufs9A',
                      consumerSecret: 'CovBLwmZOE5wkZ53lgoE9QjrJxTIsn9WeiDJNDx0TS8'})]))
});

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret : 'keima' }));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(require('stylus').middleware({ src: __dirname + '/public' }));
    app.use(express.static(__dirname + '/public'));
});

if(app.settings.env == 'development') {
    app.listen(3001);
}else{
    app.listen(80, 'keima.no.de');
}

const io = require('socket.io').listen(app);

// helper
require('./helper')(app);

// Routes
app.get('/', function(req, res){
    if( req.isAuthenticated()) {
        res.redirect('/app');
    } else {
        res.render('index', { title : 'Top page'})
    }
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

app.get('/login', function(req, res, params){
    req.authenticate(['twitter'],
        function(error, authenticated) {
            if(authenticated == true) {
                res.redirect('/app');
            } else if(authenticated == false){
                res.render('error/login_failed',{
                    status: 403
                });
            }
        })
});

app.get('/logout', function(req, res, params){
    req.logout();
    res.redirect('/');
});

app.get('/app*',function(req, res, next){
    if(req.isAuthenticated()) {
        next();
    } else {
        res.render('error/not_login',{
            title: 'Error: Not login',
            status: 403
        });
    }
});

const Resource = require('express-resource');
function resource(server, name, actions) {
    server.resource(name, actions);
    actions.extras(server, name);
}
resource(app, 'app', require('./app'));

const connection = require('./connection');
connection.run(app, io);

console.log("Express server listening on port %s:%d in %s mode",
            app.address().address,
            app.address().port,
            app.settings.env);
