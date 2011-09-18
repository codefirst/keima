const model = require('./model');

exports.index = function(req, res){
    model.App.all(function(xs){
        res.render('app/index',
                   { title : 'app list',
                     apps  : xs });
    });
};

exports.new = function(req, res){
    res.render('app/new',{title: 'new app'});
};

exports.create = function(req, res){
    model.App.create(req.body.name,
                     function(error){
                         if(error){
                             res.send('app create error:' + error);
                         }else{
                             res.redirect('/app/');
                         }
                     });
};

exports.show = function(req, res){
    res.send('show app ' + req.params.app);
};

exports.edit = function(req, res){
    res.send('edit app ' + req.params.app);
};

exports.update = function(req, res){
    res.send('update app ' + req.params.app);
};

exports.destroy = function(req, res){
    res.send('destroy app ' + req.params.app);
};