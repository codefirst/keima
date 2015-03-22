
/**
 * Module dependencies.
 */

if(process.env.NODETIME_ACCOUNT_KEY) {
    require('nodetime').profile({
        accountKey: process.env.NODETIME_ACCOUNT_KEY,
        appName: 'Keima'
    });
}

const config     = require('./config');
const express  = require('express');
const auth     = require('connect-auth');
const app = module.exports = express();

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

app.configure(function() {
    app.use(express.cookieParser());
    app.use(express.session({ secret : 'keima' }));

    if(app.settings.env == 'development' || config.twitter.callback) {
        app.use(auth([
            auth.Twitter({consumerKey:    config.twitter.consumerKey,
                          consumerSecret: config.twitter.consumerSecret,
                          callback : config.twitter.callback || 'http://localhost:3001/auth/twitter_callback' })]));
    }else{
        app.use(auth([
            auth.Twitter({consumerKey:    config.twitter.consumerKey,
                          consumerSecret: config.twitter.consumerSecret})]))
    }
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());

    // helper
    app.use(require('./helper').helper);
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(require('stylus').middleware({ src: __dirname + '/public' }));
    app.use(express.static(__dirname + '/public'));

});

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

if(app.settings.env == 'development') {
    var listen = server.listen(3001);
}else{
    var listen = server.listen(process.env.PORT || 80);
}

// Routes
app.get('/', function(req, res){
    if( req.isAuthenticated()) {
        res.redirect('/app');
    } else {
        res.render('index', { title : 'Top page', layout:false})
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
        req.session.messages = null;
        next();
    } else {
        req.session.messages = [ 'You need to login' ];
        res.redirect('/');
    }
});


function resource(server, name, actions) {
    server.get("/"+name, actions.index);
    server.get("/"+name + "/new", actions.new);
    server.post("/"+name , actions.create);
    server.get("/"+name+"/:app" , actions.show);
    server.get("/"+name +"/:app/edit", actions.edit);
    server.put("/"+name+"/:app", actions.update);
    server.del("/"+name+"/:app", actions.destroy);
    actions.extras(server, listen, name);
}
resource(app, 'app', require('./app'));

const connection = require('./connection');
connection.run(app, io);

console.log("Express server listening on port %s:%d in %s mode",
            listen.address().address,
            listen.address().port,
            app.settings.env);
