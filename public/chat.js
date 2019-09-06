var socket = io();

var message = $('#message');
var username = $('#username');
var chatline = document.getElementById('chatline');
var feedback = $('#feedback');
var send = $("#send");
var color = document.getElementById('color');
var textColor;

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
    if (username.val() === "") {
        alert("Please enter a username");
    }
    if (message.val() === "") {
        alert("Please enter a message");
    }
    else if (message.val() !== "" & username.val() !== "") {
        feedback.html('');
        message.val('');
        if (data.color === ('firebrick' || 'deepskyblue' || 'mediumslateblue')) {
            textColor = 'white';
        }
        else {
            textColor = '#555555';
        }
        chatline.innerHTML += '<li style=\'background-color: ' + data.color + '; color: ' + textColor + ';\'><strong>' + data.username + ': </strong>' + data.message + '</li>';
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