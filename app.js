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
    model.App.create(req.body.title,
                     function(error){
                         if(error){
                             res.send('app create error:' + error);
                         }else{
                             res.redirect('/app/');
                         }
                     });
};

exports.show = function(req, res){
    model.App.get(req.params.app,
                  function(app) {
                      res.render("app/show",
                                 { title : 'show',
                                   app   : app })
                  });
};


exports.edit = function(req, res){
    model.App.get(req.params.app,
                  function(app) {
                      res.render("app/edit",
                                 { title : 'edit',
                                   app   : app })
                  });
};

exports.update = function(req, res){
    model.App.update(req.params.app,
                     { title : req.body.title },
                     function(){
                         res.redirect("/app/" + req.params.app)
                     });
};

exports.destroy = function(req, res){
    model.App.remove(req.params.app,
                     function() {
                         res.redirect("/app/")
                     });
};