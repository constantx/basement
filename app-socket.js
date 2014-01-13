/*jslint indent:2, node:true, nomen:true, unparam: true */
/*global require:false */

(function () {
  "use strict";

  var schedule = require('./models/Schedule');

  exports = module.exports = function (server) {
    var io = require("socket.io").listen(server);

    io.configure("development", function () {
      return io.set("log level", 2);
    });

    io.configure("production", function () {
      io.set("transports", ["websocket", "flashsocket", "htmlfile", "xhr-polling", "jsonp-polling"]);
      io.set("polling duration", 3);
      io.enable("browser client minification");
      io.enable("browser client etag");
      io.enable("browser client gzip");
      return io.set("log level", 1);
    });

    io.sockets.on("connection", function (socket) {

      socket.emit("game:schedule", schedule);

    });

    return io;
  };

}).call(this);
