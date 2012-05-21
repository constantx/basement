window.addEvent('domready', function() {
    var socket = io.connect(window.location.hostname);

    socket.emit('hello');
    
    socket.on('hellodolly', function(res){
        $('pageContent').adopt(
            new Element('h1', { html: res.data})
        );
    });

});