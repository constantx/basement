// hello dolly
var express = require('express');
var app = module.exports = express.createServer();
var fs = require('fs');
var port = process.env.PORT || 3000;

// Configuration
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { layout: false, pretty: true });
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'nodejsisohsoawesome' }));
    app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
    app.use(express.static(__dirname + '/public'));
    app.use(express.favicon());
    app.use(express.logger('":method :url" :status'));
    app.use(app.router);
});

// environment specific config 
app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res, next){
    res.render('index',{
        title: 'hello dolly.'
    });
});

// Only listen on $ node app.js
if (!module.parent) {
    app.listen(port);
    console.log("Express server listening on port %d", app.address().port);
}

//////////////////////////////////////////////////////////
// SOCKET.IO 

var IO = require('socket.io').listen(app);

IO.configure('development',function(){
    IO.set('log level', 2);
});

IO.configure('production',function(){
    IO.enable('browser client minification');  // send minified client
    IO.enable('browser client etag');          // apply etag caching logic based on version number
    IO.enable('browser client gzip');          // gzip the file
    IO.set('log level', 1);                    // reduce logging
    
    IO.set('transports', [                     // enable all transports (optional if you want flashsocket)
        //'websocket'
        //,'flashsocket'
        //,'htmlfile'
        ,'xhr-polling'
        //,'jsonp-polling'
    ]);
    IO.set("polling duration", 10);             // heroku polling duration
});


IO.sockets.on('connection', function (socket){
    
    socket.on('hello', function(){
        socket.emit('hello', {
            data: 'hello dolly.'
        });
    });

});