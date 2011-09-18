$(function(){
    function log(text){
        if(console){ console.log(text); }
        var dom = $("#console");
        dom.html( dom.html() + new Date() + ": " + text + "\n");
    }
    log('start');

    var socket = io.connect('http://localhost/?app=' + app.id);

    function subscribe(channel){
        log("subscribe:" + channel);
        socket.emit("subscribe", channel);
    }
    function observe(name){
        log("observe:" + name);
        socket.on(name, function(channel, data){
            log("receive name: name=" + name + ", channel=" + channel + ", data=" + data);
        });
    }
    function publish(channel, name, data){
        log("publish: channel=" + channel + ", name=" + name + ", data=" + data);
        jQuery.post('/app/' + app.id + "/publish",
                    {
                        channel : channel,
                        name    : name,
                        data    : data
                    },function(){});
    }

    subscribe('demo');
    observe('event');

    $('#subscribe').bind('submit', function(e){
        subscribe( $('.channel' ,e.target).val() );
        return false;
    });

    $('#observe').bind('submit', function(e){
        observe( $('.name' ,e.target).val() );
        return false;
    });

    $('#publish').bind('submit', function(e){
        publish( $('.channel' ,e.target).val(),
                 $('.name' ,e.target).val(),
                 $('.data' ,e.target).val() );
        return false;
    });
});