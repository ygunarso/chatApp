var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var http = require('http').createServer(app);
var io = socket(http);

// Static files
app.use(express.static('public'));

users = [];
connections = [];

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/public/chat.js', function(req, res) {
    res.sendFile(__dirname + '/public/chat.js');
});


io.on('connection', function(socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    io.emit('connections', connections.length);

    // Emit message
    socket.on('chat', function(data) {
        io.emit('chat', data);
    });

    socket.on('disconnect', function() {
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    socket.on('typing', function(data) {
        socket.broadcast.emit('typing', data);
    });
});


http.listen(process.env.PORT || 3000, function() {
    console.log('listening on *:3000');
});