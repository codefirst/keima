$(function(){
    function log(text){
        if(console){ console.log(text); }
        var dom = $("#console");
        dom.html( dom.html() + new Date() + ": " + text + "\n");
    }
    log('start');

    var keima = new Keima(app.id);

    function subscribe(channel) {
        log("subscribe:" + channel);
        return keima.subscribe(channel);
    }

    function observe(channel, name) {
        log("observe:" + name + " at " + channel);
        keima.channels[channel].bind(name, function(data){
            log("receive name: name=" + name + ", channel=" + channel + ", data=" + data);
        });
    }

    function publish(channel, name, data) {
        log("publish: channel=" + channel + ", name=" + name + ", data=" + data);
        keima.publish(channel, name, data);
    }

    subscribe('demo');
    observe('demo', 'event');

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