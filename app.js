// hello dolly
var express = require('express');
var routes  = require('./routes');
var http    = require('http');
var path    = require('path');
var app     = express();
var server  = http.createServer(app);
var fs      = require('fs');
var PORT    = process.env.PORT || 3000;
var IO      = require('socket.io').listen(server);

// Configuration
app.configure(function(){
    app.set('port', process.env.PORT || PORT);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.locals.pretty = true;
    app.locals.layout = false;
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

// environment specific config 
app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});

// Routes
app.get('/', routes.index);

// Only listen on $ node app.js
if (!module.parent) {
    server.listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'));
    });
}

//////////////////////////////////////////////////////////
// SOCKET.IO

IO.configure('development',function(){
    IO.set('log level', 2);
});

IO.configure('production',function(){
    IO.set('transports', [                     // enable all transports (optional if you want flashsocket)
        'websocket'
        ,'flashsocket'
        ,'htmlfile'
        ,'xhr-polling'
        ,'jsonp-polling'
    ]);
    IO.set("polling duration", 10);             // heroku polling duration

    IO.enable('browser client minification');  // send minified client
    IO.enable('browser client etag');          // apply etag caching logic based on version number
    IO.enable('browser client gzip');          // gzip the file
    IO.set('log level', 1);                    // reduce logging
});


IO.sockets.on('connection', function (socket){
    
    socket.on('hello', function(){
        socket.emit('hello-back', {
            data: 'the basement'
        });
    });

});