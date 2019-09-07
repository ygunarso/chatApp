const express = require('express');
const socket = require('socket.io');

// App setup
var app = express();
var http = require('http').createServer(app);
var io = socket(http);

var PORT = process.env.PORT || 3000;

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

    socket.on('connections', function() {
        socket.emit('connections', connections.length);
    });

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


http.listen(PORT, function() {
    console.log(`listening ${PORT}`);
});