$(function(){
    function log(text){
        if(console){ console.log(text); }
        var dom = $("#console");
        dom.html( dom.html() + text + "\n");
    }
    log('start');

    var socket = io.connect('http://localhost/?app=' + app.id);
});