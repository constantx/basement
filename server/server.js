require('colors');

var express = require('express');
var http = require('http');
var path = require('path');
var routes = require('./routes');
var app = express();
var server = http.createServer(app);
var IO = require('socket.io').listen(server);
var PORT = process.env.PORT || 5000;

app.configure(function() {
  app.set('port', process.env.PORT || PORT);
  app.set('views', '' + __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express['static'](path.join(__dirname, 'public/')));
});

app.configure('development', function() {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
  app.locals.pretty = true;
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

app.get('/', routes.index);

if (!module.parent) {
  server.listen(app.get('port'), function() {
    console.log([
      '\n==================================================',
      '\nExpress server running on: http://localhost:',
      (app.get('port')),
      '\n=================================================='
    ].join('').green);
  });
}

IO.configure('development', function() {
  IO.set('log level', 2);
});

IO.configure('production', function() {
  IO.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
  IO.set('polling duration', 3);
  IO.enable('browser client minification');
  IO.enable('browser client etag');
  IO.enable('browser client gzip');
  IO.set('log level', 1);
  return;
});

IO.sockets.on('connection', function(socket) {
  socket.on('hello', function() {
    socket.emit('hello-back', {
      data: 'the basement'
    });
  });
});
