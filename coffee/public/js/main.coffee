###global document:true, NR:true, Backbone:true, $:true, _:true ###
###jshint devel: true###

"use strict"

$(document).ready ->
  socket = window.io.connect(window.location.hostname)
  socket.emit "hello"
  socket.on "hello-back", (res) ->
    if res.data then $("#hello").html(res.data)