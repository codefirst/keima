function Keima(app) {
    this.app      = app;
    this.socket   = io.connect('/?app=' + app);
    this.channels = {};
    return this;
}

(function(klass){
    function Channel(socket, name){
        this.socket = socket;
        this.name   = name;
    }
    Channel.prototype.bind = function(event, callback){
        var self = this;
        console.log(event);

        this.socket.on(event, function(channel, data){
            if(self.name == channel) { callback(data); }
        });
    };

    klass.prototype.subscribe = function(channel){
        this.socket.emit("subscribe", channel);
        var obj= new Channel( this.socket, this.app + "/" + channel);
        this.channels[channel] = obj;
        return obj;
    };

    function encodeHTMLForm( data ) {
        var params = [];

        for( var name in data ) {
            var value = data[ name ];
            var param = encodeURIComponent( name ).replace( /%20/g, '+' )
                + '=' + encodeURIComponent( value ).replace( /%20/g, '+' );
            params.push( param );
        }
        return params.join( '&' );
    }

    function post(url, data) {
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open( 'POST', url );
        xmlHttpRequest.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
        xmlHttpRequest.send( encodeHTMLForm( data ) );
    }

    klass.prototype.publish = function(channel, name, data) {
        post('/app/' + this.app + "/publish", {
            channel : channel,
            name    : name,
            data    : data
        });
    }
})(Keima);
