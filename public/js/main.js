$(document).ready(function() {
    var socket = io.connect(window.location.hostname);

    socket.emit('hello');

    socket.on('hellodolly', function(res){
        $('#pageContent').append(
            '<h1>' + res.data + '</h1>'
        );
    });
});