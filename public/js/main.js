/*global window:true, document:true, require:true*/
/*jslint devel: true, indent:2*/


(function () {
  "use strict";
  require.config({
    paths: {
      libs: "libs",
      models: "models",
      views: "views",
      jquery: "libs/jquery-1.8.3",
      underscore: "libs/underscore-1.4.1",
      backbone: "libs/backbone-0.9.2",
      mustache: "libs/mustache-0.7.1",
      functional: "libs/functional"
    }
  });

  require(["jquery"], function($) {
    return $(document).ready(function() {
      var socket;

      socket = window.io.connect(window.location.hostname);
      socket.emit("hello");
      return socket.on("hello-back", function(res) {
        if (res.data) {
          return $("#hello").html(res.data);
        }
      });
    });
  });
}());
