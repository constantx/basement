$(document).ready(function() {
    var socket = io.connect(window.location.hostname);

    socket.emit('hello');

    socket.on('hello-back', function(res){
        $('#pageContent').append(
            '<h1>' + res.data + '</h1>'
        );
    });
});