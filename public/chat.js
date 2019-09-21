var socket = io();

var message = $('#message');
var username = $('#username');
var chatline = document.getElementById('chatline');
var feedback = $('#feedback');
var send = $("#send");
var color = document.getElementById('color');
var time = document.getElementById('time');

// CSS
var textColor, float;

socket.emit('connections');

// Emit message
send.click(function() {
    socket.emit('chat', {
        message: message.val(), 
        username: username.val(),
        color: color.options[color.selectedIndex].value
    });
});
// Listen on message
socket.on('chat', function(data) {
    if (data.username === "") {
        alert("Please enter a username");
    }
    if (data.message === "") {
        alert("Please enter a message");
    }
    else if (data.username !== "" & data.message !== "") {
        if (username.val() === data.username) {
            float = 'right';
        }
        else {
            float = 'left';
        }
        chatline.innerHTML += '<li class=\'message\' style=\'color: ' + data.color 
                            + '; border-color: ' + data.color 
                            + '; float: ' + float 
                            + ';\'><strong>' + data.username 
                            + ': </strong>' + data.message + '</li>';
        var now = new Date();
        chatline.innerHTML += '<li class=\'time\' style=\'color: ' + data.color + ';\'>'+ now.getHours() + ':' + now.getMinutes() + '</li>';
        feedback.html('');
        message.val('');
    }

});
// Emit typing
message.bind('keypress', function(e) {
    if(e.which == 13) {
        send.click();
    }
    else {
        socket.emit('typing', username.val());
    }
});

// Listen on typing
socket.on('typing', function(data) {
    feedback.html($('<p><em>').text(data + " is typing a message..."));
});

// Listen for connection length
socket.on('connections', function(data) {
    document.getElementById('username').value = 'User ' + data;
})