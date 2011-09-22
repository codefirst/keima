function Keima(app) {
    this.initialize(this, app);
    return this;
}

(function(klass, document){
    var currentScript = (function (e) {
        if(e.nodeName.toLowerCase() == 'script') return e;
        else return arguments.callee(e.lastChild)
    })(document);

    var host = currentScript.src.replace(/^(https?:\/\/.[^\/]*)\/.*/,'$1');

    function Channel(socket, name){
        this.socket = socket;
        this.name   = name;
        return this;
    }

    Channel.prototype.bind = function(event, callback){
        var self = this;
        console.log(event);

        this.socket.on(event, function(channel, data){
            if(self.name == channel) {
                eval('var obj = ' + data);
                callback(obj);
            }
        });
    };

    function Connection(socket) {
        this.socket = socket;
        return this;
    }
    Connection.prototype.bind = function(name, callback){
        this.socket.on(name, callback);
    };

    klass.prototype.initialize = function(self, app){
        self.app      = app;
        self.socket   = io.connect(host + '/?app=' + app);
        self.channels = {};
        self.connection = new Connection(self.socket);
    }

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
        post('/publish/' + this.app , {
            channel : channel,
            name    : name,
            data    : data
        });
    }
})(Keima, document);
