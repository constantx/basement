(function() {
  var IO, PORT, app, express, fs, http, path, routes, server;

  require('coffee-script');

  require('colors');

  express = require("express");

  http = require("http");

  path = require("path");

  fs = require("fs");

  routes = require("./routes");

  app = express();

  server = http.createServer(app);

  IO = require("socket.io").listen(server);

  PORT = process.env.PORT || 5000;

  app.configure(function() {
    app.set("port", process.env.PORT || PORT);
    app.set("views", "" + __dirname + "/views");
    app.set("view engine", "jade");
    app.use(express.favicon());
    app.use(express.logger("dev"));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    return app.use(express["static"](path.join(__dirname, "public/")));
  });

  app.configure("development", function() {
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
    return app.locals.pretty = true;
  });

  app.configure("production", function() {
    return app.use(express.errorHandler());
  });

  app.get("/", routes.index);

  if (!module.parent) {
    server.listen(app.get("port"), function() {
      return console.log(("\n\n==================================================\nExpress server running on: http://localhost:" + (app.get("port")) + "\n==================================================").green);
    });
  }

  IO.configure("development", function() {
    return IO.set("log level", 2);
  });

  IO.configure("production", function() {
    IO.set("transports", ["websocket", "flashsocket", "htmlfile", "xhr-polling", "jsonp-polling"]);
    IO.set("polling duration", 10);
    IO.enable("browser client minification");
    IO.enable("browser client etag");
    IO.enable("browser client gzip");
    return IO.set("log level", 1);
  });

  IO.sockets.on("connection", function(socket) {
    return socket.on("hello", function() {
      return socket.emit("hello-back", {
        data: "the basement"
      });
    });
  });

}).call(this);
