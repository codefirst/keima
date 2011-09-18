exports.run = function(io) {
    io.sockets.on('connection', function (socket) {
        console.log(socket.handshake.query.app);
    });
}