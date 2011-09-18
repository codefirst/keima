
/**
 * Module dependencies.
 */

const express = require('express');
const app = module.exports = express.createServer();


app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
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
    res.render('index', {
        title: 'Keima'
    });
});

app.listen(app.settings.env == 'development' ? 3000 : 80);
console.log("Express server listening on port %d in %s mode",
            app.address().port,
            app.settings.env);
