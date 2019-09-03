var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

users = [];
connections = [];

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    socket.username = "User " + connections.length;

    socket.on('change_username', function(new_name) {
        socket.username = new_name.username;
    })

    socket.on('disconnect', function() {
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });
    socket.on('chat message', function(msg) {
        io.emit('chat message', {message: msg, username: socket.username});
    });
    socket.on('typing', function(data) {
        socket.broadcast.emit('typing', {username: socket.username});
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});