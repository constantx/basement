###global window:true, document:true###
###jshint devel: true###

"use strict"

require.config paths:
  libs: "libs"
  models: "models"
  views: "views"
  jquery: "libs/jquery-1.8.3"
  underscore: "libs/underscore-1.4.1"
  backbone: "libs/backbone-0.9.2"
  mustache: "libs/mustache-0.7.1"
  functional: "libs/functional"

require [
  "jquery"
], ($, App, AppView) ->

  $(document).ready ->

    socket = window.io.connect(window.location.hostname)
    socket.emit "hello"
    socket.on "hello-back", (res) ->
      if res.data then $("#hello").html(res.data)