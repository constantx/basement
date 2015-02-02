require('colors');

var http = require('http');
var path = require('path');
var express = require('express');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var app = express();
var server;
var IO;

// view engine setup
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// make the server
server = http.createServer(app);

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

// socket
IO = require('socket.io').listen(server);

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
      data: 'the cosmo'
    });
  });
});

module.exports = app;
